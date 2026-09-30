import { c as createLucideIcon, j as jsxRuntimeExports, r as reactExports, A as ArrowDownUp } from "./index-5E34msdd.js";
import { e as useProducts, q as useCreateRestock, p as parseRupiah, f as formatRupiah, B as Button, r as useRestocks, l as formatDate, a as formatNumber } from "./format-CSXUHyIt.js";
import { C as Card, b as CardHeader, c as CardTitle, a as CardContent } from "./card-De3wFAH4.js";
import { L as Label, I as Input } from "./label-CMI0ejh3.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-CY_hz-oh.js";
import { S as Skeleton } from "./skeleton-D6apxnL6.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "M12 16v-4", key: "1dtifu" }],
  ["path", { d: "M12 8h.01", key: "e9boi3" }]
];
const Info = createLucideIcon("info", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M16 16h6", key: "100bgy" }],
  ["path", { d: "M19 13v6", key: "85cyf1" }],
  [
    "path",
    {
      d: "M21 10V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l2-1.14",
      key: "e7tb2h"
    }
  ],
  ["path", { d: "m7.5 4.27 9 5.15", key: "1c824w" }],
  ["polyline", { points: "3.29 7 12 12 20.71 7", key: "ousv84" }],
  ["line", { x1: "12", x2: "12", y1: "22", y2: "12", key: "a4e8g8" }]
];
const PackagePlus = createLucideIcon("package-plus", __iconNode);
const EMPTY_PRODUCT = "__none__";
function RestockForm() {
  const { data: products, isLoading } = useProducts();
  const createRestock = useCreateRestock();
  const [productId, setProductId] = reactExports.useState("");
  const [qty, setQty] = reactExports.useState("");
  const [cost, setCost] = reactExports.useState("");
  const [supplier, setSupplier] = reactExports.useState("");
  const [error, setError] = reactExports.useState(null);
  const qtyNumber = Number.parseInt(qty, 10);
  const costNumber = parseRupiah(cost);
  const total = Number.isFinite(qtyNumber) ? qtyNumber * costNumber : 0;
  const hasProducts = ((products == null ? void 0 : products.length) ?? 0) > 0;
  function handleSubmit(event) {
    event.preventDefault();
    if (!productId) {
      setError("Pilih produk terlebih dahulu.");
      return;
    }
    if (!Number.isFinite(qtyNumber) || qtyNumber <= 0) {
      setError("Jumlah masuk harus lebih dari 0.");
      return;
    }
    if (costNumber <= 0) {
      setError("Harga beli per unit harus lebih dari 0.");
      return;
    }
    setError(null);
    const input = {
      productId: BigInt(productId),
      qty: BigInt(qtyNumber),
      cost: BigInt(costNumber),
      supplier: supplier.trim()
    };
    const draft = { qty, cost, supplier };
    setQty("");
    setCost("");
    setSupplier("");
    createRestock.mutate(input, {
      onError: () => {
        setQty((current) => current === "" ? draft.qty : current);
        setCost((current) => current === "" ? draft.cost : current);
        setSupplier((current) => current === "" ? draft.supplier : current);
        setError("Gagal menyimpan restock. Coba lagi.");
      }
    });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { "data-ocid": "restock.form_card", className: "shadow-subtle", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "gap-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2 font-display text-base", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(PackagePlus, { className: "size-4 text-primary", "aria-hidden": "true" }),
        "Catat Restock"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Tambah stok barang yang baru dibeli dari supplier." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", noValidate: true, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "restock-product", children: "Produk" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Select,
          {
            value: productId || EMPTY_PRODUCT,
            onValueChange: (value) => setProductId(value === EMPTY_PRODUCT ? "" : value),
            disabled: isLoading || !hasProducts,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                SelectTrigger,
                {
                  id: "restock-product",
                  "data-ocid": "restock.product_select",
                  className: "w-full",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    SelectValue,
                    {
                      placeholder: isLoading ? "Memuat produk…" : hasProducts ? "Pilih produk" : "Belum ada produk"
                    }
                  )
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: (products ?? []).map((product) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: product.id.toString(), children: product.name }, product.id)) })
            ]
          }
        ),
        !isLoading && !hasProducts ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Tambahkan produk di halaman Produk sebelum mencatat restock." }) : null
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 sm:grid-cols-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "restock-qty", children: "Jumlah masuk" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "restock-qty",
              "data-ocid": "restock.qty_input",
              type: "number",
              inputMode: "numeric",
              min: 1,
              step: 1,
              placeholder: "0",
              value: qty,
              onChange: (event) => setQty(event.target.value)
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "restock-cost", children: "Harga beli per unit" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "restock-cost",
              "data-ocid": "restock.cost_input",
              type: "text",
              inputMode: "numeric",
              placeholder: "0",
              value: cost,
              onChange: (event) => setCost(event.target.value)
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "restock-supplier", children: [
          "Nama supplier",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-normal text-muted-foreground", children: "(opsional)" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            id: "restock-supplier",
            "data-ocid": "restock.supplier_input",
            type: "text",
            placeholder: "Contoh: Toko Grosir Sinar Jaya",
            value: supplier,
            onChange: (event) => setSupplier(event.target.value)
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-3 rounded-lg border border-border bg-muted/50 px-4 py-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium text-muted-foreground", children: "Total biaya" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            "data-ocid": "restock.total_cost",
            className: "num font-display text-lg font-bold text-foreground",
            children: formatRupiah(total)
          }
        )
      ] }),
      error ? /* @__PURE__ */ jsxRuntimeExports.jsx(
        "p",
        {
          "data-ocid": "restock.error_state",
          role: "alert",
          className: "rounded-md bg-destructive-soft px-3 py-2 text-sm font-medium text-destructive",
          children: error
        }
      ) : null,
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          type: "submit",
          "data-ocid": "restock.submit_button",
          disabled: createRestock.isPending,
          className: "w-full sm:w-auto",
          children: createRestock.isPending ? "Menyimpan…" : "Simpan Restock"
        }
      )
    ] }) })
  ] });
}
function HistoryTable() {
  const { data: restocks, isLoading } = useRestocks();
  const rows = restocks ?? [];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { "data-ocid": "restock.history_card", className: "shadow-subtle", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "gap-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2 font-display text-base", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowDownUp, { className: "size-4 text-primary", "aria-hidden": "true" }),
        "Riwayat Restock"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Semua pembelian stok yang pernah dicatat." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "px-0 sm:px-6", children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        "data-ocid": "restock.loading_state",
        className: "space-y-2 px-4 sm:px-0",
        children: Array.from({ length: 4 }, (_, i) => `restock-skeleton-${i}`).map(
          (id) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-12 w-full rounded-md" }, id)
        )
      }
    ) : rows.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        "data-ocid": "restock.empty_state",
        className: "flex flex-col items-center gap-2 px-4 py-10 text-center sm:px-0",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "grid size-11 place-items-center rounded-full bg-muted text-muted-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowDownUp, { className: "size-5", "aria-hidden": "true" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-sm font-semibold", children: "Belum ada riwayat restock" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "max-w-xs text-sm text-muted-foreground", children: "Catat restock pertama lewat formulir di atas." })
        ]
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "table",
      {
        "data-ocid": "restock.table",
        className: "w-full min-w-[640px] border-collapse text-sm",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-border text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { scope: "col", className: "px-4 py-3 sm:px-0", children: "Tanggal" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { scope: "col", className: "px-4 py-3", children: "Produk" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { scope: "col", className: "px-4 py-3 text-right", children: "Qty" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { scope: "col", className: "px-4 py-3 text-right", children: "Harga Beli" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { scope: "col", className: "px-4 py-3 sm:pr-0", children: "Supplier" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: rows.map((row, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "tr",
            {
              "data-ocid": `restock.row.${index + 1}`,
              className: "border-b border-border last:border-0 transition-fast hover:bg-muted/50",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "whitespace-nowrap px-4 py-3 text-muted-foreground sm:px-0", children: formatDate(row.date) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 font-medium", children: row.productName }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "num px-4 py-3 text-right", children: formatNumber(row.qty) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "num px-4 py-3 text-right", children: formatRupiah(row.cost) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-muted-foreground sm:pr-0", children: row.supplier.trim() === "" ? "—" : row.supplier })
              ]
            },
            row.id
          )) })
        ]
      }
    ) }) })
  ] });
}
function Restock() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-ocid": "restock.page", className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "space-y-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl font-bold tracking-tight", children: "Restock" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Catat pembelian stok dan pantau riwayatnya." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        "data-ocid": "restock.note",
        className: "flex items-start gap-3 rounded-lg border border-border bg-secondary px-4 py-3",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Info,
            {
              className: "mt-0.5 size-4 shrink-0 text-primary",
              "aria-hidden": "true"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm leading-relaxed text-secondary-foreground", children: "Menyimpan restock akan menambah stok produk, memperbarui harga modal produk ke harga beli terbaru, dan otomatis mencatat satu entri kas keluar sebesar jumlah × harga beli." })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-6 lg:grid-cols-[minmax(0,380px)_minmax(0,1fr)] lg:items-start", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(RestockForm, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx(HistoryTable, {})
    ] })
  ] });
}
export {
  Restock as default
};
