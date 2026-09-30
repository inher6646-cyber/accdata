import Common "common";

module {
  public type Id = Common.Id;
  public type Timestamp = Common.Timestamp;
  public type Rupiah = Common.Rupiah;

  /// Direction of a cash movement.
  public type EntryType = {
    #masuk;
    #keluar;
  };

  /// Origin of a cash entry.
  public type EntrySource = {
    /// Entered by hand through the cash form.
    #manual;
    /// Created automatically when a transaction is saved.
    #transaksi;
    /// Created automatically when a restock is saved.
    #restock;
  };

  /// A single cash movement. `amount` is always a positive magnitude;
  /// `entryType` carries the direction.
  public type CashflowEntry = {
    id : Id;
    date : Timestamp;
    entryType : EntryType;
    amount : Rupiah;
    note : Text;
    source : EntrySource;
  };

  /// A cash entry with its running balance, computed over the full ledger
  /// ordered by date ascending (ties broken by id ascending).
  public type CashflowRow = {
    id : Id;
    date : Timestamp;
    entryType : EntryType;
    amount : Rupiah;
    note : Text;
    source : EntrySource;
    /// Balance after this entry has been applied.
    balance : Int;
  };

  /// Input for a manually recorded cash entry.
  public type NewCashflowEntry = {
    entryType : EntryType;
    amount : Rupiah;
    note : Text;
  };

  public type CashflowError = {
    /// `amount` is zero.
    #invalidAmount;
  };
};
