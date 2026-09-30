import Map "mo:core/Map";
import List "mo:core/List";
import Result "mo:core/Result";
import Nat "mo:core/Nat";
import Types "../types/products";
import TransactionTypes "../types/transactions";
import Common "../types/common";

/// Domain logic for products and stock.
module {
  /// Shared mutable counters for id assignment.
  public type Counters = {
    var nextProductId : Common.Id;
  };

  /// Create a product. Numeric fields default to 0 when absent.
  /// Returns the new product id.
  public func create(
    products : Map.Map<Common.Id, Types.Product>,
    counters : Counters,
    input : Types.NewProduct,
  ) : Result.Result<Common.Id, Types.ProductError> {
    let name = input.name.trim(#predicate(func c = c == ' '));
    if (name == "") {
      return #err(#emptyName);
    };
    let id = counters.nextProductId;
    counters.nextProductId := id + 1;
    let product : Types.Product = {
      id;
      name;
      price = input.price ?? 0;
      cost = input.cost ?? 0;
      stock = input.stock ?? 0;
    };
    products.add(id, product);
    #ok(id);
  };

  /// All products with their derived sold quantity.
  public func list(
    products : Map.Map<Common.Id, Types.Product>,
    transactions : List.List<TransactionTypes.Transaction>,
  ) : [Types.ProductView] {
    let all = products.values().toArray();
    all.map(
      func(p) = {
        id = p.id;
        name = p.name;
        price = p.price;
        cost = p.cost;
        stock = p.stock;
        sold = transactions.foldLeft(
          0,
          func(acc, t) = if (t.productId == p.id) { acc + t.qty } else { acc },
        );
      }
    );
  };

  /// Delete a product by id. Returns false when it does not exist.
  public func remove(
    products : Map.Map<Common.Id, Types.Product>,
    id : Common.Id,
  ) : Bool {
    switch (products.get(id)) {
      case null { false };
      case (?_) {
        products.remove(id);
        true;
      };
    };
  };

  /// Look up a product by id.
  public func get(
    products : Map.Map<Common.Id, Types.Product>,
    id : Common.Id,
  ) : ?Types.Product {
    products.get(id);
  };

  /// Find a product by exact name.
  public func findByName(
    products : Map.Map<Common.Id, Types.Product>,
    name : Text,
  ) : ?Types.Product {
    products.values().find(func(p) = p.name == name);
  };
};
