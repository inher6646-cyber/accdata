import AccessControl "mo:caffeineai-authorization/access-control";
import MixinAuthorization "mo:caffeineai-authorization/MixinAuthorization";
import Expose "mo:caffeineai-oql/Expose";
import Entity "mo:caffeineai-oql/Entity";
import MapEntity "mo:caffeineai-oql/MapEntity";
import ListEntity "mo:caffeineai-oql/ListEntity";
import RecordValue "mo:caffeineai-oql/RecordValue";
import NatValue "mo:caffeineai-oql/NatValue";
import TextValue "mo:caffeineai-oql/TextValue";
import IntValue "mo:caffeineai-oql/IntValue";

import Map "mo:core/Map";
import List "mo:core/List";

import Common "types/common";
import ProductTypes "types/products";
import TransactionTypes "types/transactions";
import RestockTypes "types/restock";
import CashflowTypes "types/cashflow";

import ProductsApi "mixins/products-api";
import TransactionsApi "mixins/transactions-api";
import RestockApi "mixins/restock-api";
import CashflowApi "mixins/cashflow-api";
import DashboardApi "mixins/dashboard-api";
import ApiDocMixin "mixins/api-doc";

actor {
  // --- Stable state (initial values come from the migration chain) ---
  let accessControlState : AccessControl.AccessControlState;
  let products : Map.Map<Common.Id, ProductTypes.Product>;
  let transactions : List.List<TransactionTypes.Transaction>;
  let restocks : List.List<RestockTypes.Restock>;
  let cashflow : List.List<CashflowTypes.CashflowEntry>;
  let counters : {
    var nextProductId : Common.Id;
    var nextTransactionId : Common.Id;
    var nextRestockId : Common.Id;
    var nextCashflowId : Common.Id;
  };

  // --- Authorization (platform-provided; domain methods are ungated) ---
  include MixinAuthorization(accessControlState, null);

  // --- Domain API ---
  include ProductsApi(products, transactions, counters);
  include TransactionsApi(transactions, products, cashflow, counters);
  include RestockApi(restocks, products, cashflow, counters);
  include CashflowApi(cashflow, counters);
  include DashboardApi(products, transactions, cashflow);
  include ApiDocMixin();

  // --- OQL payload helpers (variant -> text) ---
  func statusText(status : TransactionTypes.Status) : Text {
    switch (status) {
      case (#baru) "baru";
      case (#proses) "proses";
      case (#kirim) "kirim";
      case (#selesai) "selesai";
    };
  };

  func entryTypeText(entryType : CashflowTypes.EntryType) : Text {
    switch (entryType) {
      case (#masuk) "masuk";
      case (#keluar) "keluar";
    };
  };

  func sourceText(source : CashflowTypes.EntrySource) : Text {
    switch (source) {
      case (#manual) "manual";
      case (#transaksi) "transaksi";
      case (#restock) "restock";
    };
  };

  // --- OQL: expose the app's data to the Data Intelligence agent ---
  include Expose({
    entities = [
      products.toEntity("product", "Product", "id")
        .sample({ id = 0; name = ""; price = 0; cost = 0; stock = 0 })
        .controllerOnly()
        .build(),
      transactions.toEntityManual("transaction", "Transaction", "id")
        .sample({
          id = 0;
          date = 0;
          orderNo = "";
          productId = 0;
          productName = "";
          qty = 0;
          total = 0;
          status = #baru;
        })
        .payload("date", func t = t.date)
        .payload("orderNo", func t = t.orderNo)
        .payload("productId", func t = t.productId)
        .payload("productName", func t = t.productName)
        .payload("qty", func t = t.qty)
        .payload("total", func t = t.total)
        .payload("status", func t = statusText(t.status))
        .controllerOnly()
        .build(),
      restocks.toEntity("restock", "Restock", "id")
        .sample({ id = 0; date = 0; productId = 0; productName = ""; qty = 0; cost = 0; supplier = "" })
        .controllerOnly()
        .build(),
      cashflow.toEntityManual("cashflowEntry", "CashflowEntry", "id")
        .sample({ id = 0; date = 0; entryType = #masuk; amount = 0; note = ""; source = #manual })
        .payload("date", func e = e.date)
        .payload("entryType", func e = entryTypeText(e.entryType))
        .payload("amount", func e = e.amount)
        .payload("note", func e = e.note)
        .payload("source", func e = sourceText(e.source))
        .controllerOnly()
        .build(),
    ];
  });
};
