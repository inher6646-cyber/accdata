import { createMockActor, makeProduct } from "@/test/mock-actor";
import { renderPage } from "@/test/render";
import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@caffeineai/core-infrastructure", () => ({
  useActor: vi.fn(),
}));

import Produk from "@/pages/Produk";
import { useActor } from "@caffeineai/core-infrastructure";

const mockedUseActor = vi.mocked(useActor);

function setActor(actor: ReturnType<typeof createMockActor>) {
  mockedUseActor.mockReturnValue({ actor, isFetching: false } as never);
}

describe("Produk", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("lists products with price, cost, stock, and sold quantity", async () => {
    setActor(
      createMockActor({
        products: [
          makeProduct({
            id: 1n,
            name: "Kaos Polos",
            price: 75_000n,
            cost: 40_000n,
            stock: 10n,
            sold: 3n,
          }),
        ],
      }),
    );

    renderPage(Produk);

    const row = await screen.findByRole("row", { name: /Kaos Polos/ });
    expect(within(row).getByText("Rp 75.000")).toBeInTheDocument();
    expect(within(row).getByText("Rp 40.000")).toBeInTheDocument();
    expect(within(row).getByText("10")).toBeInTheDocument();
    expect(within(row).getByText("3")).toBeInTheDocument();
  });

  it("submits a product with only a name, sending zero for the numeric fields", async () => {
    const actor = createMockActor({ products: [] });
    const createProduct = vi.fn().mockResolvedValue({ __kind__: "ok", ok: 1n });
    actor.createProduct = createProduct;
    setActor(actor);

    renderPage(Produk);

    const user = userEvent.setup();
    await user.type(await screen.findByLabelText(/Nama produk/), "Produk Baru");
    await user.click(screen.getByRole("button", { name: /Tambah Produk/ }));

    await waitFor(() => {
      expect(createProduct).toHaveBeenCalledWith({
        name: "Produk Baru",
        price: 0n,
        cost: 0n,
        stock: 0n,
      });
    });
  });

  it("blocks submission and shows an error when the name is empty", async () => {
    const actor = createMockActor({ products: [] });
    const createProduct = vi.fn();
    actor.createProduct = createProduct;
    setActor(actor);

    renderPage(Produk);

    const user = userEvent.setup();
    await user.click(
      await screen.findByRole("button", { name: /Tambah Produk/ }),
    );

    expect(
      await screen.findByText("Nama produk wajib diisi."),
    ).toBeInTheDocument();
    expect(createProduct).not.toHaveBeenCalled();
  });

  it("filters the table by product name", async () => {
    setActor(
      createMockActor({
        products: [
          makeProduct({ id: 1n, name: "Kaos Polos" }),
          makeProduct({ id: 2n, name: "Topi Bordir" }),
        ],
      }),
    );

    renderPage(Produk);

    const user = userEvent.setup();
    await user.type(
      await screen.findByLabelText("Cari produk berdasarkan nama"),
      "topi",
    );

    expect(await screen.findByText("Topi Bordir")).toBeInTheDocument();
    expect(screen.queryByText("Kaos Polos")).not.toBeInTheDocument();
  });

  it("deletes a product only after the confirmation dialog is accepted", async () => {
    const actor = createMockActor({
      products: [makeProduct({ id: 7n, name: "Produk Hapus" })],
    });
    const deleteProduct = vi.fn().mockResolvedValue(true);
    actor.deleteProduct = deleteProduct;
    setActor(actor);

    renderPage(Produk);

    const user = userEvent.setup();
    await user.click(
      await screen.findByRole("button", { name: "Hapus produk Produk Hapus" }),
    );

    // Confirmation is required before the mutation fires.
    expect(deleteProduct).not.toHaveBeenCalled();
    const dialog = await screen.findByRole("alertdialog");
    expect(
      within(dialog).getByText(/akan dihapus permanen/),
    ).toBeInTheDocument();

    await user.click(within(dialog).getByRole("button", { name: "Hapus" }));

    await waitFor(() => {
      expect(deleteProduct).toHaveBeenCalledWith(7n);
    });
  });

  it("does not delete when the confirmation is cancelled", async () => {
    const actor = createMockActor({
      products: [makeProduct({ id: 7n, name: "Produk Hapus" })],
    });
    const deleteProduct = vi.fn();
    actor.deleteProduct = deleteProduct;
    setActor(actor);

    renderPage(Produk);

    const user = userEvent.setup();
    await user.click(
      await screen.findByRole("button", { name: "Hapus produk Produk Hapus" }),
    );
    const dialog = await screen.findByRole("alertdialog");
    await user.click(within(dialog).getByRole("button", { name: "Batal" }));

    await waitFor(() => {
      expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();
    });
    expect(deleteProduct).not.toHaveBeenCalled();
  });
});
