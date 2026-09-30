import Map "mo:core/Map";
import List "mo:core/List";
import Result "mo:core/Result";
import Types "../types/restock";
import ProductTypes "../types/products";
import CashflowTypes "../types/cashflow";
import Common "../types/common";
import RestockLib "../lib/restock";

/// Public API for stock replenishment.
mixin (
  restocks : List.List<Types.Restock>,
  products : Map.Map<Common.Id, ProductTypes.Product>,
  cashflow : List.List<CashflowTypes.CashflowEntry>,
  counters : {
    var nextRestockId : Common.Id;
    var nextCashflowId : Common.Id;
  },
) {
  /// Record a restock. Increases stock, updates the product cost, and records
  /// a matching cash-out entry.
  public shared func createRestock(input : Types.NewRestock) : async Result.Result<Types.Restock, Types.RestockError> {
    RestockLib.create(restocks, products, cashflow, counters, input);
  };

  /// List all restocks, newest first.
  public query func listRestocks() : async [Types.Restock] {
    RestockLib.list(restocks);
  };
};
