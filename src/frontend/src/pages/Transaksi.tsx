import { Status as StatusEnum } from "@/backend";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import {
  useCreateTransaction,
  useImportTransactions,
  useProducts,
  useTransactions,
  useUpdateTransactionStatus,
} from "@/hooks/use-backend";
import {
  formatDate,
  formatNumber,
  formatRupiah,
  statusLabel,
} from "@/lib/format";
import type { ImportSummary, Status, Transaction } from "@/types";
import { AlertCircle, CheckCircle2, FileSpreadsheet, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const STATUS_OPTIONS: { value: Status; label: string }[] = [
  { value: StatusEnum.baru, label: "Baru" },
  { value: StatusEnum.proses, label: "Diproses" },
  { value: StatusEnum.kirim, label: "Dikirim" },
  { value: StatusEnum.selesai, label: "Selesai" },
];

const IMPORT_HELPER =
  "Tempel baris dari spreadsheet (kolom dipisah TAB) dengan urutan: Tanggal, No Pesanan, Nama Barang, QTY, Harga satuan. Contoh tanggal: 29-September-2026.";

function skipReasonLabel(
  reason: ImportSummary["details"][number]["reason"],
): string {
  switch (reason.__kind__) {
    case "emptyLine":
      return "baris kosong";
    case "invalidRow":
      return "jumlah kolom tidak sesuai";
    case "invalidNumber":
      return `angka tidak valid (${reason.invalidNumber})`;
    case "invalidDate":
      return `tanggal tidak valid (${reason.invalidDate})`;
    default:
      return "tidak diketahui";
  }
}

function ManualTransactionForm() {
  const { data: products = [], isLoading } = useProducts();
  const createTransaction = useCreateTransaction();

  const [orderNo, setOrderNo] = useState("");
  const [productId, setProductId] = useState("");
  const [qty, setQty] = useState("");
  const [status, setStatus] = useState<Status>(StatusEnum.baru);
  const [error, setError] = useState<string | null>(null);

  const selected = products.find((p) => p.id.toString() === productId);
  const qtyNumber = Number.parseInt(qty, 10);
  const qtyValid = Number.isFinite(qtyNumber) && qtyNumber > 0;
  const total = selected && qtyValid ? BigInt(qtyNumber) * selected.price : 0n;
  const exceedsStock =
    selected && qtyValid ? BigInt(qtyNumber) > selected.stock : false;

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!selected) {
      setError("Pilih produk terlebih dahulu.");
      return;
    }
    if (!qtyValid) {
      setError("Jumlah harus berupa angka lebih dari 0.");
      return;
    }
    if (BigInt(qtyNumber) > selected.stock) {
      setError(
        `Stok tidak cukup. Tersedia ${formatNumber(selected.stock)}, diminta ${formatNumber(qtyNumber)}.`,
      );
      return;
    }

    const payload = {
      orderNo: orderNo.trim(),
      productId: selected.id,
      qty: BigInt(qtyNumber),
      status,
    };

    setOrderNo("");
    setProductId("");
    setQty("");
    setStatus(StatusEnum.baru);

    createTransaction.mutate(payload, {
      onSuccess: (result) => {
        if (result.__kind__ === "ok") {
          toast.success("Transaksi tersimpan", {
            description: `${formatNumber(payload.qty)} × ${selected.name} · ${formatRupiah(total)}`,
          });
        } else {
          const err = result.err;
          if (err.__kind__ === "insufficientStock") {
            setError(
              `Stok tidak cukup. Tersedia ${formatNumber(err.insufficientStock.available)}, diminta ${formatNumber(err.insufficientStock.requested)}.`,
            );
          } else if (err.__kind__ === "productNotFound") {
            setError(
              "Produk tidak ditemukan. Muat ulang halaman lalu coba lagi.",
            );
          } else if (err.__kind__ === "invalidQty") {
            setError("Jumlah tidak valid.");
          } else {
            setError("Transaksi gagal disimpan.");
          }
        }
      },
      onError: () => {
        setError("Gagal menghubungi backend. Coba lagi.");
      },
    });
  }

  return (
    <Card data-ocid="transaksi.form_card" className="rounded-lg shadow-subtle">
      <CardHeader className="border-b">
        <CardTitle className="font-display text-base">
          Input Transaksi Manual
        </CardTitle>
        <CardDescription>
          Total dihitung otomatis dari jumlah × harga jual produk.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="order-no">No Pesanan (opsional)</Label>
              <Input
                id="order-no"
                data-ocid="transaksi.order_no_input"
                value={orderNo}
                onChange={(event) => setOrderNo(event.target.value)}
                placeholder="mis. INV-2026-001"
                autoComplete="off"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="product-select">Produk</Label>
              <Select value={productId} onValueChange={setProductId}>
                <SelectTrigger
                  id="product-select"
                  data-ocid="transaksi.product_select"
                  className="w-full"
                  disabled={isLoading || products.length === 0}
                >
                  <SelectValue
                    placeholder={
                      isLoading
                        ? "Memuat produk…"
                        : products.length === 0
                          ? "Belum ada produk"
                          : "Pilih produk"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {products.map((product) => (
                    <SelectItem
                      key={product.id.toString()}
                      value={product.id.toString()}
                    >
                      {product.name} · stok {formatNumber(product.stock)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="qty-input">Jumlah</Label>
              <Input
                id="qty-input"
                data-ocid="transaksi.qty_input"
                type="number"
                inputMode="numeric"
                min={1}
                step={1}
                value={qty}
                onChange={(event) => setQty(event.target.value)}
                placeholder="0"
                aria-invalid={exceedsStock || undefined}
              />
              {selected ? (
                <p className="text-xs text-muted-foreground">
                  Stok tersedia: {formatNumber(selected.stock)}
                </p>
              ) : null}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="status-select">Status</Label>
              <Select
                value={status}
                onValueChange={(value) => setStatus(value as Status)}
              >
                <SelectTrigger
                  id="status-select"
                  data-ocid="transaksi.status_select"
                  className="w-full"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-col gap-3 rounded-lg border border-border bg-muted/40 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Total
              </p>
              <p
                data-ocid="transaksi.total_preview"
                className="num font-display text-xl font-bold tracking-tight"
              >
                {formatRupiah(total)}
              </p>
            </div>
            <Button
              type="submit"
              data-ocid="transaksi.submit_button"
              disabled={createTransaction.isPending}
              className="w-full sm:w-auto"
            >
              <Plus className="size-4" aria-hidden="true" />
              {createTransaction.isPending ? "Menyimpan…" : "Simpan Transaksi"}
            </Button>
          </div>

          {error ? (
            <Alert
              variant="destructive"
              data-ocid="transaksi.form_error_state"
              className="bg-destructive-soft"
            >
              <AlertCircle aria-hidden="true" />
              <AlertTitle>Transaksi tidak dapat disimpan</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : null}
        </form>
      </CardContent>
    </Card>
  );
}

function StatusCell({ transaction }: { transaction: Transaction }) {
  const updateStatus = useUpdateTransactionStatus();

  return (
    <Select
      value={transaction.status}
      onValueChange={(value) =>
        updateStatus.mutate(
          { id: transaction.id, status: value as Status },
          {
            onSuccess: (result) => {
              if (result.__kind__ === "ok") {
                toast.success("Status diperbarui", {
                  description: `${transaction.productName} → ${statusLabel(value)}`,
                });
              } else {
                toast.error("Gagal memperbarui status");
              }
            },
            onError: () => toast.error("Gagal memperbarui status"),
          },
        )
      }
      disabled={updateStatus.isPending}
    >
      <SelectTrigger
        size="sm"
        data-ocid={`transaksi.status_select.${transaction.id}`}
        className="w-[130px]"
        aria-label={`Ubah status ${transaction.productName}`}
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {STATUS_OPTIONS.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function TransactionTable() {
  const { data: transactions = [], isLoading, isError } = useTransactions();

  return (
    <Card data-ocid="transaksi.table_card" className="rounded-lg shadow-subtle">
      <CardHeader className="border-b">
        <CardTitle className="font-display text-base">
          Daftar Transaksi
        </CardTitle>
        <CardDescription>
          Ubah status langsung dari tabel. Perubahan status tidak mengubah stok.
        </CardDescription>
      </CardHeader>
      <CardContent className="px-0">
        {isLoading ? (
          <div
            data-ocid="transaksi.table_loading_state"
            className="flex flex-col gap-2 px-6 py-4"
          >
            {Array.from({ length: 4 }, (_, i) => `row-${i}`).map((id) => (
              <div
                key={id}
                className="h-10 w-full animate-pulse rounded-md bg-muted"
              />
            ))}
          </div>
        ) : isError ? (
          <div className="px-6 py-8">
            <Alert
              variant="destructive"
              data-ocid="transaksi.table_error_state"
            >
              <AlertCircle aria-hidden="true" />
              <AlertTitle>Gagal memuat transaksi</AlertTitle>
              <AlertDescription>
                Periksa koneksi lalu muat ulang halaman.
              </AlertDescription>
            </Alert>
          </div>
        ) : transactions.length === 0 ? (
          <div
            data-ocid="transaksi.table_empty_state"
            className="flex flex-col items-center gap-2 px-6 py-12 text-center"
          >
            <span className="grid size-11 place-items-center rounded-full bg-muted text-muted-foreground">
              <FileSpreadsheet className="size-5" aria-hidden="true" />
            </span>
            <p className="font-display text-sm font-semibold">
              Belum ada transaksi
            </p>
            <p className="max-w-sm text-sm text-muted-foreground">
              Catat penjualan pertama lewat formulir di atas, atau impor data
              dari spreadsheet.
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader className="sticky top-0 z-10 bg-card">
              <TableRow className="hover:bg-transparent">
                <TableHead className="pl-6">Tanggal</TableHead>
                <TableHead>No Pesanan</TableHead>
                <TableHead>Produk</TableHead>
                <TableHead className="text-right">Qty</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead className="pr-6">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction, index) => (
                <TableRow
                  key={transaction.id.toString()}
                  data-ocid={`transaksi.row.${index + 1}`}
                >
                  <TableCell className="pl-6 text-muted-foreground">
                    {formatDate(transaction.date)}
                  </TableCell>
                  <TableCell className="font-mono text-xs">
                    {transaction.orderNo || "—"}
                  </TableCell>
                  <TableCell className="max-w-[180px] truncate font-medium">
                    {transaction.productName}
                  </TableCell>
                  <TableCell className="num text-right">
                    {formatNumber(transaction.qty)}
                  </TableCell>
                  <TableCell className="num text-right font-semibold">
                    {formatRupiah(transaction.total)}
                  </TableCell>
                  <TableCell className="pr-6">
                    <StatusCell transaction={transaction} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}

function ImportSection() {
  const importTransactions = useImportTransactions();
  const [raw, setRaw] = useState("");
  const [summary, setSummary] = useState<ImportSummary | null>(null);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSummary(null);

    if (raw.trim() === "") {
      setError("Tempel data terlebih dahulu sebelum mengimpor.");
      return;
    }

    const captured = raw;
    setRaw("");

    importTransactions.mutate(captured, {
      onSuccess: (result) => {
        setSummary(result);
        toast.success("Impor selesai", {
          description: `${formatNumber(result.succeeded)} baris berhasil, ${formatNumber(result.skipped)} dilewati.`,
        });
      },
      onError: () => {
        setError("Gagal mengimpor data. Coba lagi.");
        setRaw((current) => (current === "" ? captured : current));
      },
    });
  }

  return (
    <Card
      data-ocid="transaksi.import_card"
      className="rounded-lg shadow-subtle"
    >
      <CardHeader className="border-b">
        <CardTitle className="font-display text-base">
          Impor Massal dari Spreadsheet
        </CardTitle>
        <CardDescription>{IMPORT_HELPER}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="import-textarea">Data tempelan</Label>
            <Textarea
              id="import-textarea"
              data-ocid="transaksi.import_textarea"
              value={raw}
              onChange={(event) => setRaw(event.target.value)}
              rows={6}
              spellCheck={false}
              placeholder={
                "29-September-2026\tINV-001\tKaos Polos\t3\t75000\n30-September-2026\tINV-002\tTopi Bordir\t2\t45000"
              }
              className="min-h-32 font-mono text-xs"
            />
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-muted-foreground">
              Transaksi hasil impor berstatus <strong>Selesai</strong>, tidak
              mengubah stok, dan tetap menambah kas masuk.
            </p>
            <Button
              type="submit"
              data-ocid="transaksi.import_submit_button"
              disabled={importTransactions.isPending}
              className="w-full sm:w-auto"
            >
              <FileSpreadsheet className="size-4" aria-hidden="true" />
              {importTransactions.isPending ? "Mengimpor…" : "Impor Data"}
            </Button>
          </div>

          {error ? (
            <Alert
              variant="destructive"
              data-ocid="transaksi.import_error_state"
              className="bg-destructive-soft"
            >
              <AlertCircle aria-hidden="true" />
              <AlertTitle>Impor gagal</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : null}

          {summary ? (
            <div
              data-ocid="transaksi.import_summary_state"
              className="grid gap-3 rounded-lg border border-border bg-muted/40 p-4"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2
                  className="size-4 text-success"
                  aria-hidden="true"
                />
                <p className="font-display text-sm font-semibold">
                  Ringkasan Impor
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge className="border-transparent bg-success-soft text-success">
                  {formatNumber(summary.succeeded)} baris berhasil
                </Badge>
                <Badge className="border-transparent bg-warning-soft text-warning">
                  {formatNumber(summary.skipped)} baris dilewati
                </Badge>
              </div>
              {summary.details.length > 0 ? (
                <ul className="grid gap-1 text-xs text-muted-foreground">
                  {summary.details.map((detail) => (
                    <li key={detail.line.toString()}>
                      Baris {formatNumber(detail.line)}:{" "}
                      {skipReasonLabel(detail.reason)}
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          ) : null}
        </form>
      </CardContent>
    </Card>
  );
}

export default function Transaksi() {
  return (
    <div data-ocid="transaksi.page" className="space-y-6">
      <header className="space-y-1">
        <h1 className="font-display text-2xl font-bold tracking-tight">
          Transaksi
        </h1>
        <p className="text-sm text-muted-foreground">
          Catat penjualan manual atau impor massal dari spreadsheet. Setiap
          transaksi otomatis menambah kas masuk.
        </p>
      </header>

      <ManualTransactionForm />
      <TransactionTable />
      <ImportSection />
    </div>
  );
}
