import { createMockActor, makeProduct, makeRestock } from "@/test/mock-actor";
import { renderPage } from "@/test/render";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@caffeineai/core-infrastructure", () => ({
  useActor: vi.fn(),
}));

import Restock from "@/pages/Restock";
import { useActor } from "@caffeineai/core-infrastructure";

const mockedUseActor = vi.mocked(useActor);

function setActor(actor: ReturnType<typeof createMockActor>) {
  mockedUseActor.mockReturnValue({ actor, isFetching: false } as never);
}

async function selectProduct(
  user: ReturnType<typeof userEvent.setup>,
  name: string,
) {
  await user.click(await screen.findByRole("combobox", { name: "Produk" }));
  await user.click(
    await screen.findByRole("option", { name: new RegExp(name) }),
  );
}

describe("Restock", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("computes the total cost from qty × purchase price", async () => {
    setActor(
      createMockActor({
        products: [makeProduct({ id: 1n, name: "Kaos Polos" })],
      }),
    );

    renderPage(Restock);

    const user = userEvent.setup();
    await selectProduct(user, "Kaos Polos");
    await user.type(screen.getByLabelText("Jumlah masuk"), "4");
    await user.type(screen.getByLabelText("Harga beli per unit"), "25000");

    expect(await screen.findByText("Rp 100.000")).toBeInTheDocument();
  });

  it("saves a restock with the selected product, qty, cost, and supplier", async () => {
    const actor = createMockActor({
      products: [makeProduct({ id: 7n, name: "Kaos Polos" })],
    });
    const createRestock = vi
      .fn()
      .mockResolvedValue({ __kind__: "ok", ok: makeRestock() });
    actor.createRestock = createRestock;
    setActor(actor);

    renderPage(Restock);

    const user = userEvent.setup();
    await selectProduct(user, "Kaos Polos");
    await user.type(screen.getByLabelText("Jumlah masuk"), "4");
    await user.type(screen.getByLabelText("Harga beli per unit"), "25000");
    await user.type(screen.getByLabelText(/Nama supplier/), "Grosir Jaya");
    await user.click(screen.getByRole("button", { name: /Simpan Restock/ }));

    await waitFor(() => {
      expect(createRestock).toHaveBeenCalledWith({
        productId: 7n,
        qty: 4n,
        cost: 25_000n,
        supplier: "Grosir Jaya",
      });
    });
  });

  it("rejects a restock without a product and does not call the backend", async () => {
    const actor = createMockActor({
      products: [makeProduct({ id: 1n, name: "Kaos Polos" })],
    });
    const createRestock = vi.fn();
    actor.createRestock = createRestock;
    setActor(actor);

    renderPage(Restock);

    const user = userEvent.setup();
    await user.type(await screen.findByLabelText("Jumlah masuk"), "4");
    await user.type(screen.getByLabelText("Harga beli per unit"), "25000");
    await user.click(screen.getByRole("button", { name: /Simpan Restock/ }));

    expect(
      await screen.findByText("Pilih produk terlebih dahulu."),
    ).toBeInTheDocument();
    expect(createRestock).not.toHaveBeenCalled();
  });

  it("rejects a zero purchase price and does not call the backend", async () => {
    const actor = createMockActor({
      products: [makeProduct({ id: 1n, name: "Kaos Polos" })],
    });
    const createRestock = vi.fn();
    actor.createRestock = createRestock;
    setActor(actor);

    renderPage(Restock);

    const user = userEvent.setup();
    await selectProduct(user, "Kaos Polos");
    await user.type(screen.getByLabelText("Jumlah masuk"), "4");
    await user.click(screen.getByRole("button", { name: /Simpan Restock/ }));

    expect(
      await screen.findByText("Harga beli per unit harus lebih dari 0."),
    ).toBeInTheDocument();
    expect(createRestock).not.toHaveBeenCalled();
  });

  it("renders the restock history with formatted values", async () => {
    setActor(
      createMockActor({
        products: [makeProduct({ id: 1n, name: "Kaos Polos" })],
        restocks: [
          makeRestock({
            id: 3n,
            productName: "Kaos Polos",
            qty: 5n,
            cost: 40_000n,
            supplier: "Grosir Jaya",
          }),
        ],
      }),
    );

    renderPage(Restock);

    const table = await screen.findByRole("table");
    expect(await screen.findByText("Grosir Jaya")).toBeInTheDocument();
    expect(table).toHaveTextContent("Rp 40.000");
  });

  it("shows an empty state when there is no restock history", async () => {
    setActor(
      createMockActor({
        products: [makeProduct({ id: 1n, name: "Kaos Polos" })],
        restocks: [],
      }),
    );

    renderPage(Restock);

    expect(
      await screen.findByText("Belum ada riwayat restock"),
    ).toBeInTheDocument();
  });
});
