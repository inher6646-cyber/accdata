import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useCreateProduct,
  useDeleteProduct,
  useProducts,
} from "@/hooks/use-backend";
import { formatNumber, formatRupiah, parseRupiah } from "@/lib/format";
import type { ProductView } from "@/types";
import { AlertCircle, Package, Plus, Search, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";

const LOW_STOCK_THRESHOLD = 5;

interface ProductDraft {
  name: string;
  price: string;
  cost: string;
  stock: string;
}

const EMPTY_DRAFT: ProductDraft = { name: "", price: "", cost: "", stock: "" };

function productErrorMessage(kind: string): string {
  switch (kind) {
    case "emptyName":
      return "Nama produk wajib diisi.";
    case "notFound":
      return "Produk tidak ditemukan.";
    default:
      return "Gagal menyimpan produk. Coba lagi.";
  }
}

function StockBadge({ stock }: { stock: bigint }) {
  const value = Number(stock);
  if (value <= 0) {
    return (
      <Badge
        variant="outline"
        className="border-destructive/30 bg-destructive-soft text-destructive"
      >
        Habis
      </Badge>
    );
  }
  if (value <= LOW_STOCK_THRESHOLD) {
    return (
      <Badge
        variant="outline"
        className="border-warning/40 bg-warning-soft text-warning"
      >
        Menipis
      </Badge>
    );
  }
  return (
    <Badge variant="outline" className="border-border text-muted-foreground">
      Aman
    </Badge>
  );
}

function AddProductForm() {
  const createProduct = useCreateProduct();
  const [draft, setDraft] = useState<ProductDraft>(EMPTY_DRAFT);
  const [nameError, setNameError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  function update<K extends keyof ProductDraft>(key: K, value: string) {
    setDraft((current) => ({ ...current, [key]: value }));
    if (key === "name" && nameError) setNameError(null);
    if (formError) setFormError(null);
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const name = draft.name.trim();
    if (name === "") {
      setNameError("Nama produk wajib diisi.");
      return;
    }

    const captured = draft;
    setDraft(EMPTY_DRAFT);
    setNameError(null);
    setFormError(null);

    createProduct.mutate(
      {
        name,
        price: BigInt(parseRupiah(captured.price)),
        cost: BigInt(parseRupiah(captured.cost)),
        stock: BigInt(parseRupiah(captured.stock)),
      },
      {
        onError: () => {
          setFormError(
            "Gagal menyimpan produk. Periksa koneksi lalu coba lagi.",
          );
          setDraft((current) => (current.name === "" ? captured : current));
        },
        onSuccess: (result) => {
          if (result.__kind__ === "err") {
            setFormError(productErrorMessage(result.err.__kind__));
            setDraft((current) => (current.name === "" ? captured : current));
          }
        },
      },
    );
  }

  return (
    <section
      data-ocid="produk.form_section"
      className="rounded-lg border border-border bg-card p-4 shadow-subtle md:p-5"
    >
      <div className="mb-4 flex items-center gap-2">
        <span
          aria-hidden="true"
          className="grid size-8 place-items-center rounded-md bg-primary/10 text-primary"
        >
          <Plus className="size-4" />
        </span>
        <div>
          <h2 className="font-display text-base font-semibold tracking-tight">
            Tambah Produk
          </h2>
          <p className="text-xs text-muted-foreground">
            Kolom angka boleh dikosongkan — otomatis dihitung 0.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-1.5 sm:col-span-2 lg:col-span-1">
            <Label htmlFor="produk-nama">
              Nama produk <span className="text-destructive">*</span>
            </Label>
            <Input
              id="produk-nama"
              data-ocid="produk.name_input"
              value={draft.name}
              onChange={(event) => update("name", event.target.value)}
              placeholder="Contoh: Kaos Polos Hitam"
              autoComplete="off"
              aria-invalid={nameError ? true : undefined}
              aria-describedby={nameError ? "produk-nama-error" : undefined}
            />
            {nameError ? (
              <p
                id="produk-nama-error"
                data-ocid="produk.name_error"
                className="flex items-center gap-1.5 text-xs font-medium text-destructive"
              >
                <AlertCircle className="size-3.5 shrink-0" aria-hidden="true" />
                {nameError}
              </p>
            ) : null}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="produk-harga-jual">Harga jual</Label>
            <Input
              id="produk-harga-jual"
              data-ocid="produk.price_input"
              inputMode="numeric"
              value={draft.price}
              onChange={(event) => update("price", event.target.value)}
              placeholder="0"
              autoComplete="off"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="produk-harga-modal">Harga modal</Label>
            <Input
              id="produk-harga-modal"
              data-ocid="produk.cost_input"
              inputMode="numeric"
              value={draft.cost}
              onChange={(event) => update("cost", event.target.value)}
              placeholder="0"
              autoComplete="off"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="produk-stok-awal">Stok awal</Label>
            <Input
              id="produk-stok-awal"
              data-ocid="produk.stock_input"
              inputMode="numeric"
              value={draft.stock}
              onChange={(event) => update("stock", event.target.value)}
              placeholder="0"
              autoComplete="off"
            />
          </div>
        </div>

        {formError ? (
          <p
            data-ocid="produk.form_error"
            className="flex items-center gap-1.5 rounded-md bg-destructive-soft px-3 py-2 text-sm font-medium text-destructive"
          >
            <AlertCircle className="size-4 shrink-0" aria-hidden="true" />
            {formError}
          </p>
        ) : null}

        <div className="flex justify-end">
          <Button
            type="submit"
            data-ocid="produk.submit_button"
            disabled={createProduct.isPending}
            className="w-full sm:w-auto"
          >
            <Plus aria-hidden="true" />
            {createProduct.isPending ? "Menyimpan…" : "Tambah Produk"}
          </Button>
        </div>
      </form>
    </section>
  );
}

function ProductTableSkeleton() {
  const rows = Array.from({ length: 5 }, (_, i) => `produk-skeleton-${i}`);
  return (
    <div
      data-ocid="produk.loading_state"
      className="overflow-hidden rounded-lg border border-border bg-card shadow-subtle"
    >
      <div className="space-y-3 p-4">
        {rows.map((id) => (
          <Skeleton key={id} className="h-10 w-full" />
        ))}
      </div>
    </div>
  );
}

function ProductEmptyState({ filtered }: { filtered: boolean }) {
  return (
    <div
      data-ocid="produk.empty_state"
      className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border bg-card px-6 py-14 text-center"
    >
      <span
        aria-hidden="true"
        className="grid size-12 place-items-center rounded-full bg-muted text-muted-foreground"
      >
        {filtered ? (
          <Search className="size-6" />
        ) : (
          <Package className="size-6" />
        )}
      </span>
      <div className="space-y-1">
        <h3 className="font-display text-base font-semibold">
          {filtered ? "Produk tidak ditemukan" : "Belum ada produk"}
        </h3>
        <p className="max-w-sm text-sm text-muted-foreground">
          {filtered
            ? "Coba kata kunci lain atau kosongkan pencarian."
            : "Tambahkan produk pertama lewat formulir di atas untuk mulai mencatat stok dan penjualan."}
        </p>
      </div>
    </div>
  );
}

function ProductRow({
  product,
  index,
  onDelete,
}: {
  product: ProductView;
  index: number;
  onDelete: (product: ProductView) => void;
}) {
  const position = index + 1;
  return (
    <TableRow data-ocid={`produk.row.${position}`}>
      <TableCell className="min-w-[10rem] font-medium">
        <span className="line-clamp-2 break-words">{product.name}</span>
      </TableCell>
      <TableCell className="num whitespace-nowrap text-right">
        {formatRupiah(product.price)}
      </TableCell>
      <TableCell className="num whitespace-nowrap text-right text-muted-foreground">
        {formatRupiah(product.cost)}
      </TableCell>
      <TableCell className="whitespace-nowrap text-right">
        <div className="flex items-center justify-end gap-2">
          <span className="num font-medium">{formatNumber(product.stock)}</span>
          <StockBadge stock={product.stock} />
        </div>
      </TableCell>
      <TableCell className="num whitespace-nowrap text-right">
        {formatNumber(product.sold)}
      </TableCell>
      <TableCell className="text-right">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          data-ocid={`produk.delete_button.${position}`}
          onClick={() => onDelete(product)}
          aria-label={`Hapus produk ${product.name}`}
          className="text-muted-foreground hover:bg-destructive-soft hover:text-destructive"
        >
          <Trash2 aria-hidden="true" />
        </Button>
      </TableCell>
    </TableRow>
  );
}

export default function Produk() {
  const { data: products, isLoading, isError, refetch } = useProducts();
  const deleteProduct = useDeleteProduct();
  const [search, setSearch] = useState("");
  const [pendingDelete, setPendingDelete] = useState<ProductView | null>(null);

  const list = products ?? [];

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (query === "") return list;
    return list.filter((product) => product.name.toLowerCase().includes(query));
  }, [list, search]);

  const isFiltering = search.trim() !== "";

  function handleConfirmDelete() {
    if (!pendingDelete) return;
    deleteProduct.mutate(pendingDelete.id);
    setPendingDelete(null);
  }

  return (
    <div data-ocid="produk.page" className="space-y-6">
      <header className="flex flex-col gap-1">
        <h1 className="font-display text-2xl font-bold tracking-tight">
          Produk
        </h1>
        <p className="text-sm text-muted-foreground">
          Kelola katalog, harga, dan stok barang dagangan.
        </p>
      </header>

      <AddProductForm />

      <section
        data-ocid="produk.table_section"
        className="space-y-3"
        aria-labelledby="produk-daftar-heading"
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-baseline gap-2">
            <h2
              id="produk-daftar-heading"
              className="font-display text-base font-semibold tracking-tight"
            >
              Daftar Produk
            </h2>
            <span className="num text-xs text-muted-foreground">
              {formatNumber(filtered.length)} produk
            </span>
          </div>
          <div className="relative w-full sm:w-72">
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              data-ocid="produk.search_input"
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Cari nama produk…"
              aria-label="Cari produk berdasarkan nama"
              className="pl-9"
            />
          </div>
        </div>

        {isLoading ? (
          <ProductTableSkeleton />
        ) : isError ? (
          <div
            data-ocid="produk.error_state"
            className="flex flex-col items-center gap-3 rounded-lg border border-destructive/30 bg-destructive-soft px-6 py-10 text-center"
          >
            <AlertCircle
              className="size-6 text-destructive"
              aria-hidden="true"
            />
            <div className="space-y-1">
              <h3 className="font-display text-base font-semibold">
                Gagal memuat produk
              </h3>
              <p className="text-sm text-muted-foreground">
                Terjadi masalah saat mengambil data. Coba muat ulang.
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              data-ocid="produk.retry_button"
              onClick={() => void refetch()}
            >
              Coba lagi
            </Button>
          </div>
        ) : filtered.length === 0 ? (
          <ProductEmptyState filtered={isFiltering} />
        ) : (
          <div className="overflow-hidden rounded-lg border border-border bg-card shadow-subtle">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="sticky top-0 z-10 bg-muted/95 backdrop-blur">
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="min-w-[10rem]">Nama</TableHead>
                    <TableHead className="text-right">Harga Jual</TableHead>
                    <TableHead className="text-right">Harga Modal</TableHead>
                    <TableHead className="text-right">Stok</TableHead>
                    <TableHead className="text-right">Terjual</TableHead>
                    <TableHead className="w-16 text-right">
                      <span className="sr-only">Aksi</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((product, index) => (
                    <ProductRow
                      key={product.id.toString()}
                      product={product}
                      index={index}
                      onDelete={setPendingDelete}
                    />
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
      </section>

      <AlertDialog
        open={pendingDelete !== null}
        onOpenChange={(open) => {
          if (!open) setPendingDelete(null);
        }}
      >
        <AlertDialogContent data-ocid="produk.delete_dialog">
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus produk ini?</AlertDialogTitle>
            <AlertDialogDescription>
              {pendingDelete
                ? `"${pendingDelete.name}" akan dihapus permanen dari katalog. Tindakan ini tidak dapat dibatalkan.`
                : ""}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-ocid="produk.cancel_button">
              Batal
            </AlertDialogCancel>
            <AlertDialogAction
              data-ocid="produk.confirm_button"
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
