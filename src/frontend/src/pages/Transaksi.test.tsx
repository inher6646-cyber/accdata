import { Status } from "@/backend";
import {
  createMockActor,
  makeProduct,
  makeTransaction,
} from "@/test/mock-actor";
import { renderPage } from "@/test/render";
import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@caffeineai/core-infrastructure", () => ({
  useActor: vi.fn(),
}));

import Transaksi from "@/pages/Transaksi";
import { useActor } from "@caffeineai/core-infrastructure";

const mockedUseActor = vi.mocked(useActor);

function setActor(actor: ReturnType<typeof createMockActor>) {
  mockedUseActor.mockReturnValue({ actor, isFetching: false } as never);
}

async function selectProduct(
  user: ReturnType<typeof userEvent.setup>,
  name: string,
) {
  await user.click(await screen.findByRole("combobox", { name: "Produk" }));
  await user.click(
    await screen.findByRole("option", { name: new RegExp(name) }),
  );
}

describe("Transaksi", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("computes the total automatically from qty × price", async () => {
    setActor(
      createMockActor({
        products: [
          makeProduct({
            id: 1n,
            name: "Kaos Polos",
            price: 75_000n,
            stock: 10n,
          }),
        ],
      }),
    );

    renderPage(Transaksi);

    const user = userEvent.setup();
    await selectProduct(user, "Kaos Polos");
    await user.type(screen.getByLabelText("Jumlah"), "3");

    expect(await screen.findByText("Rp 225.000")).toBeInTheDocument();
  });

  it("rejects a qty above stock and does not call the backend", async () => {
    const actor = createMockActor({
      products: [
        makeProduct({ id: 1n, name: "Kaos Polos", price: 75_000n, stock: 2n }),
      ],
    });
    const createTransaction = vi.fn();
    actor.createTransaction = createTransaction;
    setActor(actor);

    renderPage(Transaksi);

    const user = userEvent.setup();
    await selectProduct(user, "Kaos Polos");
    await user.type(screen.getByLabelText("Jumlah"), "5");
    await user.click(screen.getByRole("button", { name: /Simpan Transaksi/ }));

    expect(await screen.findByText(/Stok tidak cukup/)).toBeInTheDocument();
    expect(createTransaction).not.toHaveBeenCalled();
  });

  it("saves a valid transaction with the selected product, qty, and status", async () => {
    const actor = createMockActor({
      products: [
        makeProduct({ id: 4n, name: "Kaos Polos", price: 75_000n, stock: 10n }),
      ],
    });
    const createTransaction = vi
      .fn()
      .mockResolvedValue({ __kind__: "ok", ok: makeTransaction() });
    actor.createTransaction = createTransaction;
    setActor(actor);

    renderPage(Transaksi);

    const user = userEvent.setup();
    await user.type(await screen.findByLabelText(/No Pesanan/), "INV-900");
    await selectProduct(user, "Kaos Polos");
    await user.type(screen.getByLabelText("Jumlah"), "2");
    await user.click(screen.getByRole("button", { name: /Simpan Transaksi/ }));

    await waitFor(() => {
      expect(createTransaction).toHaveBeenCalledWith({
        orderNo: "INV-900",
        productId: 4n,
        qty: 2n,
        status: "baru",
      });
    });
  });

  it("changes a transaction status through the row dropdown", async () => {
    const actor = createMockActor({
      products: [makeProduct({ id: 1n, name: "Kaos Polos" })],
      transactions: [
        makeTransaction({
          id: 11n,
          productName: "Kaos Polos",
          status: Status.baru,
        }),
      ],
    });
    const updateStatus = vi.fn().mockResolvedValue({
      __kind__: "ok",
      ok: makeTransaction({ id: 11n, status: Status.selesai }),
    });
    actor.updateTransactionStatus = updateStatus;
    setActor(actor);

    renderPage(Transaksi);

    const user = userEvent.setup();
    await user.click(
      await screen.findByRole("combobox", { name: "Ubah status Kaos Polos" }),
    );
    await user.click(await screen.findByRole("option", { name: "Selesai" }));

    await waitFor(() => {
      expect(updateStatus).toHaveBeenCalledWith(11n, "selesai");
    });
  });

  it("imports pasted rows and shows the succeeded/skipped summary", async () => {
    const summary = {
      succeeded: 2n,
      skipped: 1n,
      details: [
        {
          line: 3n,
          reason: {
            __kind__: "invalidDate" as const,
            invalidDate: "bukan-tanggal",
          },
        },
      ],
    };
    const actor = createMockActor({ importSummary: summary });
    const importTransactions = vi.fn().mockResolvedValue(summary);
    actor.importTransactions = importTransactions;
    setActor(actor);

    renderPage(Transaksi);

    const user = userEvent.setup();
    const textarea = await screen.findByLabelText("Data tempelan");
    await user.type(textarea, "29-September-2026\tINV-1\tKaos\t2\t75000");
    await user.click(screen.getByRole("button", { name: /Impor Data/ }));

    await waitFor(() => {
      expect(importTransactions).toHaveBeenCalledWith(
        "29-September-2026\tINV-1\tKaos\t2\t75000",
      );
    });
    expect(await screen.findByText("2 baris berhasil")).toBeInTheDocument();
    expect(screen.getByText("1 baris dilewati")).toBeInTheDocument();
    expect(screen.getByText(/Baris 3/)).toBeInTheDocument();
  });

  it("shows an empty state when there are no transactions", async () => {
    setActor(createMockActor({ transactions: [] }));

    renderPage(Transaksi);

    expect(await screen.findByText("Belum ada transaksi")).toBeInTheDocument();
  });
});
