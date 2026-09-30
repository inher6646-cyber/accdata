import { c as createLucideIcon, r as reactExports, j as jsxRuntimeExports, W as Wallet, a as cn } from "./index-5E34msdd.js";
import { t as useCashflow, v as useCashBalance, B as Button, f as formatRupiah, w as useCreateCashflowEntry, E as EntryType, p as parseRupiah, x as entryTypeLabel, l as formatDate, y as entrySourceLabel } from "./format-CSXUHyIt.js";
import { C as Card, b as CardHeader, c as CardTitle, a as CardContent } from "./card-De3wFAH4.js";
import { L as Label, I as Input } from "./label-CMI0ejh3.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-CY_hz-oh.js";
import { S as Skeleton } from "./skeleton-D6apxnL6.js";
import { P as Plus } from "./plus-BZOm4FRB.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$3 = [
  ["path", { d: "M17 7 7 17", key: "15tmo1" }],
  ["path", { d: "M17 17H7V7", key: "1org7z" }]
];
const ArrowDownLeft = createLucideIcon("arrow-down-left", __iconNode$3);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["path", { d: "M7 7h10v10", key: "1tivn9" }],
  ["path", { d: "M7 17 17 7", key: "1vkiza" }]
];
const ArrowUpRight = createLucideIcon("arrow-up-right", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  [
    "path",
    {
      d: "M10 20a1 1 0 0 0 .553.895l2 1A1 1 0 0 0 14 21v-7a2 2 0 0 1 .517-1.341L21.74 4.67A1 1 0 0 0 21 3H3a1 1 0 0 0-.742 1.67l7.225 7.989A2 2 0 0 1 10 14z",
      key: "sc7q7i"
    }
  ]
];
const Funnel = createLucideIcon("funnel", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M18 6 6 18", key: "1bl5f8" }],
  ["path", { d: "m6 6 12 12", key: "d8bk6v" }]
];
const X = createLucideIcon("x", __iconNode);
const SOURCE_STYLES = {
  manual: "bg-secondary text-secondary-foreground",
  transaksi: "bg-primary/10 text-primary",
  restock: "bg-warning-soft text-warning"
};
function isMasuk(entryType) {
  return entryType === EntryType.masuk;
}
function AmountText({
  amount,
  entryType,
  className
}) {
  const masuk = isMasuk(entryType);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "span",
    {
      className: cn(
        "num font-semibold tabular-nums",
        masuk ? "text-success" : "text-destructive",
        className
      ),
      children: [
        masuk ? "+" : "−",
        formatRupiah(amount)
      ]
    }
  );
}
function SourceBadge({ source }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "span",
    {
      className: cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium",
        SOURCE_STYLES[source] ?? "bg-muted text-muted-foreground"
      ),
      children: entrySourceLabel(source)
    }
  );
}
function BalanceCard({
  balance,
  isLoading
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "overflow-hidden border-border shadow-subtle", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "gradient-primary px-5 py-5 text-primary-foreground sm:px-6 sm:py-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-primary-foreground/80", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Wallet, { className: "size-4", "aria-hidden": "true" }),
        "Saldo Kas Total"
      ] }),
      isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(
        Skeleton,
        {
          "data-ocid": "kas.balance.loading_state",
          className: "mt-3 h-9 w-48 bg-primary-foreground/20"
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
        "p",
        {
          "data-ocid": "kas.balance.text",
          className: "num mt-2 font-display text-3xl font-bold tracking-tight tabular-nums sm:text-4xl",
          children: formatRupiah(balance)
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-xs text-primary-foreground/75", children: "Gabungan entri manual, transaksi, dan restock." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "span",
      {
        "aria-hidden": "true",
        className: "hidden size-12 shrink-0 place-items-center rounded-xl bg-primary-foreground/15 sm:grid",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Wallet, { className: "size-6" })
      }
    )
  ] }) }) });
}
function ManualEntryForm() {
  const createEntry = useCreateCashflowEntry();
  const [entryType, setEntryType] = reactExports.useState(EntryType.masuk);
  const [jumlah, setJumlah] = reactExports.useState("");
  const [catatan, setCatatan] = reactExports.useState("");
  const [error, setError] = reactExports.useState(null);
  const amount = parseRupiah(jumlah);
  function handleSubmit(event) {
    event.preventDefault();
    if (amount <= 0) {
      setError("Jumlah harus lebih dari 0.");
      return;
    }
    setError(null);
    const payload = {
      entryType,
      amount: BigInt(amount),
      note: catatan.trim()
    };
    setJumlah("");
    setCatatan("");
    createEntry.mutate(payload, {
      onError: () => {
        setError("Gagal menyimpan entri kas. Coba lagi.");
      }
    });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-border shadow-subtle", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "pb-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2 font-display text-base font-semibold", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "size-4 text-primary", "aria-hidden": "true" }),
        "Catat Kas Manual"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Untuk biaya atau pemasukan di luar transaksi dan restock." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", noValidate: true, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 sm:grid-cols-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "kas-jenis", children: "Jenis" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Select,
            {
              value: entryType,
              onValueChange: (value) => setEntryType(value),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  SelectTrigger,
                  {
                    id: "kas-jenis",
                    "data-ocid": "kas.form.jenis_select",
                    className: "w-full",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Pilih jenis" })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: EntryType.masuk, children: "Masuk" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: EntryType.keluar, children: "Keluar" })
                ] })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "kas-jumlah", children: "Jumlah (Rp)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "kas-jumlah",
              "data-ocid": "kas.form.jumlah_input",
              inputMode: "numeric",
              autoComplete: "off",
              placeholder: "0",
              value: jumlah,
              "aria-invalid": error ? true : void 0,
              "aria-describedby": error ? "kas-jumlah-error" : void 0,
              onChange: (event) => {
                setJumlah(event.target.value);
                if (error) setError(null);
              },
              className: "num tabular-nums"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "kas-catatan", children: "Catatan" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            id: "kas-catatan",
            "data-ocid": "kas.form.catatan_input",
            autoComplete: "off",
            placeholder: "Contoh: bayar listrik toko",
            value: catatan,
            onChange: (event) => setCatatan(event.target.value)
          }
        )
      ] }),
      error ? /* @__PURE__ */ jsxRuntimeExports.jsx(
        "p",
        {
          id: "kas-jumlah-error",
          "data-ocid": "kas.form.error_state",
          role: "alert",
          className: "rounded-md bg-destructive-soft px-3 py-2 text-sm font-medium text-destructive",
          children: error
        }
      ) : null,
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "num text-sm text-muted-foreground tabular-nums", children: amount > 0 ? formatRupiah(amount) : "Masukkan jumlah" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            type: "submit",
            "data-ocid": "kas.form.submit_button",
            disabled: createEntry.isPending,
            className: "w-full sm:w-auto",
            children: createEntry.isPending ? "Menyimpan…" : "Simpan Entri"
          }
        )
      ] })
    ] }) })
  ] });
}
function FilterBar({
  jenis,
  onJenisChange,
  from,
  to,
  onFromChange,
  onToChange,
  onReset,
  isFiltered
}) {
  const jenisOptions = [
    { value: "semua", label: "Semua" },
    { value: "masuk", label: "Masuk" },
    { value: "keluar", label: "Keluar" }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-4 rounded-lg border border-border bg-card p-4 shadow-subtle", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-sm font-medium text-foreground", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Funnel, { className: "size-4 text-muted-foreground", "aria-hidden": "true" }),
      "Filter"
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 sm:grid-cols-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "kas-filter-jenis", children: "Jenis" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Select,
          {
            value: jenis,
            onValueChange: (value) => onJenisChange(value),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                SelectTrigger,
                {
                  id: "kas-filter-jenis",
                  "data-ocid": "kas.filter.jenis_select",
                  className: "w-full",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {})
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: jenisOptions.map((option) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: option.value, children: option.label }, option.value)) })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "kas-filter-dari", children: "Dari tanggal" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            id: "kas-filter-dari",
            "data-ocid": "kas.filter.dari_input",
            type: "date",
            value: from,
            onChange: (event) => onFromChange(event.target.value)
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "kas-filter-sampai", children: "Sampai tanggal" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            id: "kas-filter-sampai",
            "data-ocid": "kas.filter.sampai_input",
            type: "date",
            value: to,
            onChange: (event) => onToChange(event.target.value)
          }
        )
      ] })
    ] }),
    isFiltered ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Button,
      {
        type: "button",
        variant: "ghost",
        size: "sm",
        "data-ocid": "kas.filter.reset_button",
        onClick: onReset,
        className: "text-muted-foreground",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "size-4", "aria-hidden": "true" }),
          "Reset filter"
        ]
      }
    ) }) : null
  ] });
}
function TableSkeleton() {
  const ids = Array.from({ length: 6 }, (_, i) => `kas-skeleton-${i}`);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { "data-ocid": "kas.table.loading_state", className: "space-y-3 p-4", children: ids.map((id) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-10 w-full" }, id)) });
}
function EmptyState({ isFiltered }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      "data-ocid": "kas.table.empty_state",
      className: "flex flex-col items-center gap-3 px-6 py-14 text-center",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            "aria-hidden": "true",
            className: "grid size-12 place-items-center rounded-full bg-muted text-muted-foreground",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Wallet, { className: "size-6" })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-base font-semibold text-foreground", children: isFiltered ? "Tidak ada entri yang cocok" : "Belum ada entri kas" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "max-w-sm text-sm text-muted-foreground", children: isFiltered ? "Coba ubah jenis atau rentang tanggal untuk melihat entri lainnya." : "Catat kas manual di atas, atau entri akan muncul otomatis dari transaksi dan restock." })
        ] })
      ]
    }
  );
}
function CashflowTable({
  rows,
  isLoading,
  isFiltered
}) {
  if (isLoading) return /* @__PURE__ */ jsxRuntimeExports.jsx(TableSkeleton, {});
  if (rows.length === 0) return /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyState, { isFiltered });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "ul",
      {
        "data-ocid": "kas.table.list",
        className: "divide-y divide-border md:hidden",
        children: rows.map((row, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "li",
          {
            "data-ocid": `kas.table.item.${index + 1}`,
            className: "space-y-2 px-4 py-3",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "truncate text-sm font-medium text-foreground", children: row.note.trim() || entryTypeLabel(row.entryType) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-0.5 text-xs text-muted-foreground", children: formatDate(row.date) })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  AmountText,
                  {
                    amount: row.amount,
                    entryType: row.entryType,
                    className: "shrink-0 text-sm"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SourceBadge, { source: row.source }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "num text-xs text-muted-foreground tabular-nums", children: [
                  "Saldo ",
                  formatRupiah(row.balance)
                ] })
              ] })
            ]
          },
          String(row.id)
        ))
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hidden md:block", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { "data-ocid": "kas.table", className: "w-full border-collapse text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "sticky top-0 z-10 bg-muted/80 backdrop-blur", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-border text-left", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 font-medium text-muted-foreground", children: "Tanggal" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 font-medium text-muted-foreground", children: "Keterangan" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 font-medium text-muted-foreground", children: "Sumber" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 font-medium text-muted-foreground", children: "Jenis" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-right font-medium text-muted-foreground", children: "Jumlah" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-right font-medium text-muted-foreground", children: "Saldo" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: rows.map((row, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "tr",
        {
          "data-ocid": `kas.table.row.${index + 1}`,
          className: "border-b border-border/70 transition-fast last:border-0 hover:bg-muted/40",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "whitespace-nowrap px-4 py-3 text-muted-foreground", children: formatDate(row.date) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "max-w-[16rem] px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "block truncate text-foreground", children: row.note.trim() || "—" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SourceBadge, { source: row.source }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "span",
              {
                className: cn(
                  "inline-flex items-center gap-1 text-xs font-medium",
                  isMasuk(row.entryType) ? "text-success" : "text-destructive"
                ),
                children: [
                  isMasuk(row.entryType) ? /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowDownLeft, { className: "size-3.5", "aria-hidden": "true" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUpRight, { className: "size-3.5", "aria-hidden": "true" }),
                  entryTypeLabel(row.entryType)
                ]
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "whitespace-nowrap px-4 py-3 text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AmountText, { amount: row.amount, entryType: row.entryType }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "num whitespace-nowrap px-4 py-3 text-right font-medium tabular-nums text-foreground", children: formatRupiah(row.balance) })
          ]
        },
        String(row.id)
      )) })
    ] }) })
  ] });
}
function Kas() {
  const cashflow = useCashflow();
  const balance = useCashBalance();
  const [jenis, setJenis] = reactExports.useState("semua");
  const [from, setFrom] = reactExports.useState("");
  const [to, setTo] = reactExports.useState("");
  const rows = cashflow.data ?? [];
  const filtered = reactExports.useMemo(() => {
    const fromTime = from ? (/* @__PURE__ */ new Date(`${from}T00:00:00`)).getTime() : null;
    const toTime = to ? (/* @__PURE__ */ new Date(`${to}T23:59:59`)).getTime() : null;
    return rows.filter((row) => {
      if (jenis !== "semua" && row.entryType !== jenis) return false;
      const time = Number(row.date / 1000000n);
      if (fromTime !== null && time < fromTime) return false;
      if (toTime !== null && time > toTime) return false;
      return true;
    });
  }, [rows, jenis, from, to]);
  const isFiltered = jenis !== "semua" || from !== "" || to !== "";
  function resetFilters() {
    setJenis("semua");
    setFrom("");
    setTo("");
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-ocid": "kas.page", className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "space-y-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl font-bold tracking-tight", children: "Kas" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Buku kas usaha — catat pemasukan dan pengeluaran di luar transaksi." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(BalanceCard, { balance: balance.data, isLoading: balance.isLoading }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(ManualEntryForm, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      FilterBar,
      {
        jenis,
        onJenisChange: setJenis,
        from,
        to,
        onFromChange: setFrom,
        onToChange: setTo,
        onReset: resetFilters,
        isFiltered
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "overflow-hidden border-border shadow-subtle", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "flex flex-row items-center justify-between gap-3 border-b border-border pb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "font-display text-base font-semibold", children: "Riwayat Kas" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "num text-xs text-muted-foreground tabular-nums", children: [
          filtered.length,
          " entri"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-0", children: cashflow.isError ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          "data-ocid": "kas.table.error_state",
          className: "flex flex-col items-center gap-3 px-6 py-14 text-center",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-base font-semibold text-foreground", children: "Gagal memuat data kas" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "max-w-sm text-sm text-muted-foreground", children: "Periksa koneksi lalu coba lagi." }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                type: "button",
                variant: "outline",
                "data-ocid": "kas.table.retry_button",
                onClick: () => void cashflow.refetch(),
                children: "Coba lagi"
              }
            )
          ]
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
        CashflowTable,
        {
          rows: filtered,
          isLoading: cashflow.isLoading,
          isFiltered
        }
      ) })
    ] })
  ] });
}
export {
  Kas as default
};
