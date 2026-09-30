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
  useCreateRestock,
  useProducts,
  useRestocks,
} from "@/hooks/use-backend";
import {
  formatDate,
  formatNumber,
  formatRupiah,
  parseRupiah,
} from "@/lib/format";
import type { NewRestock, Restock as RestockRow } from "@/types";
import { ArrowDownUp, Info, PackagePlus } from "lucide-react";
import { useState } from "react";

const EMPTY_PRODUCT = "__none__";

function RestockForm() {
  const { data: products, isLoading } = useProducts();
  const createRestock = useCreateRestock();

  const [productId, setProductId] = useState("");
  const [qty, setQty] = useState("");
  const [cost, setCost] = useState("");
  const [supplier, setSupplier] = useState("");
  const [error, setError] = useState<string | null>(null);

  const qtyNumber = Number.parseInt(qty, 10);
  const costNumber = parseRupiah(cost);
  const total = Number.isFinite(qtyNumber) ? qtyNumber * costNumber : 0;
  const hasProducts = (products?.length ?? 0) > 0;

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
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

    const input: NewRestock = {
      productId: BigInt(productId),
      qty: BigInt(qtyNumber),
      cost: BigInt(costNumber),
      supplier: supplier.trim(),
    };

    const draft = { qty, cost, supplier };
    setQty("");
    setCost("");
    setSupplier("");

    createRestock.mutate(input, {
      onError: () => {
        setQty((current) => (current === "" ? draft.qty : current));
        setCost((current) => (current === "" ? draft.cost : current));
        setSupplier((current) => (current === "" ? draft.supplier : current));
        setError("Gagal menyimpan restock. Coba lagi.");
      },
    });
  }

  return (
    <Card data-ocid="restock.form_card" className="shadow-subtle">
      <CardHeader className="gap-1">
        <CardTitle className="flex items-center gap-2 font-display text-base">
          <PackagePlus className="size-4 text-primary" aria-hidden="true" />
          Catat Restock
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Tambah stok barang yang baru dibeli dari supplier.
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div className="space-y-2">
            <Label htmlFor="restock-product">Produk</Label>
            <Select
              value={productId || EMPTY_PRODUCT}
              onValueChange={(value) =>
                setProductId(value === EMPTY_PRODUCT ? "" : value)
              }
              disabled={isLoading || !hasProducts}
            >
              <SelectTrigger
                id="restock-product"
                data-ocid="restock.product_select"
                className="w-full"
              >
                <SelectValue
                  placeholder={
                    isLoading
                      ? "Memuat produk…"
                      : hasProducts
                        ? "Pilih produk"
                        : "Belum ada produk"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {(products ?? []).map((product) => (
                  <SelectItem key={product.id} value={product.id.toString()}>
                    {product.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {!isLoading && !hasProducts ? (
              <p className="text-xs text-muted-foreground">
                Tambahkan produk di halaman Produk sebelum mencatat restock.
              </p>
            ) : null}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="restock-qty">Jumlah masuk</Label>
              <Input
                id="restock-qty"
                data-ocid="restock.qty_input"
                type="number"
                inputMode="numeric"
                min={1}
                step={1}
                placeholder="0"
                value={qty}
                onChange={(event) => setQty(event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="restock-cost">Harga beli per unit</Label>
              <Input
                id="restock-cost"
                data-ocid="restock.cost_input"
                type="text"
                inputMode="numeric"
                placeholder="0"
                value={cost}
                onChange={(event) => setCost(event.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="restock-supplier">
              Nama supplier{" "}
              <span className="font-normal text-muted-foreground">
                (opsional)
              </span>
            </Label>
            <Input
              id="restock-supplier"
              data-ocid="restock.supplier_input"
              type="text"
              placeholder="Contoh: Toko Grosir Sinar Jaya"
              value={supplier}
              onChange={(event) => setSupplier(event.target.value)}
            />
          </div>

          <div className="flex items-center justify-between gap-3 rounded-lg border border-border bg-muted/50 px-4 py-3">
            <span className="text-sm font-medium text-muted-foreground">
              Total biaya
            </span>
            <span
              data-ocid="restock.total_cost"
              className="num font-display text-lg font-bold text-foreground"
            >
              {formatRupiah(total)}
            </span>
          </div>

          {error ? (
            <p
              data-ocid="restock.error_state"
              role="alert"
              className="rounded-md bg-destructive-soft px-3 py-2 text-sm font-medium text-destructive"
            >
              {error}
            </p>
          ) : null}

          <Button
            type="submit"
            data-ocid="restock.submit_button"
            disabled={createRestock.isPending}
            className="w-full sm:w-auto"
          >
            {createRestock.isPending ? "Menyimpan…" : "Simpan Restock"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

function HistoryTable() {
  const { data: restocks, isLoading } = useRestocks();
  const rows = restocks ?? [];

  return (
    <Card data-ocid="restock.history_card" className="shadow-subtle">
      <CardHeader className="gap-1">
        <CardTitle className="flex items-center gap-2 font-display text-base">
          <ArrowDownUp className="size-4 text-primary" aria-hidden="true" />
          Riwayat Restock
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Semua pembelian stok yang pernah dicatat.
        </p>
      </CardHeader>
      <CardContent className="px-0 sm:px-6">
        {isLoading ? (
          <div
            data-ocid="restock.loading_state"
            className="space-y-2 px-4 sm:px-0"
          >
            {Array.from({ length: 4 }, (_, i) => `restock-skeleton-${i}`).map(
              (id) => (
                <Skeleton key={id} className="h-12 w-full rounded-md" />
              ),
            )}
          </div>
        ) : rows.length === 0 ? (
          <div
            data-ocid="restock.empty_state"
            className="flex flex-col items-center gap-2 px-4 py-10 text-center sm:px-0"
          >
            <span className="grid size-11 place-items-center rounded-full bg-muted text-muted-foreground">
              <ArrowDownUp className="size-5" aria-hidden="true" />
            </span>
            <p className="font-display text-sm font-semibold">
              Belum ada riwayat restock
            </p>
            <p className="max-w-xs text-sm text-muted-foreground">
              Catat restock pertama lewat formulir di atas.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table
              data-ocid="restock.table"
              className="w-full min-w-[640px] border-collapse text-sm"
            >
              <thead>
                <tr className="border-b border-border text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <th scope="col" className="px-4 py-3 sm:px-0">
                    Tanggal
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Produk
                  </th>
                  <th scope="col" className="px-4 py-3 text-right">
                    Qty
                  </th>
                  <th scope="col" className="px-4 py-3 text-right">
                    Harga Beli
                  </th>
                  <th scope="col" className="px-4 py-3 sm:pr-0">
                    Supplier
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row: RestockRow, index) => (
                  <tr
                    key={row.id}
                    data-ocid={`restock.row.${index + 1}`}
                    className="border-b border-border last:border-0 transition-fast hover:bg-muted/50"
                  >
                    <td className="whitespace-nowrap px-4 py-3 text-muted-foreground sm:px-0">
                      {formatDate(row.date)}
                    </td>
                    <td className="px-4 py-3 font-medium">{row.productName}</td>
                    <td className="num px-4 py-3 text-right">
                      {formatNumber(row.qty)}
                    </td>
                    <td className="num px-4 py-3 text-right">
                      {formatRupiah(row.cost)}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground sm:pr-0">
                      {row.supplier.trim() === "" ? "—" : row.supplier}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function Restock() {
  return (
    <div data-ocid="restock.page" className="space-y-6">
      <header className="space-y-1">
        <h1 className="font-display text-2xl font-bold tracking-tight">
          Restock
        </h1>
        <p className="text-sm text-muted-foreground">
          Catat pembelian stok dan pantau riwayatnya.
        </p>
      </header>

      <div
        data-ocid="restock.note"
        className="flex items-start gap-3 rounded-lg border border-border bg-secondary px-4 py-3"
      >
        <Info
          className="mt-0.5 size-4 shrink-0 text-primary"
          aria-hidden="true"
        />
        <p className="text-sm leading-relaxed text-secondary-foreground">
          Menyimpan restock akan menambah stok produk, memperbarui harga modal
          produk ke harga beli terbaru, dan otomatis mencatat satu entri kas
          keluar sebesar jumlah × harga beli.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,380px)_minmax(0,1fr)] lg:items-start">
        <RestockForm />
        <HistoryTable />
      </div>
    </div>
  );
}
