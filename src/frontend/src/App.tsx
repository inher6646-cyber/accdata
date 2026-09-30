import { Layout } from "@/components/Layout";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { Suspense, lazy } from "react";

const DashboardPage = lazy(() => import("@/pages/Dashboard"));
const ProdukPage = lazy(() => import("@/pages/Produk"));
const TransaksiPage = lazy(() => import("@/pages/Transaksi"));
const RestockPage = lazy(() => import("@/pages/Restock"));
const KasPage = lazy(() => import("@/pages/Kas"));

function PageFallback() {
  return (
    <div
      data-ocid="page.loading_state"
      className="flex min-h-[40vh] items-center justify-center"
    >
      <div className="flex flex-col items-center gap-3">
        <span
          aria-hidden="true"
          className="size-6 animate-spin rounded-full border-2 border-muted border-t-primary"
        />
        <p className="text-sm text-muted-foreground">Memuat halaman…</p>
      </div>
    </div>
  );
}

const rootRoute = createRootRoute({
  component: () => (
    <Layout>
      <Suspense fallback={<PageFallback />}>
        <Outlet />
      </Suspense>
    </Layout>
  ),
});

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: DashboardPage,
});

const produkRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/produk",
  component: ProdukPage,
});

const transaksiRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/transaksi",
  component: TransaksiPage,
});

const restockRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/restock",
  component: RestockPage,
});

const kasRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/kas",
  component: KasPage,
});

const routeTree = rootRoute.addChildren([
  dashboardRoute,
  produkRoute,
  transaksiRoute,
  restockRoute,
  kasRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
