import Map "mo:core/Map";
import List "mo:core/List";
import Result "mo:core/Result";
import Time "mo:core/Time";
import Nat "mo:core/Nat";
import Types "../types/transactions";
import ProductTypes "../types/products";
import CashflowTypes "../types/cashflow";
import Common "../types/common";

/// Domain logic for sales transactions, including bulk import.
module {
  public type Counters = {
    var nextTransactionId : Common.Id;
    var nextProductId : Common.Id;
    var nextCashflowId : Common.Id;
  };

  /// Create a manual transaction: validates stock, decrements it, and appends
  /// one cash-in entry equal to the transaction total.
  public func create(
    transactions : List.List<Types.Transaction>,
    products : Map.Map<Common.Id, ProductTypes.Product>,
    cashflow : List.List<CashflowTypes.CashflowEntry>,
    counters : Counters,
    input : Types.NewTransaction,
  ) : Result.Result<Types.Transaction, Types.TransactionError> {
    let product = switch (products.get(input.productId)) {
      case null { return #err(#productNotFound(input.productId)) };
      case (?p) { p };
    };
    if (input.qty == 0) {
      return #err(#invalidQty);
    };
    if (input.qty > product.stock) {
      return #err(#insufficientStock({ available = product.stock; requested = input.qty }));
    };

    let total = input.qty * product.price;
    let id = counters.nextTransactionId;
    counters.nextTransactionId := id + 1;

    let transaction : Types.Transaction = {
      id;
      date = Time.now();
      orderNo = input.orderNo;
      productId = product.id;
      productName = product.name;
      qty = input.qty;
      total;
      status = input.status;
    };
    transactions.add(transaction);

    // Decrement stock.
    products.add(product.id, { product with stock = product.stock - input.qty });

    // Automatic cash-in entry.
    let cashId = counters.nextCashflowId;
    counters.nextCashflowId := cashId + 1;
    cashflow.add({
      id = cashId;
      date = transaction.date;
      entryType = #masuk;
      amount = total;
      note = "Penjualan " # product.name # " x" # input.qty.toText();
      source = #transaksi;
    });

    #ok(transaction);
  };

  /// All transactions, newest first.
  public func list(
    transactions : List.List<Types.Transaction>,
  ) : [Types.Transaction] {
    let all = transactions.toArray();
    all.sort(
      func(a, b) = if (a.date > b.date) { #less } else if (a.date < b.date) { #greater } else {
        if (a.id > b.id) { #less } else if (a.id < b.id) { #greater } else { #equal };
      }
    );
  };

  /// Change a transaction's status. Never touches stock.
  public func updateStatus(
    transactions : List.List<Types.Transaction>,
    id : Common.Id,
    status : Types.Status,
  ) : Result.Result<Types.Transaction, Types.TransactionError> {
    switch (transactions.find(func(t) = t.id == id)) {
      case null { #err(#notFound(id)) };
      case (?existing) {
        let updated : Types.Transaction = { existing with status };
        let snapshot = transactions.toArray();
        transactions.clear();
        for (t in snapshot.values()) {
          if (t.id == id) { transactions.add(updated) } else { transactions.add(t) };
        };
        #ok(updated);
      };
    };
  };

  /// Import pasted rows. Creates missing products, records each row as a
  /// `#selesai` transaction without touching stock, and appends one cash-in
  /// entry per successful row.
  public func importRows(
    transactions : List.List<Types.Transaction>,
    products : Map.Map<Common.Id, ProductTypes.Product>,
    cashflow : List.List<CashflowTypes.CashflowEntry>,
    counters : Counters,
    rows : [Types.ImportRow],
  ) : Types.ImportSummary {
    var succeeded = 0;

    for (row in rows.values()) {
      let product = switch (findByName(products, row.productName)) {
        case (?p) { p };
        case null {
          // Auto-create the missing product: price = row unit price, stock/cost = 0.
          let newId = counters.nextProductId;
          counters.nextProductId := newId + 1;
          let created : ProductTypes.Product = {
            id = newId;
            name = row.productName;
            price = row.unitPrice;
            cost = 0;
            stock = 0;
          };
          products.add(newId, created);
          created;
        };
      };

      let total = row.qty * row.unitPrice;
      let id = counters.nextTransactionId;
      counters.nextTransactionId := id + 1;
      let date = parseDate(row.date) ?? Time.now();

      transactions.add({
        id;
        date;
        orderNo = row.orderNo;
        productId = product.id;
        productName = product.name;
        qty = row.qty;
        total;
        status = #selesai;
      });

      let cashId = counters.nextCashflowId;
      counters.nextCashflowId := cashId + 1;
      cashflow.add({
        id = cashId;
        date;
        entryType = #masuk;
        amount = total;
        note = "Impor penjualan " # product.name # " x" # row.qty.toText();
        source = #transaksi;
      });

      succeeded += 1;
    };

    {
      succeeded;
      skipped = 0;
      details = [];
    };
  };

  /// Parse a raw TAB-separated paste into import rows, reporting per-line
  /// failures. Lines are 1-based.
  public func parseImport(
    raw : Text,
  ) : { rows : [Types.ImportRow]; skipped : [Types.ImportSkip] } {
    let rows = List.empty<Types.ImportRow>();
    let skipped = List.empty<Types.ImportSkip>();
    var lineNo = 0;

    for (line in raw.split(#predicate(func c = c == '\n'))) {
      lineNo += 1;
      let trimmed = line.trim(#predicate(func c = c == '\r' or c == ' ' or c == '\t'));
      if (trimmed == "") {
        skipped.add({ line = lineNo; reason = #emptyLine });
      } else {
        let cols = line.split(#predicate(func c = c == '\t')).toArray();
        if (cols.size() < 5) {
          skipped.add({ line = lineNo; reason = #invalidRow });
        } else {
          let dateText = cols[0].trim(#predicate(func c = c == ' '));
          let orderNo = cols[1].trim(#predicate(func c = c == ' '));
          let productName = cols[2].trim(#predicate(func c = c == ' '));
          let qtyText = cols[3].trim(#predicate(func c = c == ' '));
          let priceText = cols[4].trim(#predicate(func c = c == ' '));

          if (dateText == "" or productName == "") {
            skipped.add({ line = lineNo; reason = #invalidRow });
          } else {
            switch (parseDate(dateText)) {
              case null { skipped.add({ line = lineNo; reason = #invalidDate(dateText) }) };
              case (?_) {
                switch (parseNat(qtyText), parseNat(priceText)) {
                  case (?qty, ?unitPrice) {
                    rows.add({
                      date = dateText;
                      orderNo;
                      productName;
                      qty;
                      unitPrice;
                    });
                  };
                  case _ {
                    skipped.add({
                      line = lineNo;
                      reason = #invalidNumber(qtyText # "|" # priceText);
                    });
                  };
                };
              };
            };
          };
        };
      };
    };

    { rows = rows.toArray(); skipped = skipped.toArray() };
  };

  // --- Internal helpers ---

  func findByName(
    products : Map.Map<Common.Id, ProductTypes.Product>,
    name : Text,
  ) : ?ProductTypes.Product {
    products.values().find(func(p) = p.name == name);
  };

  func parseNat(text : Text) : ?Nat {
    if (text == "") { return null };
    text.toNat();
  };

  /// Parse "29-September-2026" (Indonesian month names) into a nanosecond
  /// timestamp. Returns null when the format does not match.
  func parseDate(text : Text) : ?Common.Timestamp {
    let parts = text.split(#predicate(func c = c == '-')).toArray();
    if (parts.size() != 3) { return null };
    let day = switch (parseNat(parts[0])) { case (?d) d; case null { return null } };
    let month = monthNumber(parts[1]);
    let year = switch (parseNat(parts[2])) { case (?y) y; case null { return null } };
    if (day < 1 or day > 31 or month < 1 or year < 1970) { return null };
    let days = daysFromCivil(year, month, day);
    ?(days * 86_400_000_000_000);
  };

  func monthNumber(name : Text) : Nat {
    switch (name) {
      case "Januari" 1;
      case "Februari" 2;
      case "Maret" 3;
      case "April" 4;
      case "Mei" 5;
      case "Juni" 6;
      case "Juli" 7;
      case "Agustus" 8;
      case "September" 9;
      case "Oktober" 10;
      case "November" 11;
      case "Desember" 12;
      case _ 0;
    };
  };

  /// Days since 1970-01-01 for a proleptic Gregorian date (Howard Hinnant's
  /// days_from_civil algorithm). `month` is 1..12.
  func daysFromCivil(year : Nat, month : Nat, day : Nat) : Int {
    let y : Int = if (month <= 2) { year.toInt() - 1 } else { year.toInt() };
    let era : Int = (if (y >= 0) { y } else { y - 399 }) / 400;
    let yoe : Int = y - era * 400;
    let m : Int = month.toInt();
    let d : Int = day.toInt();
    let mp : Int = if (m > 2) { m - 3 } else { m + 9 };
    let doy : Int = (153 * mp + 2) / 5 + d - 1;
    let doe : Int = yoe * 365 + yoe / 4 - yoe / 100 + doy;
    era * 146_097 + doe - 719_468;
  };
};
