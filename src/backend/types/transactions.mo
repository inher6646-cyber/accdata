import Common "common";

module {
  public type Id = Common.Id;
  public type Timestamp = Common.Timestamp;
  public type Rupiah = Common.Rupiah;

  /// Fulfilment status of a transaction.
  public type Status = {
    #baru;
    #proses;
    #kirim;
    #selesai;
  };

  /// A sales transaction. `productName` is denormalised at creation time so the
  /// record stays readable even if the product is later deleted.
  public type Transaction = {
    id : Id;
    date : Timestamp;
    orderNo : Text;
    productId : Id;
    productName : Text;
    qty : Nat;
    total : Rupiah;
    status : Status;
  };

  /// Input for a manually entered transaction.
  public type NewTransaction = {
    orderNo : Text;
    productId : Id;
    qty : Nat;
    status : Status;
  };

  /// One parsed line of a bulk import paste.
  /// `date` is the raw date text as pasted (e.g. "29-September-2026").
  public type ImportRow = {
    date : Text;
    orderNo : Text;
    productName : Text;
    qty : Nat;
    unitPrice : Rupiah;
  };

  /// Why a single import row was skipped.
  public type ImportSkipReason = {
    /// Fewer than 5 TAB-separated columns, or a required column was empty.
    #invalidRow;
    /// The date text did not match the "DD-MonthName-YYYY" format.
    #invalidDate : Text;
    /// `qty` or `unitPrice` was not a valid non-negative number.
    #invalidNumber : Text;
    /// The row was blank and ignored.
    #emptyLine;
  };

  /// A skipped import row, with its 1-based position in the pasted text.
  public type ImportSkip = {
    line : Nat;
    reason : ImportSkipReason;
  };

  /// Result of one bulk import run.
  public type ImportSummary = {
    /// Number of rows that produced a transaction and a cash-in entry.
    succeeded : Nat;
    /// Number of rows that were skipped.
    skipped : Nat;
    /// Per-row skip details, in input order.
    details : [ImportSkip];
  };

  public type TransactionError = {
    /// No product exists with the given id.
    #productNotFound : Id;
    /// `qty` is zero.
    #invalidQty;
    /// `qty` exceeds the product's current stock.
    #insufficientStock : { available : Nat; requested : Nat };
    /// No transaction exists with the given id.
    #notFound : Id;
  };
};
