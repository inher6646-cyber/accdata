import Common "common";
import Products "products";
import Transactions "transactions";

module {
  public type Rupiah = Common.Rupiah;

  /// Aggregated figures for the dashboard summary cards.
  public type DashboardSummary = {
    /// Total value of every transaction (`total` summed).
    omzet : Rupiah;
    /// Omzet minus the cost of goods sold
    /// (sum of `qty * product.cost` over every transaction).
    labaKotor : Int;
    /// Sum of all cash-in entries minus all cash-out entries.
    saldoKas : Int;
    /// Number of products whose current stock is 5 or less.
    produkStokMenipis : Nat;
  };

  /// Everything the dashboard needs in one call.
  public type DashboardData = {
    summary : DashboardSummary;
    /// The five most recent transactions, newest first.
    recentTransactions : [Transactions.Transaction];
    /// Products with stock <= 5, lowest stock first.
    lowStockProducts : [Products.ProductView];
  };
};
