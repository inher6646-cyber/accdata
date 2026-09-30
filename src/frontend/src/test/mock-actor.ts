import { EntrySource, EntryType, Status } from "@/backend";
import type {
  CashflowRow,
  DashboardData,
  ImportSummary,
  ProductView,
  Restock,
  Transaction,
} from "@/types";

/**
 * Typed local actor mock. It implements exactly the public methods the pages
 * call, so a page test exercises the real component tree against a predictable
 * backend. It is a mock, not the canister: nothing here proves backend behavior.
 */
export interface MockBackendState {
  products: ProductView[];
  transactions: Transaction[];
  restocks: Restock[];
  cashflow: CashflowRow[];
  dashboard: DashboardData;
  importSummary: ImportSummary;
}

export interface MockActor {
  listProducts: () => Promise<ProductView[]>;
  listTransactions: () => Promise<Transaction[]>;
  listRestocks: () => Promise<Restock[]>;
  listCashflow: () => Promise<CashflowRow[]>;
  getCashBalance: () => Promise<bigint>;
  getDashboard: () => Promise<DashboardData>;
  createProduct: (input: {
    name: string;
    price?: bigint;
    cost?: bigint;
    stock?: bigint;
  }) => Promise<
    | { __kind__: "ok"; ok: bigint }
    | { __kind__: "err"; err: { __kind__: string } }
  >;
  deleteProduct: (id: bigint) => Promise<boolean>;
  createTransaction: (input: {
    orderNo: string;
    productId: bigint;
    qty: bigint;
    status: Status;
  }) => Promise<
    | { __kind__: "ok"; ok: Transaction }
    | { __kind__: "err"; err: { __kind__: string } }
  >;
  updateTransactionStatus: (
    id: bigint,
    status: Status,
  ) => Promise<
    | { __kind__: "ok"; ok: Transaction }
    | { __kind__: "err"; err: { __kind__: string } }
  >;
  importTransactions: (raw: string) => Promise<ImportSummary>;
  createRestock: (input: {
    productId: bigint;
    qty: bigint;
    cost: bigint;
    supplier: string;
  }) => Promise<
    | { __kind__: "ok"; ok: Restock }
    | { __kind__: "err"; err: { __kind__: string } }
  >;
  createCashflowEntry: (input: {
    entryType: EntryType;
    amount: bigint;
    note: string;
  }) => Promise<
    | { __kind__: "ok"; ok: CashflowRow }
    | { __kind__: "err"; err: { __kind__: string } }
  >;
}

export function emptyDashboard(): DashboardData {
  return {
    summary: { omzet: 0n, labaKotor: 0n, saldoKas: 0n, produkStokMenipis: 0n },
    recentTransactions: [],
    lowStockProducts: [],
  };
}

export function makeProduct(overrides: Partial<ProductView> = {}): ProductView {
  return {
    id: 1n,
    name: "Kaos Polos",
    price: 75_000n,
    cost: 40_000n,
    stock: 10n,
    sold: 0n,
    ...overrides,
  };
}

export function makeTransaction(
  overrides: Partial<Transaction> = {},
): Transaction {
  return {
    id: 1n,
    qty: 2n,
    status: Status.baru,
    total: 150_000n,
    date: BigInt(Date.UTC(2026, 8, 29)) * 1_000_000n,
    productId: 1n,
    productName: "Kaos Polos",
    orderNo: "INV-001",
    ...overrides,
  };
}

export function makeCashflowRow(
  overrides: Partial<CashflowRow> = {},
): CashflowRow {
  return {
    id: 1n,
    entryType: EntryType.masuk,
    balance: 100_000n,
    source: EntrySource.manual,
    date: BigInt(Date.UTC(2026, 8, 29)) * 1_000_000n,
    note: "Modal awal",
    amount: 100_000n,
    ...overrides,
  };
}

export function makeRestock(overrides: Partial<Restock> = {}): Restock {
  return {
    id: 1n,
    qty: 5n,
    supplier: "Grosir Jaya",
    cost: 100_000n,
    date: BigInt(Date.UTC(2026, 8, 29)) * 1_000_000n,
    productId: 1n,
    productName: "Kaos Polos",
    ...overrides,
  };
}

/** Build a mock actor whose reads return the supplied state. */
export function createMockActor(
  state: Partial<MockBackendState> = {},
): MockActor {
  const products = state.products ?? [];
  const transactions = state.transactions ?? [];
  const restocks = state.restocks ?? [];
  const cashflow = state.cashflow ?? [];
  const dashboard = state.dashboard ?? emptyDashboard();
  const importSummary = state.importSummary ?? {
    succeeded: 0n,
    skipped: 0n,
    details: [],
  };

  return {
    listProducts: async () => products,
    listTransactions: async () => transactions,
    listRestocks: async () => restocks,
    listCashflow: async () => cashflow,
    getCashBalance: async () =>
      cashflow.reduce(
        (acc, row) =>
          acc + (row.entryType === EntryType.masuk ? row.amount : -row.amount),
        0n,
      ),
    getDashboard: async () => dashboard,
    createProduct: async (_input) => ({ __kind__: "ok", ok: 99n }),
    deleteProduct: async () => true,
    createTransaction: async (input) => ({
      __kind__: "ok",
      ok: makeTransaction({
        qty: input.qty,
        status: input.status,
        orderNo: input.orderNo,
      }),
    }),
    updateTransactionStatus: async (id, status) => ({
      __kind__: "ok",
      ok: makeTransaction({ id, status }),
    }),
    importTransactions: async () => importSummary,
    createRestock: async (input) => ({
      __kind__: "ok",
      ok: makeRestock({
        qty: input.qty,
        cost: input.cost,
        supplier: input.supplier,
      }),
    }),
    createCashflowEntry: async (input) => ({
      __kind__: "ok",
      ok: makeCashflowRow({
        entryType: input.entryType,
        amount: input.amount,
        note: input.note,
      }),
    }),
  };
}
