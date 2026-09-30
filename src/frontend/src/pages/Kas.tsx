import { EntryType as EntryTypeEnum } from "@/backend";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useCashBalance,
  useCashflow,
  useCreateCashflowEntry,
} from "@/hooks/use-backend";
import {
  entrySourceLabel,
  entryTypeLabel,
  formatDate,
  formatRupiah,
  parseRupiah,
} from "@/lib/format";
import { cn } from "@/lib/utils";
import type { CashflowRow, EntryType } from "@/types";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Filter,
  Plus,
  Wallet,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";

type JenisFilter = "semua" | "masuk" | "keluar";

const SOURCE_STYLES: Record<string, string> = {
  manual: "bg-secondary text-secondary-foreground",
  transaksi: "bg-primary/10 text-primary",
  restock: "bg-warning-soft text-warning",
};

function isMasuk(entryType: string): boolean {
  return entryType === EntryTypeEnum.masuk;
}

function AmountText({
  amount,
  entryType,
  className,
}: {
  amount: bigint;
  entryType: string;
  className?: string;
}) {
  const masuk = isMasuk(entryType);
  return (
    <span
      className={cn(
        "num font-semibold tabular-nums",
        masuk ? "text-success" : "text-destructive",
        className,
      )}
    >
      {masuk ? "+" : "−"}
      {formatRupiah(amount)}
    </span>
  );
}

function SourceBadge({ source }: { source: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium",
        SOURCE_STYLES[source] ?? "bg-muted text-muted-foreground",
      )}
    >
      {entrySourceLabel(source)}
    </span>
  );
}

function BalanceCard({
  balance,
  isLoading,
}: {
  balance: bigint | undefined;
  isLoading: boolean;
}) {
  return (
    <Card className="overflow-hidden border-border shadow-subtle">
      <div className="gradient-primary px-5 py-5 text-primary-foreground sm:px-6 sm:py-6">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-primary-foreground/80">
              <Wallet className="size-4" aria-hidden="true" />
              Saldo Kas Total
            </p>
            {isLoading ? (
              <Skeleton
                data-ocid="kas.balance.loading_state"
                className="mt-3 h-9 w-48 bg-primary-foreground/20"
              />
            ) : (
              <p
                data-ocid="kas.balance.text"
                className="num mt-2 font-display text-3xl font-bold tracking-tight tabular-nums sm:text-4xl"
              >
                {formatRupiah(balance)}
              </p>
            )}
            <p className="mt-2 text-xs text-primary-foreground/75">
              Gabungan entri manual, transaksi, dan restock.
            </p>
          </div>
          <span
            aria-hidden="true"
            className="hidden size-12 shrink-0 place-items-center rounded-xl bg-primary-foreground/15 sm:grid"
          >
            <Wallet className="size-6" />
          </span>
        </div>
      </div>
    </Card>
  );
}

function ManualEntryForm() {
  const createEntry = useCreateCashflowEntry();
  const [entryType, setEntryType] = useState<EntryType>(EntryTypeEnum.masuk);
  const [jumlah, setJumlah] = useState("");
  const [catatan, setCatatan] = useState("");
  const [error, setError] = useState<string | null>(null);

  const amount = parseRupiah(jumlah);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (amount <= 0) {
      setError("Jumlah harus lebih dari 0.");
      return;
    }
    setError(null);
    const payload = {
      entryType,
      amount: BigInt(amount),
      note: catatan.trim(),
    };
    setJumlah("");
    setCatatan("");
    createEntry.mutate(payload, {
      onError: () => {
        setError("Gagal menyimpan entri kas. Coba lagi.");
      },
    });
  }

  return (
    <Card className="border-border shadow-subtle">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 font-display text-base font-semibold">
          <Plus className="size-4 text-primary" aria-hidden="true" />
          Catat Kas Manual
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Untuk biaya atau pemasukan di luar transaksi dan restock.
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="kas-jenis">Jenis</Label>
              <Select
                value={entryType}
                onValueChange={(value) => setEntryType(value as EntryType)}
              >
                <SelectTrigger
                  id="kas-jenis"
                  data-ocid="kas.form.jenis_select"
                  className="w-full"
                >
                  <SelectValue placeholder="Pilih jenis" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={EntryTypeEnum.masuk}>Masuk</SelectItem>
                  <SelectItem value={EntryTypeEnum.keluar}>Keluar</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="kas-jumlah">Jumlah (Rp)</Label>
              <Input
                id="kas-jumlah"
                data-ocid="kas.form.jumlah_input"
                inputMode="numeric"
                autoComplete="off"
                placeholder="0"
                value={jumlah}
                aria-invalid={error ? true : undefined}
                aria-describedby={error ? "kas-jumlah-error" : undefined}
                onChange={(event) => {
                  setJumlah(event.target.value);
                  if (error) setError(null);
                }}
                className="num tabular-nums"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="kas-catatan">Catatan</Label>
            <Input
              id="kas-catatan"
              data-ocid="kas.form.catatan_input"
              autoComplete="off"
              placeholder="Contoh: bayar listrik toko"
              value={catatan}
              onChange={(event) => setCatatan(event.target.value)}
            />
          </div>

          {error ? (
            <p
              id="kas-jumlah-error"
              data-ocid="kas.form.error_state"
              role="alert"
              className="rounded-md bg-destructive-soft px-3 py-2 text-sm font-medium text-destructive"
            >
              {error}
            </p>
          ) : null}

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="num text-sm text-muted-foreground tabular-nums">
              {amount > 0 ? formatRupiah(amount) : "Masukkan jumlah"}
            </p>
            <Button
              type="submit"
              data-ocid="kas.form.submit_button"
              disabled={createEntry.isPending}
              className="w-full sm:w-auto"
            >
              {createEntry.isPending ? "Menyimpan…" : "Simpan Entri"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

function FilterBar({
  jenis,
  onJenisChange,
  from,
  to,
  onFromChange,
  onToChange,
  onReset,
  isFiltered,
}: {
  jenis: JenisFilter;
  onJenisChange: (value: JenisFilter) => void;
  from: string;
  to: string;
  onFromChange: (value: string) => void;
  onToChange: (value: string) => void;
  onReset: () => void;
  isFiltered: boolean;
}) {
  const jenisOptions: { value: JenisFilter; label: string }[] = [
    { value: "semua", label: "Semua" },
    { value: "masuk", label: "Masuk" },
    { value: "keluar", label: "Keluar" },
  ];

  return (
    <div className="flex flex-col gap-4 rounded-lg border border-border bg-card p-4 shadow-subtle">
      <div className="flex items-center gap-2 text-sm font-medium text-foreground">
        <Filter className="size-4 text-muted-foreground" aria-hidden="true" />
        Filter
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="kas-filter-jenis">Jenis</Label>
          <Select
            value={jenis}
            onValueChange={(value) => onJenisChange(value as JenisFilter)}
          >
            <SelectTrigger
              id="kas-filter-jenis"
              data-ocid="kas.filter.jenis_select"
              className="w-full"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {jenisOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="kas-filter-dari">Dari tanggal</Label>
          <Input
            id="kas-filter-dari"
            data-ocid="kas.filter.dari_input"
            type="date"
            value={from}
            onChange={(event) => onFromChange(event.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="kas-filter-sampai">Sampai tanggal</Label>
          <Input
            id="kas-filter-sampai"
            data-ocid="kas.filter.sampai_input"
            type="date"
            value={to}
            onChange={(event) => onToChange(event.target.value)}
          />
        </div>
      </div>

      {isFiltered ? (
        <div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            data-ocid="kas.filter.reset_button"
            onClick={onReset}
            className="text-muted-foreground"
          >
            <X className="size-4" aria-hidden="true" />
            Reset filter
          </Button>
        </div>
      ) : null}
    </div>
  );
}

function TableSkeleton() {
  const ids = Array.from({ length: 6 }, (_, i) => `kas-skeleton-${i}`);
  return (
    <div data-ocid="kas.table.loading_state" className="space-y-3 p-4">
      {ids.map((id) => (
        <Skeleton key={id} className="h-10 w-full" />
      ))}
    </div>
  );
}

function EmptyState({ isFiltered }: { isFiltered: boolean }) {
  return (
    <div
      data-ocid="kas.table.empty_state"
      className="flex flex-col items-center gap-3 px-6 py-14 text-center"
    >
      <span
        aria-hidden="true"
        className="grid size-12 place-items-center rounded-full bg-muted text-muted-foreground"
      >
        <Wallet className="size-6" />
      </span>
      <div className="space-y-1">
        <p className="font-display text-base font-semibold text-foreground">
          {isFiltered ? "Tidak ada entri yang cocok" : "Belum ada entri kas"}
        </p>
        <p className="max-w-sm text-sm text-muted-foreground">
          {isFiltered
            ? "Coba ubah jenis atau rentang tanggal untuk melihat entri lainnya."
            : "Catat kas manual di atas, atau entri akan muncul otomatis dari transaksi dan restock."}
        </p>
      </div>
    </div>
  );
}

function CashflowTable({
  rows,
  isLoading,
  isFiltered,
}: {
  rows: CashflowRow[];
  isLoading: boolean;
  isFiltered: boolean;
}) {
  if (isLoading) return <TableSkeleton />;
  if (rows.length === 0) return <EmptyState isFiltered={isFiltered} />;

  return (
    <>
      {/* Mobile cards */}
      <ul
        data-ocid="kas.table.list"
        className="divide-y divide-border md:hidden"
      >
        {rows.map((row, index) => (
          <li
            key={String(row.id)}
            data-ocid={`kas.table.item.${index + 1}`}
            className="space-y-2 px-4 py-3"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-foreground">
                  {row.note.trim() || entryTypeLabel(row.entryType)}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {formatDate(row.date)}
                </p>
              </div>
              <AmountText
                amount={row.amount}
                entryType={row.entryType}
                className="shrink-0 text-sm"
              />
            </div>
            <div className="flex items-center justify-between gap-3">
              <SourceBadge source={row.source} />
              <span className="num text-xs text-muted-foreground tabular-nums">
                Saldo {formatRupiah(row.balance)}
              </span>
            </div>
          </li>
        ))}
      </ul>

      {/* Desktop table */}
      <div className="hidden md:block">
        <table data-ocid="kas.table" className="w-full border-collapse text-sm">
          <thead className="sticky top-0 z-10 bg-muted/80 backdrop-blur">
            <tr className="border-b border-border text-left">
              <th className="px-4 py-3 font-medium text-muted-foreground">
                Tanggal
              </th>
              <th className="px-4 py-3 font-medium text-muted-foreground">
                Keterangan
              </th>
              <th className="px-4 py-3 font-medium text-muted-foreground">
                Sumber
              </th>
              <th className="px-4 py-3 font-medium text-muted-foreground">
                Jenis
              </th>
              <th className="px-4 py-3 text-right font-medium text-muted-foreground">
                Jumlah
              </th>
              <th className="px-4 py-3 text-right font-medium text-muted-foreground">
                Saldo
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr
                key={String(row.id)}
                data-ocid={`kas.table.row.${index + 1}`}
                className="border-b border-border/70 transition-fast last:border-0 hover:bg-muted/40"
              >
                <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">
                  {formatDate(row.date)}
                </td>
                <td className="max-w-[16rem] px-4 py-3">
                  <span className="block truncate text-foreground">
                    {row.note.trim() || "—"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <SourceBadge source={row.source} />
                </td>
                <td className="px-4 py-3">
                  <span
                    className={cn(
                      "inline-flex items-center gap-1 text-xs font-medium",
                      isMasuk(row.entryType)
                        ? "text-success"
                        : "text-destructive",
                    )}
                  >
                    {isMasuk(row.entryType) ? (
                      <ArrowDownLeft className="size-3.5" aria-hidden="true" />
                    ) : (
                      <ArrowUpRight className="size-3.5" aria-hidden="true" />
                    )}
                    {entryTypeLabel(row.entryType)}
                  </span>
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-right">
                  <AmountText amount={row.amount} entryType={row.entryType} />
                </td>
                <td className="num whitespace-nowrap px-4 py-3 text-right font-medium tabular-nums text-foreground">
                  {formatRupiah(row.balance)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default function Kas() {
  const cashflow = useCashflow();
  const balance = useCashBalance();

  const [jenis, setJenis] = useState<JenisFilter>("semua");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const rows = cashflow.data ?? [];

  const filtered = useMemo(() => {
    const fromTime = from ? new Date(`${from}T00:00:00`).getTime() : null;
    const toTime = to ? new Date(`${to}T23:59:59`).getTime() : null;
    return rows.filter((row) => {
      if (jenis !== "semua" && row.entryType !== jenis) return false;
      const time = Number(row.date / 1_000_000n);
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

  return (
    <div data-ocid="kas.page" className="space-y-6">
      <header className="space-y-1">
        <h1 className="font-display text-2xl font-bold tracking-tight">Kas</h1>
        <p className="text-sm text-muted-foreground">
          Buku kas usaha — catat pemasukan dan pengeluaran di luar transaksi.
        </p>
      </header>

      <BalanceCard balance={balance.data} isLoading={balance.isLoading} />

      <ManualEntryForm />

      <FilterBar
        jenis={jenis}
        onJenisChange={setJenis}
        from={from}
        to={to}
        onFromChange={setFrom}
        onToChange={setTo}
        onReset={resetFilters}
        isFiltered={isFiltered}
      />

      <Card className="overflow-hidden border-border shadow-subtle">
        <CardHeader className="flex flex-row items-center justify-between gap-3 border-b border-border pb-4">
          <CardTitle className="font-display text-base font-semibold">
            Riwayat Kas
          </CardTitle>
          <span className="num text-xs text-muted-foreground tabular-nums">
            {filtered.length} entri
          </span>
        </CardHeader>
        <CardContent className="p-0">
          {cashflow.isError ? (
            <div
              data-ocid="kas.table.error_state"
              className="flex flex-col items-center gap-3 px-6 py-14 text-center"
            >
              <p className="font-display text-base font-semibold text-foreground">
                Gagal memuat data kas
              </p>
              <p className="max-w-sm text-sm text-muted-foreground">
                Periksa koneksi lalu coba lagi.
              </p>
              <Button
                type="button"
                variant="outline"
                data-ocid="kas.table.retry_button"
                onClick={() => void cashflow.refetch()}
              >
                Coba lagi
              </Button>
            </div>
          ) : (
            <CashflowTable
              rows={filtered}
              isLoading={cashflow.isLoading}
              isFiltered={isFiltered}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
