import AccessControl "mo:caffeineai-authorization/access-control";
import Map "mo:core/Map";
import List "mo:core/List";

module {
  type Id = Nat;
  type Timestamp = Int;
  type Rupiah = Nat;

  type Product = {
    id : Id;
    name : Text;
    price : Rupiah;
    cost : Rupiah;
    stock : Nat;
  };

  type Status = { #baru; #proses; #kirim; #selesai };

  type Transaction = {
    id : Id;
    date : Timestamp;
    orderNo : Text;
    productId : Id;
    productName : Text;
    qty : Nat;
    total : Rupiah;
    status : Status;
  };

  type Restock = {
    id : Id;
    date : Timestamp;
    productId : Id;
    productName : Text;
    qty : Nat;
    cost : Rupiah;
    supplier : Text;
  };

  type EntryType = { #masuk; #keluar };
  type EntrySource = { #manual; #transaksi; #restock };

  type CashflowEntry = {
    id : Id;
    date : Timestamp;
    entryType : EntryType;
    amount : Rupiah;
    note : Text;
    source : EntrySource;
  };

  type Counters = {
    var nextProductId : Id;
    var nextTransactionId : Id;
    var nextRestockId : Id;
    var nextCashflowId : Id;
  };

  public type OldActor = {};

  public type NewActor = {
    accessControlState : AccessControl.AccessControlState;
    products : Map.Map<Id, Product>;
    transactions : List.List<Transaction>;
    restocks : List.List<Restock>;
    cashflow : List.List<CashflowEntry>;
    counters : Counters;
  };

  public func migration(_ : OldActor) : NewActor {
    {
      accessControlState = AccessControl.initState();
      products = Map.empty();
      transactions = List.empty();
      restocks = List.empty();
      cashflow = List.empty();
      counters = {
        var nextProductId = 1;
        var nextTransactionId = 1;
        var nextRestockId = 1;
        var nextCashflowId = 1;
      };
    };
  };
};
