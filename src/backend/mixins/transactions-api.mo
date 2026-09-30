import Map "mo:core/Map";
import List "mo:core/List";
import Result "mo:core/Result";
import Types "../types/transactions";
import ProductTypes "../types/products";
import CashflowTypes "../types/cashflow";
import Common "../types/common";
import TransactionsLib "../lib/transactions";

/// Public API for sales transactions and bulk import.
mixin (
  transactions : List.List<Types.Transaction>,
  products : Map.Map<Common.Id, ProductTypes.Product>,
  cashflow : List.List<CashflowTypes.CashflowEntry>,
  counters : {
    var nextTransactionId : Common.Id;
    var nextProductId : Common.Id;
    var nextCashflowId : Common.Id;
  },
) {
  /// Create a manual transaction. Validates stock, decrements it, and records
  /// a matching cash-in entry.
  public shared func createTransaction(input : Types.NewTransaction) : async Result.Result<Types.Transaction, Types.TransactionError> {
    TransactionsLib.create(transactions, products, cashflow, counters, input);
  };

  /// List all transactions, newest first.
  public query func listTransactions() : async [Types.Transaction] {
    TransactionsLib.list(transactions);
  };

  /// Change a transaction's status. Does not affect stock.
  public shared func updateTransactionStatus(id : Common.Id, status : Types.Status) : async Result.Result<Types.Transaction, Types.TransactionError> {
    TransactionsLib.updateStatus(transactions, id, status);
  };

  /// Import a raw TAB-separated paste. Returns a per-run summary of succeeded
  /// and skipped rows.
  public shared func importTransactions(raw : Text) : async Types.ImportSummary {
    let parsed = TransactionsLib.parseImport(raw);
    let summary = TransactionsLib.importRows(transactions, products, cashflow, counters, parsed.rows);
    {
      succeeded = summary.succeeded;
      skipped = summary.skipped + parsed.skipped.size();
      details = parsed.skipped;
    };
  };
};
