import Map "mo:core/Map";
import List "mo:core/List";
import Result "mo:core/Result";
import Time "mo:core/Time";
import Nat "mo:core/Nat";
import Types "../types/restock";
import ProductTypes "../types/products";
import CashflowTypes "../types/cashflow";
import Common "../types/common";

/// Domain logic for stock replenishment.
module {
  public type Counters = {
    var nextRestockId : Common.Id;
    var nextCashflowId : Common.Id;
  };

  /// Record a restock: increases stock, updates the product's cost to the new
  /// purchase price, and appends one cash-out entry equal to `qty * cost`.
  public func create(
    restocks : List.List<Types.Restock>,
    products : Map.Map<Common.Id, ProductTypes.Product>,
    cashflow : List.List<CashflowTypes.CashflowEntry>,
    counters : Counters,
    input : Types.NewRestock,
  ) : Result.Result<Types.Restock, Types.RestockError> {
    let product = switch (products.get(input.productId)) {
      case null { return #err(#productNotFound(input.productId)) };
      case (?p) { p };
    };
    if (input.qty == 0) {
      return #err(#invalidQty);
    };

    let total = input.qty * input.cost;
    let id = counters.nextRestockId;
    counters.nextRestockId := id + 1;
    let date = Time.now();

    let restock : Types.Restock = {
      id;
      date;
      productId = product.id;
      productName = product.name;
      qty = input.qty;
      cost = input.cost;
      supplier = input.supplier;
    };
    restocks.add(restock);

    // Increase stock and update the product's cost to the latest purchase price.
    products.add(product.id, {
      product with
      stock = product.stock + input.qty;
      cost = input.cost;
    });

    // Automatic cash-out entry.
    let cashId = counters.nextCashflowId;
    counters.nextCashflowId := cashId + 1;
    cashflow.add({
      id = cashId;
      date;
      entryType = #keluar;
      amount = total;
      note = "Restock " # product.name # " x" # input.qty.toText();
      source = #restock;
    });

    #ok(restock);
  };

  /// All restocks, newest first.
  public func list(
    restocks : List.List<Types.Restock>,
  ) : [Types.Restock] {
    let all = restocks.toArray();
    all.sort(
      func(a, b) = if (a.date > b.date) { #less } else if (a.date < b.date) { #greater } else {
        if (a.id > b.id) { #less } else if (a.id < b.id) { #greater } else { #equal };
      }
    );
  };
};
