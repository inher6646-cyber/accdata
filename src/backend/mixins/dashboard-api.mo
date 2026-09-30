import Map "mo:core/Map";
import List "mo:core/List";
import Types "../types/dashboard";
import ProductTypes "../types/products";
import TransactionTypes "../types/transactions";
import CashflowTypes "../types/cashflow";
import Common "../types/common";
import DashboardLib "../lib/dashboard";

/// Public API for the dashboard.
mixin (
  products : Map.Map<Common.Id, ProductTypes.Product>,
  transactions : List.List<TransactionTypes.Transaction>,
  cashflow : List.List<CashflowTypes.CashflowEntry>,
) {
  /// Summary cards plus recent transactions and low-stock products.
  public query func getDashboard() : async Types.DashboardData {
    DashboardLib.build(products, transactions, cashflow);
  };
};
