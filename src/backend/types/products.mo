import Common "common";

module {
  public type Id = Common.Id;
  public type Rupiah = Common.Rupiah;

  /// A product sold on the marketplace.
  /// `price` is the selling price, `cost` the latest purchase (modal) price,
  /// `stock` the current available quantity.
  public type Product = {
    id : Id;
    name : Text;
    price : Rupiah;
    cost : Rupiah;
    stock : Nat;
  };

  /// A product together with its derived sales quantity
  /// (sum of `qty` over every transaction that references it).
  public type ProductView = {
    id : Id;
    name : Text;
    price : Rupiah;
    cost : Rupiah;
    stock : Nat;
    sold : Nat;
  };

  /// Input for creating a product. Numeric fields are optional and default to 0.
  public type NewProduct = {
    name : Text;
    price : ?Rupiah;
    cost : ?Rupiah;
    stock : ?Nat;
  };

  public type ProductError = {
    /// `name` was empty after trimming.
    #emptyName;
    /// No product exists with the given id.
    #notFound : Id;
  };
};
