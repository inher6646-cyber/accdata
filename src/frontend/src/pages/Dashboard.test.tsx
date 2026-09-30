import {
  createMockActor,
  emptyDashboard,
  makeProduct,
  makeTransaction,
} from "@/test/mock-actor";
import { renderPage } from "@/test/render";
import { screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@caffeineai/core-infrastructure", () => ({
  useActor: vi.fn(),
}));

import Dashboard from "@/pages/Dashboard";
import { useActor } from "@caffeineai/core-infrastructure";

const mockedUseActor = vi.mocked(useActor);

function setActor(actor: ReturnType<typeof createMockActor>) {
  mockedUseActor.mockReturnValue({ actor, isFetching: false } as never);
}

describe("Dashboard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders summary cards and recent transactions from the backend", async () => {
    setActor(
      createMockActor({
        dashboard: {
          summary: {
            omzet: 1_250_000n,
            labaKotor: 400_000n,
            saldoKas: 900_000n,
            produkStokMenipis: 1n,
          },
          recentTransactions: [
            makeTransaction({ orderNo: "INV-777", productName: "Kaos Polos" }),
          ],
          lowStockProducts: [makeProduct({ name: "Topi", stock: 2n })],
        },
      }),
    );

    renderPage(Dashboard);

    expect(await screen.findByText("Rp 1.250.000")).toBeInTheDocument();
    expect(screen.getByText("Rp 400.000")).toBeInTheDocument();
    expect(screen.getByText("Rp 900.000")).toBeInTheDocument();
    expect(screen.getByText("INV-777")).toBeInTheDocument();
    expect(screen.getByText("Topi")).toBeInTheDocument();
  });

  it("shows empty states when there is no data", async () => {
    setActor(createMockActor({ dashboard: emptyDashboard() }));

    renderPage(Dashboard);

    expect(await screen.findByText("Belum ada transaksi")).toBeInTheDocument();
    expect(screen.getByText("Semua stok aman")).toBeInTheDocument();
  });

  it("shows an error state with a retry action when the query fails", async () => {
    const actor = createMockActor();
    actor.getDashboard = vi.fn().mockRejectedValue(new Error("boom"));
    setActor(actor);

    renderPage(Dashboard);

    expect(
      await screen.findByText("Gagal memuat ringkasan"),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Coba lagi" }),
    ).toBeInTheDocument();
  });

  it("renders the dashboard heading", async () => {
    setActor(createMockActor({ dashboard: emptyDashboard() }));

    renderPage(Dashboard);

    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: "Dashboard" }),
      ).toBeInTheDocument();
    });
  });
});
