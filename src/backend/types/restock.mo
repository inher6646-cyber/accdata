import Common "common";

module {
  public type Id = Common.Id;
  public type Timestamp = Common.Timestamp;
  public type Rupiah = Common.Rupiah;

  /// A stock replenishment. `cost` is the purchase price per unit.
  public type Restock = {
    id : Id;
    date : Timestamp;
    productId : Id;
    productName : Text;
    qty : Nat;
    cost : Rupiah;
    supplier : Text;
  };

  /// Input for recording a restock.
  public type NewRestock = {
    productId : Id;
    qty : Nat;
    cost : Rupiah;
    supplier : Text;
  };

  public type RestockError = {
    /// No product exists with the given id.
    #productNotFound : Id;
    /// `qty` is zero.
    #invalidQty;
  };
};
