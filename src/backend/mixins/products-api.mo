import Map "mo:core/Map";
import List "mo:core/List";
import Result "mo:core/Result";
import Types "../types/products";
import TransactionTypes "../types/transactions";
import Common "../types/common";
import ProductsLib "../lib/products";

/// Public API for products and stock.
mixin (
  products : Map.Map<Common.Id, Types.Product>,
  transactions : List.List<TransactionTypes.Transaction>,
  counters : { var nextProductId : Common.Id },
) {
  /// Create a product. Numeric fields may be omitted and default to 0.
  public shared func createProduct(input : Types.NewProduct) : async Result.Result<Common.Id, Types.ProductError> {
    ProductsLib.create(products, counters, input);
  };

  /// List every product with its derived sold quantity.
  public query func listProducts() : async [Types.ProductView] {
    ProductsLib.list(products, transactions);
  };

  /// Delete a product. Returns false when it does not exist.
  public shared func deleteProduct(id : Common.Id) : async Bool {
    ProductsLib.remove(products, id);
  };
};
