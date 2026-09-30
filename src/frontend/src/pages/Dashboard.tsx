import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useDashboard } from "@/hooks/use-backend";
import {
  formatDateShort,
  formatNumber,
  formatRupiah,
  statusLabel,
} from "@/lib/format";
import type { ProductView, Status, Transaction } from "@/types";
import { Link } from "@tanstack/react-router";
import {
  AlertTriangle,
  ArrowRight,
  PackageX,
  Receipt,
  TrendingUp,
  Wallet,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const LOW_STOCK_THRESHOLD = 5;

const STATUS_BADGE: Record<Status, string> = {
  baru: "border-transparent bg-secondary text-secondary-foreground",
  proses: "border-transparent bg-warning-soft text-warning",
  kirim: "border-transparent bg-primary/10 text-primary",
  selesai: "border-transparent bg-success-soft text-success",
};

interface SummaryCard {
  key: string;
  label: string;
  value: string;
  hint: string;
  icon: LucideIcon;
  to: string;
  accent: string;
  iconClass: string;
}

function SummaryCardView({ card }: { card: SummaryCard }) {
  const Icon = card.icon;
  return (
    <Link
      to={card.to}
      data-ocid={`dashboard.summary_card.${card.key}`}
      className="group block rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <Card className="relative h-full gap-0 overflow-hidden rounded-lg border-border py-0 shadow-subtle transition-smooth group-hover:-translate-y-0.5 group-hover:shadow-elevated">
        <span
          aria-hidden="true"
          className={`absolute inset-y-0 left-0 w-1 ${card.accent}`}
        />
        <CardContent className="flex flex-col gap-3 px-5 py-4 pl-6">
          <div className="flex items-start justify-between gap-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {card.label}
            </p>
            <span
              className={`grid size-8 shrink-0 place-items-center rounded-md ${card.iconClass}`}
            >
              <Icon className="size-4" aria-hidden="true" />
            </span>
          </div>
          <p className="num font-display text-2xl font-bold leading-none tracking-tight text-foreground">
            {card.value}
          </p>
          <p className="text-xs text-muted-foreground">{card.hint}</p>
        </CardContent>
      </Card>
    </Link>
  );
}

function SummarySkeleton() {
  const ids = Array.from({ length: 4 }, (_, i) => `summary-skeleton-${i}`);
  return (
    <div className="grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4">
      {ids.map((id) => (
        <Card key={id} className="gap-0 rounded-lg py-0 shadow-subtle">
          <CardContent className="flex flex-col gap-3 px-5 py-4">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-7 w-28" />
            <Skeleton className="h-3 w-24" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function SectionHeading({
  title,
  description,
  to,
  linkLabel,
}: {
  title: string;
  description: string;
  to: string;
  linkLabel: string;
}) {
  return (
    <div className="flex items-end justify-between gap-4">
      <div className="min-w-0">
        <h2 className="font-display text-base font-bold tracking-tight text-foreground">
          {title}
        </h2>
        <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
      </div>
      <Link
        to={to}
        data-ocid={`dashboard.${to === "/transaksi" ? "transaksi" : "produk"}_link`}
        className="inline-flex shrink-0 items-center gap-1 rounded-md text-xs font-semibold text-primary outline-none transition-fast hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        {linkLabel}
        <ArrowRight className="size-3.5" aria-hidden="true" />
      </Link>
    </div>
  );
}

function RecentTransactions({ rows }: { rows: Transaction[] }) {
  if (rows.length === 0) {
    return (
      <div
        data-ocid="dashboard.transaksi.empty_state"
        className="flex flex-col items-center gap-3 px-6 py-10 text-center"
      >
        <span className="grid size-11 place-items-center rounded-full bg-muted text-muted-foreground">
          <Receipt className="size-5" aria-hidden="true" />
        </span>
        <div>
          <p className="text-sm font-semibold text-foreground">
            Belum ada transaksi
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Catat pesanan pertama untuk melihat ringkasannya di sini.
          </p>
        </div>
        <Button asChild size="sm" className="rounded-lg">
          <Link to="/transaksi" data-ocid="dashboard.transaksi.primary_button">
            Catat transaksi
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <Table data-ocid="dashboard.transaksi.table">
      <TableHeader className="sticky top-0 z-10 bg-card">
        <TableRow className="hover:bg-transparent">
          <TableHead className="pl-4 text-xs uppercase tracking-wider text-muted-foreground">
            Tanggal
          </TableHead>
          <TableHead className="text-xs uppercase tracking-wider text-muted-foreground">
            No. Pesanan
          </TableHead>
          <TableHead className="text-xs uppercase tracking-wider text-muted-foreground">
            Produk
          </TableHead>
          <TableHead className="text-right text-xs uppercase tracking-wider text-muted-foreground">
            Qty
          </TableHead>
          <TableHead className="text-right text-xs uppercase tracking-wider text-muted-foreground">
            Total
          </TableHead>
          <TableHead className="pr-4 text-right text-xs uppercase tracking-wider text-muted-foreground">
            Status
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((tx, index) => (
          <TableRow
            key={tx.id}
            data-ocid={`dashboard.transaksi.row.${index + 1}`}
          >
            <TableCell className="pl-4 text-xs text-muted-foreground">
              {formatDateShort(tx.date)}
            </TableCell>
            <TableCell className="font-mono text-xs text-foreground">
              {tx.orderNo}
            </TableCell>
            <TableCell className="max-w-[10rem] truncate text-sm font-medium text-foreground">
              {tx.productName}
            </TableCell>
            <TableCell className="num text-right text-sm text-muted-foreground">
              {formatNumber(tx.qty)}
            </TableCell>
            <TableCell className="num text-right text-sm font-semibold text-foreground">
              {formatRupiah(tx.total)}
            </TableCell>
            <TableCell className="pr-4 text-right">
              <Badge
                variant="outline"
                className={STATUS_BADGE[tx.status] ?? ""}
              >
                {statusLabel(tx.status)}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function LowStockList({ products }: { products: ProductView[] }) {
  if (products.length === 0) {
    return (
      <div
        data-ocid="dashboard.produk.empty_state"
        className="flex flex-col items-center gap-3 px-6 py-10 text-center"
      >
        <span className="grid size-11 place-items-center rounded-full bg-success-soft text-success">
          <PackageX className="size-5" aria-hidden="true" />
        </span>
        <div>
          <p className="text-sm font-semibold text-foreground">
            Semua stok aman
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Tidak ada produk dengan stok {LOW_STOCK_THRESHOLD} atau kurang.
          </p>
        </div>
      </div>
    );
  }

  return (
    <ul data-ocid="dashboard.produk.list" className="divide-y divide-border">
      {products.map((product, index) => (
        <li key={product.id}>
          <Link
            to="/produk"
            data-ocid={`dashboard.produk.item.${index + 1}`}
            className="flex items-center gap-3 px-4 py-3 outline-none transition-fast hover:bg-muted/60 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
          >
            <span className="grid size-9 shrink-0 place-items-center rounded-md bg-warning-soft text-warning">
              <AlertTriangle className="size-4" aria-hidden="true" />
            </span>
            <span className="flex min-w-0 flex-1 flex-col">
              <span className="truncate text-sm font-medium text-foreground">
                {product.name}
              </span>
              <span className="num text-xs text-muted-foreground">
                {formatRupiah(product.price)} · terjual{" "}
                {formatNumber(product.sold)}
              </span>
            </span>
            <span className="flex shrink-0 flex-col items-end">
              <span className="num font-display text-base font-bold leading-none text-warning">
                {formatNumber(product.stock)}
              </span>
              <span className="text-[11px] text-muted-foreground">sisa</span>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default function Dashboard() {
  const { data, isLoading, isError, refetch } = useDashboard();

  const summary = data?.summary;
  const recent = data?.recentTransactions ?? [];
  const lowStock = data?.lowStockProducts ?? [];

  const cards: SummaryCard[] = [
    {
      key: "omzet",
      label: "Omzet",
      value: formatRupiah(summary?.omzet),
      hint: "Total nilai semua transaksi",
      icon: TrendingUp,
      to: "/transaksi",
      accent: "bg-primary",
      iconClass: "bg-primary/10 text-primary",
    },
    {
      key: "laba",
      label: "Laba Kotor",
      value: formatRupiah(summary?.labaKotor),
      hint: "Omzet dikurangi harga modal",
      icon: Wallet,
      to: "/kas",
      accent: "bg-success",
      iconClass: "bg-success-soft text-success",
    },
    {
      key: "saldo",
      label: "Saldo Kas",
      value: formatRupiah(summary?.saldoKas),
      hint: "Uang masuk dikurangi keluar",
      icon: Wallet,
      to: "/kas",
      accent: "bg-accent",
      iconClass: "bg-warning-soft text-warning",
    },
    {
      key: "stok",
      label: "Produk Stok Menipis",
      value: formatNumber(summary?.produkStokMenipis),
      hint: `Produk dengan stok ≤ ${LOW_STOCK_THRESHOLD}`,
      icon: AlertTriangle,
      to: "/produk",
      accent: "bg-destructive",
      iconClass: "bg-destructive-soft text-destructive",
    },
  ];

  return (
    <div data-ocid="dashboard.page" className="space-y-6">
      <header className="flex flex-col gap-1">
        <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">
          Dashboard
        </h1>
        <p className="text-sm text-muted-foreground">
          Ringkasan penjualan, kas, dan stok usaha Anda hari ini.
        </p>
      </header>

      {isError ? (
        <Card
          data-ocid="dashboard.error_state"
          className="rounded-lg border-destructive/30 bg-destructive-soft shadow-none"
        >
          <CardContent className="flex flex-col items-start gap-3 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <span className="grid size-9 shrink-0 place-items-center rounded-md bg-destructive/10 text-destructive">
                <AlertTriangle className="size-4" aria-hidden="true" />
              </span>
              <div>
                <p className="text-sm font-semibold text-foreground">
                  Gagal memuat ringkasan
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Periksa koneksi lalu coba lagi.
                </p>
              </div>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="rounded-lg"
              data-ocid="dashboard.retry_button"
              onClick={() => void refetch()}
            >
              Coba lagi
            </Button>
          </CardContent>
        </Card>
      ) : null}

      {isLoading ? (
        <div data-ocid="dashboard.loading_state" className="space-y-6">
          <SummarySkeleton />
          <div className="grid gap-4 lg:grid-cols-5">
            <Card className="gap-0 rounded-lg py-0 shadow-subtle lg:col-span-3">
              <CardContent className="space-y-3 px-6 py-5">
                <Skeleton className="h-4 w-32" />
                {Array.from({ length: 5 }, (_, i) => `row-skeleton-${i}`).map(
                  (id) => (
                    <Skeleton key={id} className="h-9 w-full" />
                  ),
                )}
              </CardContent>
            </Card>
            <Card className="gap-0 rounded-lg py-0 shadow-subtle lg:col-span-2">
              <CardContent className="space-y-3 px-6 py-5">
                <Skeleton className="h-4 w-36" />
                {Array.from({ length: 4 }, (_, i) => `item-skeleton-${i}`).map(
                  (id) => (
                    <Skeleton key={id} className="h-12 w-full" />
                  ),
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        <>
          <section aria-label="Ringkasan bisnis">
            <div className="grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4">
              {cards.map((card) => (
                <SummaryCardView key={card.key} card={card} />
              ))}
            </div>
          </section>

          <div className="grid gap-4 lg:grid-cols-5">
            <Card className="gap-0 overflow-hidden rounded-lg py-0 shadow-subtle lg:col-span-3">
              <div className="border-b border-border px-4 py-4">
                <SectionHeading
                  title="Transaksi Terbaru"
                  description="5 pesanan terakhir yang tercatat"
                  to="/transaksi"
                  linkLabel="Lihat semua"
                />
              </div>
              <RecentTransactions rows={recent} />
            </Card>

            <Card className="gap-0 overflow-hidden rounded-lg py-0 shadow-subtle lg:col-span-2">
              <div className="border-b border-border px-4 py-4">
                <SectionHeading
                  title="Produk Stok Menipis"
                  description={`Stok ≤ ${LOW_STOCK_THRESHOLD} perlu segera ditambah`}
                  to="/produk"
                  linkLabel="Kelola produk"
                />
              </div>
              <LowStockList products={lowStock} />
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
