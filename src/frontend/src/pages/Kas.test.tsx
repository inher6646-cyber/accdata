import { EntrySource, EntryType } from "@/backend";
import { createMockActor, makeCashflowRow } from "@/test/mock-actor";
import { renderPage } from "@/test/render";
import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@caffeineai/core-infrastructure", () => ({
  useActor: vi.fn(),
}));

import Kas from "@/pages/Kas";
import { useActor } from "@caffeineai/core-infrastructure";

const mockedUseActor = vi.mocked(useActor);

function setActor(actor: ReturnType<typeof createMockActor>) {
  mockedUseActor.mockReturnValue({ actor, isFetching: false } as never);
}

function selectByOcid(ocid: string): HTMLElement {
  const el = document.querySelector<HTMLElement>(`[data-ocid="${ocid}"]`);
  if (!el) throw new Error(`No element with data-ocid="${ocid}"`);
  return el;
}

describe("Kas", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows the total balance as the sum of all in minus all out entries", async () => {
    setActor(
      createMockActor({
        cashflow: [
          makeCashflowRow({
            id: 1n,
            entryType: EntryType.masuk,
            amount: 500_000n,
            balance: 500_000n,
          }),
          makeCashflowRow({
            id: 2n,
            entryType: EntryType.keluar,
            amount: 125_000n,
            balance: 375_000n,
          }),
        ],
      }),
    );

    renderPage(Kas);

    await waitFor(() => {
      expect(selectByOcid("kas.balance.text")).toHaveTextContent("Rp 375.000");
    });
  });

  it("records a manual cash entry with the chosen type, amount, and note", async () => {
    const actor = createMockActor({ cashflow: [] });
    const createCashflowEntry = vi
      .fn()
      .mockResolvedValue({ __kind__: "ok", ok: makeCashflowRow() });
    actor.createCashflowEntry = createCashflowEntry;
    setActor(actor);

    renderPage(Kas);

    const user = userEvent.setup();
    await user.click(await screen.findByText("Catat Kas Manual"));
    await user.click(selectByOcid("kas.form.jenis_select"));
    await user.click(await screen.findByRole("option", { name: "Keluar" }));
    await user.type(screen.getByLabelText("Jumlah (Rp)"), "50000");
    await user.type(screen.getByLabelText("Catatan"), "bayar listrik toko");
    await user.click(screen.getByRole("button", { name: /Simpan Entri/ }));

    await waitFor(() => {
      expect(createCashflowEntry).toHaveBeenCalledWith({
        entryType: EntryType.keluar,
        amount: 50_000n,
        note: "bayar listrik toko",
      });
    });
  });

  it("rejects a zero amount and does not call the backend", async () => {
    const actor = createMockActor({ cashflow: [] });
    const createCashflowEntry = vi.fn();
    actor.createCashflowEntry = createCashflowEntry;
    setActor(actor);

    renderPage(Kas);

    const user = userEvent.setup();
    await user.click(
      await screen.findByRole("button", { name: /Simpan Entri/ }),
    );

    expect(
      await screen.findByText("Jumlah harus lebih dari 0."),
    ).toBeInTheDocument();
    expect(createCashflowEntry).not.toHaveBeenCalled();
  });

  it("renders the running balance for each entry", async () => {
    setActor(
      createMockActor({
        cashflow: [
          makeCashflowRow({
            id: 1n,
            entryType: EntryType.masuk,
            amount: 500_000n,
            balance: 500_000n,
            note: "Modal awal",
          }),
          makeCashflowRow({
            id: 2n,
            entryType: EntryType.keluar,
            amount: 125_000n,
            balance: 375_000n,
            note: "Beli kemasan",
          }),
        ],
      }),
    );

    renderPage(Kas);

    const table = await screen.findByRole("table");
    const rows = within(table).getAllByRole("row");
    // header + 2 data rows
    expect(rows).toHaveLength(3);
    expect(rows[1]).toHaveTextContent("Rp 500.000");
    expect(rows[2]).toHaveTextContent("Rp 375.000");
  });

  it("filters entries by jenis and resets the filter", async () => {
    setActor(
      createMockActor({
        cashflow: [
          makeCashflowRow({
            id: 1n,
            entryType: EntryType.masuk,
            amount: 500_000n,
            balance: 500_000n,
            note: "Modal awal",
          }),
          makeCashflowRow({
            id: 2n,
            entryType: EntryType.keluar,
            amount: 125_000n,
            balance: 375_000n,
            note: "Beli kemasan",
          }),
        ],
      }),
    );

    renderPage(Kas);

    const user = userEvent.setup();
    await user.click(await screen.findByText("Filter"));
    await user.click(selectByOcid("kas.filter.jenis_select"));
    await user.click(await screen.findByRole("option", { name: "Keluar" }));

    await waitFor(() => {
      expect(screen.getByText("1 entri")).toBeInTheDocument();
    });
    // The note renders once in the mobile list and once in the desktop table.
    expect(screen.getAllByText("Beli kemasan").length).toBeGreaterThan(0);
    expect(screen.queryByText("Modal awal")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /Reset filter/ }));
    await waitFor(() => {
      expect(screen.getByText("2 entri")).toBeInTheDocument();
    });
    expect(screen.getAllByText("Modal awal").length).toBeGreaterThan(0);
  });

  it("shows an empty state when there are no entries", async () => {
    setActor(createMockActor({ cashflow: [] }));

    renderPage(Kas);

    expect(await screen.findByText("Belum ada entri kas")).toBeInTheDocument();
  });
});
