import { PocketIc } from "@dfinity/pic";
import type { Actor, CanisterFixture } from "@dfinity/pic";
import { afterAll, beforeAll, expect, it } from "vitest";

import { idlFactory } from "../../src/frontend/src/declarations/backend.did.js";
import type { _SERVICE } from "../../src/frontend/src/declarations/backend.did";

const PIC_URL = process.env.POCKET_IC_URL ?? "";
const BACKEND_WASM = process.env.BACKEND_WASM ?? "";
// Set only on a converted project: the last pre-EM revision, whose schema this
// app's migration chain replays from. Installing the current wasm onto an empty
// canister there traps IC0503 before any test runs.
const BASELINE_WASM = process.env.BACKEND_WASM_BASELINE;

let pic: PocketIc | undefined;
let actor: Actor<_SERVICE>;
let canisterId: CanisterFixture<_SERVICE>["canisterId"];

beforeAll(async () => {
  pic = await PocketIc.create(PIC_URL);
  if (BASELINE_WASM === undefined) {
    ({ actor, canisterId } = await pic.setupCanister<_SERVICE>({ idlFactory, wasm: BACKEND_WASM }));
    return;
  }
  // `[baseline, current]`, the same install contract the hosted deploy uses for
  // a converted project. The upgrade replays the chain from the legacy schema.
  const installed = await pic.setupCanister<_SERVICE>({ idlFactory, wasm: BASELINE_WASM });
  await pic.upgradeCanister({ canisterId: installed.canisterId, wasm: BACKEND_WASM, arg: new Uint8Array() });
  ({ actor, canisterId } = installed);
});

afterAll(async () => {
  // `?.` because `beforeAll` may not have got that far. A failed
  // `PocketIc.create` otherwise stacks "Cannot read properties of undefined"
  // on top of the real error and buries the one line that explains the run.
  await pic?.tearDown();
});

it("answers empty-state reads instead of trapping", async () => {
  await expect(actor.listProducts()).resolves.toEqual([]);
  await expect(actor.listTransactions()).resolves.toEqual([]);
  await expect(actor.listRestocks()).resolves.toEqual([]);
  await expect(actor.listCashflow()).resolves.toEqual([]);
  await expect(actor.getCashBalance()).resolves.toBe(0n);
  const dashboard = await actor.getDashboard();
  expect(dashboard.summary.omzet).toBe(0n);
  expect(dashboard.summary.saldoKas).toBe(0n);
  expect(dashboard.summary.produkStokMenipis).toBe(0n);
  expect(dashboard.recentTransactions).toEqual([]);
  expect(dashboard.lowStockProducts).toEqual([]);
});

it("creates a product with omitted numerics defaulting to zero", async () => {
  const created = await actor.createProduct({ name: "Produk Default", price: [], cost: [], stock: [] });
  expect(created).toHaveProperty("ok");
  const products = await actor.listProducts();
  const product = products.find((p) => p.name === "Produk Default");
  expect(product).toBeDefined();
  expect(product?.price).toBe(0n);
  expect(product?.cost).toBe(0n);
  expect(product?.stock).toBe(0n);
  expect(product?.sold).toBe(0n);
});

it("rejects a product with an empty name", async () => {
  const result = await actor.createProduct({ name: "   ", price: [], cost: [], stock: [] });
  expect(result).toMatchObject({ err: { emptyName: null } });
});

it("round-trips a manual transaction: decrements stock and records cash in", async () => {
  const created = await actor.createProduct({
    name: "Kaos",
    price: [75_000n],
    cost: [40_000n],
    stock: [10n],
  });
  if (!("ok" in created)) throw new Error("product was not created");
  const productId = created.ok;

  const tx = await actor.createTransaction({
    orderNo: "INV-001",
    productId,
    qty: 3n,
    status: { baru: null },
  });
  if (!("ok" in tx)) throw new Error("transaction was not created");
  expect(tx.ok.total).toBe(225_000n);
  expect(tx.ok.productName).toBe("Kaos");

  const products = await actor.listProducts();
  const product = products.find((p) => p.id === productId);
  expect(product?.stock).toBe(7n);
  expect(product?.sold).toBe(3n);

  const cashflow = await actor.listCashflow();
  const cashIn = cashflow.filter((row) => "transaksi" in row.source && "masuk" in row.entryType);
  expect(cashIn).toHaveLength(1);
  expect(cashIn[0].amount).toBe(225_000n);
  await expect(actor.getCashBalance()).resolves.toBe(225_000n);
});

it("rejects a transaction whose qty exceeds stock and leaves stock untouched", async () => {
  const created = await actor.createProduct({ name: "Topi", price: [45_000n], cost: [], stock: [2n] });
  if (!("ok" in created)) throw new Error("product was not created");
  const productId = created.ok;

  const tx = await actor.createTransaction({
    orderNo: "INV-002",
    productId,
    qty: 5n,
    status: { baru: null },
  });
  expect(tx).toMatchObject({
    err: { insufficientStock: { requested: 5n, available: 2n } },
  });

  const products = await actor.listProducts();
  expect(products.find((p) => p.id === productId)?.stock).toBe(2n);
});

it("changes a transaction status without touching stock", async () => {
  const created = await actor.createProduct({ name: "Jaket", price: [200_000n], cost: [], stock: [5n] });
  if (!("ok" in created)) throw new Error("product was not created");
  const productId = created.ok;
  const tx = await actor.createTransaction({
    orderNo: "INV-003",
    productId,
    qty: 2n,
    status: { baru: null },
  });
  if (!("ok" in tx)) throw new Error("transaction was not created");
  const txId = tx.ok.id;

  const updated = await actor.updateTransactionStatus(txId, { selesai: null });
  expect(updated).toMatchObject({ ok: { status: { selesai: null } } });

  const products = await actor.listProducts();
  expect(products.find((p) => p.id === productId)?.stock).toBe(3n);
});

it("imports TAB rows as selesai transactions without touching stock", async () => {
  const created = await actor.createProduct({ name: "Sepatu", price: [300_000n], cost: [], stock: [4n] });
  if (!("ok" in created)) throw new Error("product was not created");
  const productId = created.ok;

  const raw = [
    "29-September-2026\tINV-100\tSepatu\t2\t300000",
    "30-September-2026\tINV-101\tSandal Baru\t1\t50000",
    "",
    "bukan-tanggal\tINV-102\tSepatu\t1\t300000",
  ].join("\n");

  const summary = await actor.importTransactions(raw);
  expect(summary.succeeded).toBe(2n);
  expect(summary.skipped).toBe(2n);

  const products = await actor.listProducts();
  // Existing product stock is untouched by import.
  expect(products.find((p) => p.id === productId)?.stock).toBe(4n);
  // New product auto-created: price = unit price, stock 0, cost 0.
  const auto = products.find((p) => p.name === "Sandal Baru");
  expect(auto).toBeDefined();
  expect(auto?.price).toBe(50_000n);
  expect(auto?.stock).toBe(0n);
  expect(auto?.cost).toBe(0n);

  const transactions = await actor.listTransactions();
  const imported = transactions.filter((t) => t.orderNo === "INV-100" || t.orderNo === "INV-101");
  expect(imported).toHaveLength(2);
  for (const t of imported) {
    expect(t.status).toMatchObject({ selesai: null });
  }
});

it("records a restock: increases stock, updates cost, and records cash out", async () => {
  const created = await actor.createProduct({
    name: "Celana",
    price: [150_000n],
    cost: [90_000n],
    stock: [1n],
  });
  if (!("ok" in created)) throw new Error("product was not created");
  const productId = created.ok;

  const restock = await actor.createRestock({
    productId,
    qty: 5n,
    cost: 100_000n,
    supplier: "Grosir Jaya",
  });
  expect(restock).toHaveProperty("ok");

  const products = await actor.listProducts();
  const product = products.find((p) => p.id === productId);
  expect(product?.stock).toBe(6n);
  expect(product?.cost).toBe(100_000n);

  const cashflow = await actor.listCashflow();
  const cashOut = cashflow.filter((row) => "restock" in row.source && "keluar" in row.entryType);
  expect(cashOut).toHaveLength(1);
  expect(cashOut[0].amount).toBe(500_000n);
});

it("records a manual cash entry and keeps the running balance consistent", async () => {
  const before = await actor.getCashBalance();
  const created = await actor.createCashflowEntry({
    entryType: { masuk: null },
    amount: 1_000_000n,
    note: "Modal awal",
  });
  expect(created).toHaveProperty("ok");

  const after = await actor.getCashBalance();
  expect(after).toBe(before + 1_000_000n);

  const rows = await actor.listCashflow();
  const manual = rows.find((row) => row.note === "Modal awal");
  expect(manual).toBeDefined();
  expect(manual?.amount).toBe(1_000_000n);
  expect(manual?.source).toMatchObject({ manual: null });

  // The documented invariant: the total balance is the sum of every entry's
  // signed amount, independent of the per-row running balance ordering.
  const total = rows.reduce(
    (acc, row) => acc + ("masuk" in row.entryType ? row.amount : -row.amount),
    0n,
  );
  expect(after).toBe(total);
});

it("deletes a product and reports false for a missing id", async () => {
  const created = await actor.createProduct({ name: "Produk Hapus", price: [1_000n], cost: [], stock: [] });
  if (!("ok" in created)) throw new Error("product was not created");
  const productId = created.ok;

  await expect(actor.deleteProduct(productId)).resolves.toBe(true);
  const products = await actor.listProducts();
  expect(products.find((p) => p.id === productId)).toBeUndefined();
  await expect(actor.deleteProduct(999_999n)).resolves.toBe(false);
});

it("builds a dashboard summary consistent with the module data", async () => {
  const dashboard = await actor.getDashboard();
  const products = await actor.listProducts();
  const transactions = await actor.listTransactions();
  const balance = await actor.getCashBalance();

  const omzet = transactions.reduce((acc, t) => acc + t.total, 0n);
  expect(dashboard.summary.omzet).toBe(omzet);
  expect(dashboard.summary.saldoKas).toBe(balance);
  expect(dashboard.summary.produkStokMenipis).toBe(BigInt(products.filter((p) => p.stock <= 5n).length));
  expect(dashboard.recentTransactions.length).toBeLessThanOrEqual(5);
  expect(dashboard.lowStockProducts.every((p) => p.stock <= 5n)).toBe(true);
});
