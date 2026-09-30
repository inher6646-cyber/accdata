import Map "mo:core/Map";
import List "mo:core/List";
import Nat "mo:core/Nat";
import Types "../types/dashboard";
import ProductTypes "../types/products";
import TransactionTypes "../types/transactions";
import CashflowTypes "../types/cashflow";
import Common "../types/common";

/// Aggregation logic for the dashboard.
module {
  /// Build the full dashboard payload from current state.
  public func build(
    products : Map.Map<Common.Id, ProductTypes.Product>,
    transactions : List.List<TransactionTypes.Transaction>,
    cashflow : List.List<CashflowTypes.CashflowEntry>,
  ) : Types.DashboardData {
    let allTransactions = transactions.toArray();

    // Omzet: total value of every transaction.
    let omzet = allTransactions.foldLeft(0, func(acc, t) = acc + t.total);

    // Laba kotor: omzet minus cost of goods sold. The cost basis is the
    // product's current `cost` (the latest purchase price).
    var cogs : Int = 0;
    for (t in allTransactions.values()) {
      let unitCost = switch (products.get(t.productId)) {
        case (?p) { p.cost };
        case null { 0 };
      };
      cogs += (t.qty * unitCost).toInt();
    };
    let labaKotor = omzet.toInt() - cogs;

    // Saldo kas: all cash-in minus all cash-out.
    let saldoKas = cashflow.foldLeft(
      0 : Int,
      func(acc, e) = switch (e.entryType) {
        case (#masuk) { acc + e.amount.toInt() };
        case (#keluar) { acc - e.amount.toInt() };
      },
    );

    // Products with stock <= 5, lowest stock first.
    let lowStock = products.values().toArray().filter(func(p) = p.stock <= 5);
    let lowStockSorted = lowStock.sort(
      func(a, b) = if (a.stock < b.stock) { #less } else if (a.stock > b.stock) { #greater } else {
        if (a.id < b.id) { #less } else if (a.id > b.id) { #greater } else { #equal };
      }
    );
    let lowStockViews = lowStockSorted.map(
      func(p) = {
        id = p.id;
        name = p.name;
        price = p.price;
        cost = p.cost;
        stock = p.stock;
        sold = allTransactions.foldLeft(
          0,
          func(acc, t) = if (t.productId == p.id) { acc + t.qty } else { acc },
        );
      }
    );

    // Five most recent transactions, newest first.
    let sortedTransactions = allTransactions.sort(
      func(a, b) = if (a.date > b.date) { #less } else if (a.date < b.date) { #greater } else {
        if (a.id > b.id) { #less } else if (a.id < b.id) { #greater } else { #equal };
      }
    );
    let recent = if (sortedTransactions.size() <= 5) {
      sortedTransactions;
    } else {
      sortedTransactions.sliceToArray(0, 5);
    };

    {
      summary = {
        omzet;
        labaKotor;
        saldoKas;
        produkStokMenipis = lowStockViews.size();
      };
      recentTransactions = recent;
      lowStockProducts = lowStockViews;
    };
  };
};
