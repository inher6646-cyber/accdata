import type {
  CashflowEntry,
  CashflowRow,
  DashboardData,
  DashboardSummary,
  EntrySource,
  EntryType,
  Id,
  ImportSummary,
  NewCashflowEntry,
  NewProduct,
  NewRestock,
  NewTransaction,
  ProductView,
  Restock,
  Rupiah,
  Status,
  Timestamp,
  Transaction,
} from "@/backend";

export type {
  CashflowEntry,
  CashflowRow,
  DashboardData,
  DashboardSummary,
  EntrySource,
  EntryType,
  Id,
  ImportSummary,
  NewCashflowEntry,
  NewProduct,
  NewRestock,
  NewTransaction,
  ProductView,
  Restock,
  Rupiah,
  Status,
  Timestamp,
  Transaction,
};

/** A navigation destination in the app shell. */
export interface NavItem {
  to: string;
  label: string;
  description: string;
  icon: "dashboard" | "produk" | "transaksi" | "restock" | "kas";
}

/** Result of a backend mutation that returns a Result union. */
export interface MutationOutcome {
  ok: boolean;
  message: string;
}
