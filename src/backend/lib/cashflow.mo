import List "mo:core/List";
import Result "mo:core/Result";
import Time "mo:core/Time";
import Nat "mo:core/Nat";
import Types "../types/cashflow";
import Common "../types/common";

/// Domain logic for the cash ledger.
module {
  public type Counters = {
    var nextCashflowId : Common.Id;
  };

  /// Append a manually recorded cash entry.
  public func create(
    cashflow : List.List<Types.CashflowEntry>,
    counters : Counters,
    input : Types.NewCashflowEntry,
  ) : Result.Result<Types.CashflowEntry, Types.CashflowError> {
    if (input.amount == 0) {
      return #err(#invalidAmount);
    };
    let id = counters.nextCashflowId;
    counters.nextCashflowId := id + 1;
    let entry : Types.CashflowEntry = {
      id;
      date = Time.now();
      entryType = input.entryType;
      amount = input.amount;
      note = input.note;
      source = #manual;
    };
    cashflow.add(entry);
    #ok(entry);
  };

  /// All entries ordered by date ascending with a running balance.
  public func listWithBalance(
    cashflow : List.List<Types.CashflowEntry>,
  ) : [Types.CashflowRow] {
    let all = cashflow.toArray();
    let sorted = all.sort(
      func(a, b) = if (a.date < b.date) { #less } else if (a.date > b.date) { #greater } else {
        if (a.id < b.id) { #less } else if (a.id > b.id) { #greater } else { #equal };
      }
    );
    var running : Int = 0;
    sorted.map(
      func(e) {
        running += signedAmount(e);
        {
          id = e.id;
          date = e.date;
          entryType = e.entryType;
          amount = e.amount;
          note = e.note;
          source = e.source;
          balance = running;
        };
      }
    );
  };

  /// Total balance: sum of all cash-in minus all cash-out.
  public func balance(
    cashflow : List.List<Types.CashflowEntry>,
  ) : Int {
    cashflow.foldLeft(0 : Int, func(acc, e) = acc + signedAmount(e));
  };

  func signedAmount(entry : Types.CashflowEntry) : Int {
    switch (entry.entryType) {
      case (#masuk) { entry.amount.toInt() };
      case (#keluar) { -entry.amount.toInt() };
    };
  };
};
