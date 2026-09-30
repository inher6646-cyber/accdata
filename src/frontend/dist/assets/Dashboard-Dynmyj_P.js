import { c as createLucideIcon, W as Wallet, j as jsxRuntimeExports, L as Link, R as Receipt } from "./index-5E34msdd.js";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell, B as Badge } from "./table-B4febazW.js";
import { u as useDashboard, f as formatRupiah, a as formatNumber, B as Button, b as formatDateShort, s as statusLabel } from "./format-CSXUHyIt.js";
import { C as Card, a as CardContent } from "./card-De3wFAH4.js";
import { S as Skeleton } from "./skeleton-D6apxnL6.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$3 = [
  ["path", { d: "M5 12h14", key: "1ays0h" }],
  ["path", { d: "m12 5 7 7-7 7", key: "xquz4c" }]
];
const ArrowRight = createLucideIcon("arrow-right", __iconNode$3);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  [
    "path",
    {
      d: "M21 10V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l2-1.14",
      key: "e7tb2h"
    }
  ],
  ["path", { d: "m7.5 4.27 9 5.15", key: "1c824w" }],
  ["polyline", { points: "3.29 7 12 12 20.71 7", key: "ousv84" }],
  ["line", { x1: "12", x2: "12", y1: "22", y2: "12", key: "a4e8g8" }],
  ["path", { d: "m17 13 5 5m-5 0 5-5", key: "im3w4b" }]
];
const PackageX = createLucideIcon("package-x", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "M16 7h6v6", key: "box55l" }],
  ["path", { d: "m22 7-8.5 8.5-5-5L2 17", key: "1t1m79" }]
];
const TrendingUp = createLucideIcon("trending-up", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  [
    "path",
    {
      d: "m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3",
      key: "wmoenq"
    }
  ],
  ["path", { d: "M12 9v4", key: "juzpu7" }],
  ["path", { d: "M12 17h.01", key: "p32p05" }]
];
const TriangleAlert = createLucideIcon("triangle-alert", __iconNode);
const LOW_STOCK_THRESHOLD = 5;
const STATUS_BADGE = {
  baru: "border-transparent bg-secondary text-secondary-foreground",
  proses: "border-transparent bg-warning-soft text-warning",
  kirim: "border-transparent bg-primary/10 text-primary",
  selesai: "border-transparent bg-success-soft text-success"
};
function SummaryCardView({ card }) {
  const Icon = card.icon;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Link,
    {
      to: card.to,
      "data-ocid": `dashboard.summary_card.${card.key}`,
      className: "group block rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "relative h-full gap-0 overflow-hidden rounded-lg border-border py-0 shadow-subtle transition-smooth group-hover:-translate-y-0.5 group-hover:shadow-elevated", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            "aria-hidden": "true",
            className: `absolute inset-y-0 left-0 w-1 ${card.accent}`
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "flex flex-col gap-3 px-5 py-4 pl-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground", children: card.label }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: `grid size-8 shrink-0 place-items-center rounded-md ${card.iconClass}`,
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "size-4", "aria-hidden": "true" })
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "num font-display text-2xl font-bold leading-none tracking-tight text-foreground", children: card.value }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: card.hint })
        ] })
      ] })
    }
  );
}
function SummarySkeleton() {
  const ids = Array.from({ length: 4 }, (_, i) => `summary-skeleton-${i}`);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4", children: ids.map((id) => /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "gap-0 rounded-lg py-0 shadow-subtle", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "flex flex-col gap-3 px-5 py-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-20" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-7 w-28" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-24" })
  ] }) }, id)) });
}
function SectionHeading({
  title,
  description,
  to,
  linkLabel
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-end justify-between gap-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-base font-bold tracking-tight text-foreground", children: title }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-0.5 text-xs text-muted-foreground", children: description })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Link,
      {
        to,
        "data-ocid": `dashboard.${to === "/transaksi" ? "transaksi" : "produk"}_link`,
        className: "inline-flex shrink-0 items-center gap-1 rounded-md text-xs font-semibold text-primary outline-none transition-fast hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        children: [
          linkLabel,
          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "size-3.5", "aria-hidden": "true" })
        ]
      }
    )
  ] });
}
function RecentTransactions({ rows }) {
  if (rows.length === 0) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        "data-ocid": "dashboard.transaksi.empty_state",
        className: "flex flex-col items-center gap-3 px-6 py-10 text-center",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "grid size-11 place-items-center rounded-full bg-muted text-muted-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Receipt, { className: "size-5", "aria-hidden": "true" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground", children: "Belum ada transaksi" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-xs text-muted-foreground", children: "Catat pesanan pertama untuk melihat ringkasannya di sini." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, size: "sm", className: "rounded-lg", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/transaksi", "data-ocid": "dashboard.transaksi.primary_button", children: "Catat transaksi" }) })
        ]
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { "data-ocid": "dashboard.transaksi.table", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { className: "sticky top-0 z-10 bg-card", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { className: "hover:bg-transparent", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "pl-4 text-xs uppercase tracking-wider text-muted-foreground", children: "Tanggal" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-xs uppercase tracking-wider text-muted-foreground", children: "No. Pesanan" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-xs uppercase tracking-wider text-muted-foreground", children: "Produk" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-right text-xs uppercase tracking-wider text-muted-foreground", children: "Qty" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-right text-xs uppercase tracking-wider text-muted-foreground", children: "Total" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "pr-4 text-right text-xs uppercase tracking-wider text-muted-foreground", children: "Status" })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { children: rows.map((tx, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      TableRow,
      {
        "data-ocid": `dashboard.transaksi.row.${index + 1}`,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "pl-4 text-xs text-muted-foreground", children: formatDateShort(tx.date) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "font-mono text-xs text-foreground", children: tx.orderNo }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "max-w-[10rem] truncate text-sm font-medium text-foreground", children: tx.productName }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "num text-right text-sm text-muted-foreground", children: formatNumber(tx.qty) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "num text-right text-sm font-semibold text-foreground", children: formatRupiah(tx.total) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "pr-4 text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            Badge,
            {
              variant: "outline",
              className: STATUS_BADGE[tx.status] ?? "",
              children: statusLabel(tx.status)
            }
          ) })
        ]
      },
      tx.id
    )) })
  ] });
}
function LowStockList({ products }) {
  if (products.length === 0) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        "data-ocid": "dashboard.produk.empty_state",
        className: "flex flex-col items-center gap-3 px-6 py-10 text-center",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "grid size-11 place-items-center rounded-full bg-success-soft text-success", children: /* @__PURE__ */ jsxRuntimeExports.jsx(PackageX, { className: "size-5", "aria-hidden": "true" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground", children: "Semua stok aman" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-1 text-xs text-muted-foreground", children: [
              "Tidak ada produk dengan stok ",
              LOW_STOCK_THRESHOLD,
              " atau kurang."
            ] })
          ] })
        ]
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { "data-ocid": "dashboard.produk.list", className: "divide-y divide-border", children: products.map((product, index) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Link,
    {
      to: "/produk",
      "data-ocid": `dashboard.produk.item.${index + 1}`,
      className: "flex items-center gap-3 px-4 py-3 outline-none transition-fast hover:bg-muted/60 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "grid size-9 shrink-0 place-items-center rounded-md bg-warning-soft text-warning", children: /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "size-4", "aria-hidden": "true" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex min-w-0 flex-1 flex-col", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate text-sm font-medium text-foreground", children: product.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "num text-xs text-muted-foreground", children: [
            formatRupiah(product.price),
            " · terjual",
            " ",
            formatNumber(product.sold)
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex shrink-0 flex-col items-end", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "num font-display text-base font-bold leading-none text-warning", children: formatNumber(product.stock) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] text-muted-foreground", children: "sisa" })
        ] })
      ]
    }
  ) }, product.id)) });
}
function Dashboard() {
  const { data, isLoading, isError, refetch } = useDashboard();
  const summary = data == null ? void 0 : data.summary;
  const recent = (data == null ? void 0 : data.recentTransactions) ?? [];
  const lowStock = (data == null ? void 0 : data.lowStockProducts) ?? [];
  const cards = [
    {
      key: "omzet",
      label: "Omzet",
      value: formatRupiah(summary == null ? void 0 : summary.omzet),
      hint: "Total nilai semua transaksi",
      icon: TrendingUp,
      to: "/transaksi",
      accent: "bg-primary",
      iconClass: "bg-primary/10 text-primary"
    },
    {
      key: "laba",
      label: "Laba Kotor",
      value: formatRupiah(summary == null ? void 0 : summary.labaKotor),
      hint: "Omzet dikurangi harga modal",
      icon: Wallet,
      to: "/kas",
      accent: "bg-success",
      iconClass: "bg-success-soft text-success"
    },
    {
      key: "saldo",
      label: "Saldo Kas",
      value: formatRupiah(summary == null ? void 0 : summary.saldoKas),
      hint: "Uang masuk dikurangi keluar",
      icon: Wallet,
      to: "/kas",
      accent: "bg-accent",
      iconClass: "bg-warning-soft text-warning"
    },
    {
      key: "stok",
      label: "Produk Stok Menipis",
      value: formatNumber(summary == null ? void 0 : summary.produkStokMenipis),
      hint: `Produk dengan stok ≤ ${LOW_STOCK_THRESHOLD}`,
      icon: TriangleAlert,
      to: "/produk",
      accent: "bg-destructive",
      iconClass: "bg-destructive-soft text-destructive"
    }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-ocid": "dashboard.page", className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "flex flex-col gap-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl font-bold tracking-tight text-foreground", children: "Dashboard" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Ringkasan penjualan, kas, dan stok usaha Anda hari ini." })
    ] }),
    isError ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      Card,
      {
        "data-ocid": "dashboard.error_state",
        className: "rounded-lg border-destructive/30 bg-destructive-soft shadow-none",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "flex flex-col items-start gap-3 px-6 py-5 sm:flex-row sm:items-center sm:justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "grid size-9 shrink-0 place-items-center rounded-md bg-destructive/10 text-destructive", children: /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "size-4", "aria-hidden": "true" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground", children: "Gagal memuat ringkasan" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-0.5 text-xs text-muted-foreground", children: "Periksa koneksi lalu coba lagi." })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "button",
              variant: "outline",
              size: "sm",
              className: "rounded-lg",
              "data-ocid": "dashboard.retry_button",
              onClick: () => void refetch(),
              children: "Coba lagi"
            }
          )
        ] })
      }
    ) : null,
    isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-ocid": "dashboard.loading_state", className: "space-y-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(SummarySkeleton, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 lg:grid-cols-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "gap-0 rounded-lg py-0 shadow-subtle lg:col-span-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-3 px-6 py-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-32" }),
          Array.from({ length: 5 }, (_, i) => `row-skeleton-${i}`).map(
            (id) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-9 w-full" }, id)
          )
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "gap-0 rounded-lg py-0 shadow-subtle lg:col-span-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-3 px-6 py-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-36" }),
          Array.from({ length: 4 }, (_, i) => `item-skeleton-${i}`).map(
            (id) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-12 w-full" }, id)
          )
        ] }) })
      ] })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("section", { "aria-label": "Ringkasan bisnis", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4", children: cards.map((card) => /* @__PURE__ */ jsxRuntimeExports.jsx(SummaryCardView, { card }, card.key)) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 lg:grid-cols-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "gap-0 overflow-hidden rounded-lg py-0 shadow-subtle lg:col-span-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-b border-border px-4 py-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            SectionHeading,
            {
              title: "Transaksi Terbaru",
              description: "5 pesanan terakhir yang tercatat",
              to: "/transaksi",
              linkLabel: "Lihat semua"
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(RecentTransactions, { rows: recent })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "gap-0 overflow-hidden rounded-lg py-0 shadow-subtle lg:col-span-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-b border-border px-4 py-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            SectionHeading,
            {
              title: "Produk Stok Menipis",
              description: `Stok ≤ ${LOW_STOCK_THRESHOLD} perlu segera ditambah`,
              to: "/produk",
              linkLabel: "Kelola produk"
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(LowStockList, { products: lowStock })
        ] })
      ] })
    ] })
  ] });
}
export {
  Dashboard as default
};
