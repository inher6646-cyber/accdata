import { type MockActor, createMockActor } from "@/test/mock-actor";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  RouterProvider,
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { type RenderResult, render } from "@testing-library/react";
import type { ReactElement } from "react";

/**
 * Render a page inside the providers it expects — a real TanStack Router (so
 * `Link`/`useRouterState` work) and a React Query client — with `useActor`
 * replaced by a typed local mock. The mock is a seam, not the canister: these
 * tests prove component behavior against a predictable backend, never backend
 * behavior.
 */
export function renderPage(
  Page: () => ReactElement,
  actor: MockActor = createMockActor(),
  initialPath = "/",
): RenderResult & { actor: MockActor } {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0, staleTime: 0 },
      mutations: { retry: false },
    },
  });

  const rootRoute = createRootRoute({ component: () => <Outlet /> });
  const pageRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/",
    component: Page,
  });
  const router = createRouter({
    routeTree: rootRoute.addChildren([pageRoute]),
    history: createMemoryHistory({ initialEntries: [initialPath] }),
  });

  const result = render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  );

  return { ...result, actor };
}
