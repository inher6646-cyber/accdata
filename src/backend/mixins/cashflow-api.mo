import List "mo:core/List";
import Result "mo:core/Result";
import Types "../types/cashflow";
import Common "../types/common";
import CashflowLib "../lib/cashflow";

/// Public API for the cash ledger.
mixin (
  cashflow : List.List<Types.CashflowEntry>,
  counters : { var nextCashflowId : Common.Id },
) {
  /// Record a manual cash entry (in or out).
  public shared func createCashflowEntry(input : Types.NewCashflowEntry) : async Result.Result<Types.CashflowEntry, Types.CashflowError> {
    CashflowLib.create(cashflow, counters, input);
  };

  /// List every cash entry ordered by date ascending with a running balance.
  public query func listCashflow() : async [Types.CashflowRow] {
    CashflowLib.listWithBalance(cashflow);
  };

  /// Current total cash balance.
  public query func getCashBalance() : async Int {
    CashflowLib.balance(cashflow);
  };
};
