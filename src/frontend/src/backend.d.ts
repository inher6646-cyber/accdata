import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface CashflowEntry {
    id: Id;
    entryType: EntryType;
    source: EntrySource;
    date: Timestamp;
    note: string;
    amount: Rupiah;
}
export interface CashflowRow {
    id: Id;
    entryType: EntryType;
    balance: bigint;
    source: EntrySource;
    date: Timestamp;
    note: string;
    amount: Rupiah;
}
export interface Cell {
    value: Value;
    name: string;
}
export interface DashboardData {
    recentTransactions: Array<Transaction>;
    summary: DashboardSummary;
    lowStockProducts: Array<ProductView>;
}
export interface DashboardSummary {
    omzet: Rupiah;
    saldoKas: bigint;
    produkStokMenipis: bigint;
    labaKotor: bigint;
}
export type Error_ = {
    __kind__: "FrontendOriginsNotConfigured";
    FrontendOriginsNotConfigured: null;
} | {
    __kind__: "MixedSsoSources";
    MixedSsoSources: {
        otherKeys: Array<string>;
        ssoKeys: Array<string>;
    };
} | {
    __kind__: "Stale";
    Stale: {
        ageNs: bigint;
    };
} | {
    __kind__: "MalformedCandid";
    MalformedCandid: null;
} | {
    __kind__: "AmbiguousAttribute";
    AmbiguousAttribute: {
        field: string;
        sources: Array<string>;
    };
} | {
    __kind__: "NoAttributes";
    NoAttributes: null;
} | {
    __kind__: "UnknownNonce";
    UnknownNonce: null;
} | {
    __kind__: "UntrustedSsoSource";
    UntrustedSsoSource: {
        domain: string;
    };
} | {
    __kind__: "MissingField";
    MissingField: string;
} | {
    __kind__: "FrontendOriginMismatch";
    FrontendOriginMismatch: {
        got: string;
        expected: Array<string>;
    };
};
export type Id = bigint;
export interface ImportSkip {
    line: bigint;
    reason: ImportSkipReason;
}
export type ImportSkipReason = {
    __kind__: "emptyLine";
    emptyLine: null;
} | {
    __kind__: "invalidRow";
    invalidRow: null;
} | {
    __kind__: "invalidNumber";
    invalidNumber: string;
} | {
    __kind__: "invalidDate";
    invalidDate: string;
};
export interface ImportSummary {
    skipped: bigint;
    details: Array<ImportSkip>;
    succeeded: bigint;
}
export interface NewCashflowEntry {
    entryType: EntryType;
    note: string;
    amount: Rupiah;
}
export interface NewProduct {
    cost?: Rupiah;
    name: string;
    stock?: bigint;
    price?: Rupiah;
}
export interface NewRestock {
    qty: bigint;
    supplier: string;
    cost: Rupiah;
    productId: Id;
}
export interface NewTransaction {
    qty: bigint;
    status: Status;
    productId: Id;
    orderNo: string;
}
export type ProductError = {
    __kind__: "emptyName";
    emptyName: null;
} | {
    __kind__: "notFound";
    notFound: Id;
};
export interface ProductView {
    id: Id;
    cost: Rupiah;
    name: string;
    sold: bigint;
    stock: bigint;
    price: Rupiah;
}
export interface Restock {
    id: Id;
    qty: bigint;
    supplier: string;
    cost: Rupiah;
    date: Timestamp;
    productId: Id;
    productName: string;
}
export type RestockError = {
    __kind__: "productNotFound";
    productNotFound: Id;
} | {
    __kind__: "invalidQty";
    invalidQty: null;
};
export type Result = {
    __kind__: "ok";
    ok: Transaction;
} | {
    __kind__: "err";
    err: TransactionError;
};
export type Result_1 = {
    __kind__: "ok";
    ok: Restock;
} | {
    __kind__: "err";
    err: RestockError;
};
export type Result_2 = {
    __kind__: "ok";
    ok: Id;
} | {
    __kind__: "err";
    err: ProductError;
};
export type Result_3 = {
    __kind__: "ok";
    ok: CashflowEntry;
} | {
    __kind__: "err";
    err: CashflowError;
};
export type Result_4 = {
    __kind__: "ok";
    ok: null;
} | {
    __kind__: "err";
    err: Error_;
};
export interface Result__1 {
    hasMore: boolean;
    rows: Array<Array<Cell>>;
}
export type Rupiah = bigint;
export type Timestamp = bigint;
export interface Transaction {
    id: Id;
    qty: bigint;
    status: Status;
    total: Rupiah;
    date: Timestamp;
    productId: Id;
    productName: string;
    orderNo: string;
}
export type TransactionError = {
    __kind__: "productNotFound";
    productNotFound: Id;
} | {
    __kind__: "invalidQty";
    invalidQty: null;
} | {
    __kind__: "notFound";
    notFound: Id;
} | {
    __kind__: "insufficientStock";
    insufficientStock: {
        requested: bigint;
        available: bigint;
    };
};
export type Value = {
    __kind__: "int";
    int: bigint;
} | {
    __kind__: "nat";
    nat: bigint;
} | {
    __kind__: "float";
    float: number;
} | {
    __kind__: "bool";
    bool: boolean;
} | {
    __kind__: "null";
    null: null;
} | {
    __kind__: "text";
    text: string;
};
export enum CashflowError {
    invalidAmount = "invalidAmount"
}
export enum EntrySource {
    transaksi = "transaksi",
    restock = "restock",
    manual = "manual"
}
export enum EntryType {
    masuk = "masuk",
    keluar = "keluar"
}
export enum Status {
    baru = "baru",
    selesai = "selesai",
    proses = "proses",
    kirim = "kirim"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    /**
     * / Record a manual cash entry (in or out).
     */
    createCashflowEntry(input: NewCashflowEntry): Promise<Result_3>;
    /**
     * / Create a product. Numeric fields may be omitted and default to 0.
     */
    createProduct(input: NewProduct): Promise<Result_2>;
    /**
     * / Record a restock. Increases stock, updates the product cost, and records
     * / a matching cash-out entry.
     */
    createRestock(input: NewRestock): Promise<Result_1>;
    /**
     * / Create a manual transaction. Validates stock, decrements it, and records
     * / a matching cash-in entry.
     */
    createTransaction(input: NewTransaction): Promise<Result>;
    /**
     * / Delete a product. Returns false when it does not exist.
     */
    deleteProduct(id: Id): Promise<boolean>;
    execute(qJson: string): Promise<Result__1>;
    /**
     * / Return the backend's public API documentation as Markdown.
     */
    getApiDoc(): Promise<string>;
    getCallerUserRole(): Promise<UserRole>;
    /**
     * / Current total cash balance.
     */
    getCashBalance(): Promise<bigint>;
    /**
     * / Summary cards plus recent transactions and low-stock products.
     */
    getDashboard(): Promise<DashboardData>;
    /**
     * / Import a raw TAB-separated paste. Returns a per-run summary of succeeded
     * / and skipped rows.
     */
    importTransactions(raw: string): Promise<ImportSummary>;
    isCallerAdmin(): Promise<boolean>;
    /**
     * / List every cash entry ordered by date ascending with a running balance.
     */
    listCashflow(): Promise<Array<CashflowRow>>;
    /**
     * / List every product with its derived sold quantity.
     */
    listProducts(): Promise<Array<ProductView>>;
    /**
     * / List all restocks, newest first.
     */
    listRestocks(): Promise<Array<Restock>>;
    /**
     * / List all transactions, newest first.
     */
    listTransactions(): Promise<Array<Transaction>>;
    schema(): Promise<string>;
    /**
     * / Change a transaction's status. Does not affect stock.
     */
    updateTransactionStatus(id: Id, status: Status): Promise<Result>;
}
