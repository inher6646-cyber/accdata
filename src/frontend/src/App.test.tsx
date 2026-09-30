import { createMockActor, emptyDashboard } from "@/test/mock-actor";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@caffeineai/core-infrastructure", () => ({
  useActor: vi.fn(),
}));

import App from "@/App";
import { useActor } from "@caffeineai/core-infrastructure";

const mockedUseActor = vi.mocked(useActor);

function setActor(actor: ReturnType<typeof createMockActor>) {
  mockedUseActor.mockReturnValue({ actor, isFetching: false } as never);
}

function renderApp() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0, staleTime: 0 },
      mutations: { retry: false },
    },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>,
  );
}

/**
 * The app shell journey: the real router, real Layout, and the lazy-loaded
 * pages, with only the backend actor mocked. It proves the default route
 * renders Dashboard instead of a blank screen and that every primary nav
 * destination is reachable from the shell.
 */
describe("App navigation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setActor(createMockActor({ dashboard: emptyDashboard() }));
  });

  it("opens on the default route showing the Dashboard, not a blank screen", async () => {
    renderApp();

    expect(
      await screen.findByRole("heading", { name: "Dashboard" }),
    ).toBeInTheDocument();
    // The shell renders a desktop sidebar and a mobile bottom bar, both
    // labelled "Navigasi utama".
    expect(
      screen.getAllByRole("navigation", { name: "Navigasi utama" }).length,
    ).toBeGreaterThan(0);
  });

  it("navigates to each of the five modules from the shell", async () => {
    renderApp();

    const user = userEvent.setup();
    await screen.findByRole("heading", { name: "Dashboard" });

    const destinations: Array<{ label: string; heading: string }> = [
      { label: "Produk", heading: "Produk" },
      { label: "Transaksi", heading: "Transaksi" },
      { label: "Restock", heading: "Restock" },
      { label: "Kas", heading: "Kas" },
      { label: "Dashboard", heading: "Dashboard" },
    ];

    for (const { label, heading } of destinations) {
      const nav = screen.getAllByRole("navigation", {
        name: "Navigasi utama",
      })[0];
      await user.click(
        within(nav).getByRole("link", { name: new RegExp(label) }),
      );
      await waitFor(() => {
        expect(
          screen.getByRole("heading", { name: heading }),
        ).toBeInTheDocument();
      });
    }
  });
});
