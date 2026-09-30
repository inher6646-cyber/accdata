/**
 * Shared formatting helpers for the Bisnis Online app.
 *
 * Backend numeric fields are Motoko Nat/Int and arrive as `bigint`.
 * Every helper here accepts `bigint | number | null | undefined` so callers
 * never have to convert first.
 */

export type Numeric = bigint | number | null | undefined;

/** Safely coerce a backend numeric value to a JS number. */
export function toNumber(value: Numeric): number {
  if (value === null || value === undefined) return 0;
  if (typeof value === "bigint") return Number(value);
  return Number.isFinite(value) ? value : 0;
}

/** Format a value as Indonesian Rupiah, e.g. `Rp 1.250.000`. */
export function formatRupiah(value: Numeric): string {
  const amount = Math.round(toNumber(value));
  const sign = amount < 0 ? "-" : "";
  const digits = Math.abs(amount)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `${sign}Rp ${digits}`;
}

/** Format a value as a plain grouped integer, e.g. `1.250`. */
export function formatNumber(value: Numeric): string {
  const amount = Math.round(toNumber(value));
  const sign = amount < 0 ? "-" : "";
  return (
    sign +
    Math.abs(amount)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ".")
  );
}

/** Compact Rupiah for tight spaces, e.g. `Rp 1,2 jt`. */
export function formatRupiahShort(value: Numeric): string {
  const amount = Math.round(toNumber(value));
  const abs = Math.abs(amount);
  const sign = amount < 0 ? "-" : "";
  if (abs >= 1_000_000_000)
    return `${sign}Rp ${(abs / 1_000_000_000).toFixed(1).replace(".", ",")} M`;
  if (abs >= 1_000_000)
    return `${sign}Rp ${(abs / 1_000_000).toFixed(1).replace(".", ",")} jt`;
  if (abs >= 1_000) return `${sign}Rp ${(abs / 1_000).toFixed(0)} rb`;
  return `${sign}Rp ${abs}`;
}

const MONTHS_ID = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

const MONTHS_ID_SHORT = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "Mei",
  "Jun",
  "Jul",
  "Agu",
  "Sep",
  "Okt",
  "Nov",
  "Des",
];

/**
 * Convert a Motoko nanosecond timestamp to a JS Date.
 * Returns null when the value is missing or invalid.
 */
export function timestampToDate(timestamp: Numeric): Date | null {
  if (timestamp === null || timestamp === undefined) return null;
  const ms =
    typeof timestamp === "bigint"
      ? Number(timestamp / 1_000_000n)
      : Number(timestamp);
  if (!Number.isFinite(ms) || ms <= 0) return null;
  const date = new Date(ms);
  return Number.isNaN(date.getTime()) ? null : date;
}

/** Format a backend timestamp as `29 September 2026`. */
export function formatDate(timestamp: Numeric): string {
  const date = timestampToDate(timestamp);
  if (!date) return "—";
  return `${date.getDate()} ${MONTHS_ID[date.getMonth()]} ${date.getFullYear()}`;
}

/** Format a backend timestamp as `29 Sep 2026`. */
export function formatDateShort(timestamp: Numeric): string {
  const date = timestampToDate(timestamp);
  if (!date) return "—";
  return `${date.getDate()} ${MONTHS_ID_SHORT[date.getMonth()]} ${date.getFullYear()}`;
}

/** Format a backend timestamp as `29 Sep 2026, 14.05`. */
export function formatDateTime(timestamp: Numeric): string {
  const date = timestampToDate(timestamp);
  if (!date) return "—";
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${formatDateShort(timestamp)}, ${hours}.${minutes}`;
}

/** Format a JS Date as an ISO `yyyy-mm-dd` string for date inputs. */
export function toDateInputValue(date: Date): string {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/** Today as an ISO `yyyy-mm-dd` string. */
export function todayInputValue(): string {
  return toDateInputValue(new Date());
}

/** Human label for a transaction status. */
export function statusLabel(status: string): string {
  switch (status) {
    case "baru":
      return "Baru";
    case "proses":
      return "Diproses";
    case "kirim":
      return "Dikirim";
    case "selesai":
      return "Selesai";
    default:
      return status;
  }
}

/** Human label for a cashflow entry type. */
export function entryTypeLabel(entryType: string): string {
  return entryType === "masuk" ? "Masuk" : "Keluar";
}

/** Human label for a cashflow entry source. */
export function entrySourceLabel(source: string): string {
  switch (source) {
    case "transaksi":
      return "Transaksi";
    case "restock":
      return "Restock";
    case "manual":
      return "Manual";
    default:
      return source;
  }
}

/** Parse a user-typed Rupiah string (`1.250.000`, `1250000`) into a number. */
export function parseRupiah(input: string): number {
  const cleaned = input.replace(/[^\d-]/g, "");
  if (cleaned === "" || cleaned === "-") return 0;
  const parsed = Number.parseInt(cleaned, 10);
  return Number.isFinite(parsed) ? parsed : 0;
}
