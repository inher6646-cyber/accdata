import {
  entrySourceLabel,
  entryTypeLabel,
  formatDate,
  formatDateTime,
  formatNumber,
  formatRupiah,
  formatRupiahShort,
  parseRupiah,
  statusLabel,
  timestampToDate,
  toNumber,
} from "@/lib/format";
import { describe, expect, it } from "vitest";

describe("formatRupiah", () => {
  it("groups thousands with dots and prefixes Rp", () => {
    expect(formatRupiah(1_250_000n)).toBe("Rp 1.250.000");
    expect(formatRupiah(0n)).toBe("Rp 0");
    expect(formatRupiah(999)).toBe("Rp 999");
  });

  it("handles negative amounts and missing values", () => {
    expect(formatRupiah(-5_000n)).toBe("-Rp 5.000");
    expect(formatRupiah(null)).toBe("Rp 0");
    expect(formatRupiah(undefined)).toBe("Rp 0");
  });
});

describe("formatNumber", () => {
  it("groups digits without a currency prefix", () => {
    expect(formatNumber(1_250n)).toBe("1.250");
    expect(formatNumber(0n)).toBe("0");
  });
});

describe("formatRupiahShort", () => {
  it("compacts large amounts into jt and rb", () => {
    expect(formatRupiahShort(1_200_000n)).toBe("Rp 1,2 jt");
    expect(formatRupiahShort(1_500_000_000n)).toBe("Rp 1,5 M");
    expect(formatRupiahShort(2_000n)).toBe("Rp 2 rb");
  });
});

describe("toNumber", () => {
  it("coerces bigint, number, and nullish values", () => {
    expect(toNumber(42n)).toBe(42);
    expect(toNumber(7)).toBe(7);
    expect(toNumber(null)).toBe(0);
    expect(toNumber(undefined)).toBe(0);
  });
});

describe("date formatting", () => {
  // 2026-09-29T00:00:00Z as nanoseconds.
  const timestamp = BigInt(Date.UTC(2026, 8, 29, 12, 5)) * 1_000_000n;

  it("formats a timestamp with Indonesian month names", () => {
    expect(formatDate(timestamp)).toMatch(/^29 September 2026$/);
    expect(formatDateTime(timestamp)).toMatch(/^29 Sep 2026, \d{2}\.\d{2}$/);
  });

  it("returns a placeholder for missing timestamps", () => {
    expect(formatDate(null)).toBe("—");
    expect(timestampToDate(0n)).toBeNull();
  });
});

describe("label helpers", () => {
  it("maps status, entry type, and source to Indonesian labels", () => {
    expect(statusLabel("baru")).toBe("Baru");
    expect(statusLabel("proses")).toBe("Diproses");
    expect(statusLabel("kirim")).toBe("Dikirim");
    expect(statusLabel("selesai")).toBe("Selesai");
    expect(entryTypeLabel("masuk")).toBe("Masuk");
    expect(entryTypeLabel("keluar")).toBe("Keluar");
    expect(entrySourceLabel("transaksi")).toBe("Transaksi");
    expect(entrySourceLabel("restock")).toBe("Restock");
    expect(entrySourceLabel("manual")).toBe("Manual");
  });
});

describe("parseRupiah", () => {
  it("parses grouped and plain digit strings", () => {
    expect(parseRupiah("1.250.000")).toBe(1_250_000);
    expect(parseRupiah("1250000")).toBe(1_250_000);
    expect(parseRupiah("")).toBe(0);
    expect(parseRupiah("abc")).toBe(0);
  });
});
