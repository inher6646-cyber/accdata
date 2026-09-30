import { cn } from "@/lib/utils";
import type { NavItem } from "@/types";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  ArrowDownUp,
  LayoutDashboard,
  Package,
  Receipt,
  Wallet,
} from "lucide-react";
import type { ReactNode } from "react";

const NAV_ITEMS: NavItem[] = [
  {
    to: "/",
    label: "Dashboard",
    description: "Ringkasan bisnis",
    icon: "dashboard",
  },
  {
    to: "/produk",
    label: "Produk",
    description: "Katalog & stok",
    icon: "produk",
  },
  {
    to: "/transaksi",
    label: "Transaksi",
    description: "Pesanan penjualan",
    icon: "transaksi",
  },
  {
    to: "/restock",
    label: "Restock",
    description: "Pembelian stok",
    icon: "restock",
  },
  {
    to: "/kas",
    label: "Kas",
    description: "Buku kas",
    icon: "kas",
  },
];

const ICONS = {
  dashboard: LayoutDashboard,
  produk: Package,
  transaksi: Receipt,
  restock: ArrowDownUp,
  kas: Wallet,
} as const;

function isActivePath(pathname: string, to: string): boolean {
  if (to === "/") return pathname === "/";
  return pathname === to || pathname.startsWith(`${to}/`);
}

function BrandMark() {
  return (
    <Link
      to="/"
      data-ocid="nav.brand_link"
      className="flex items-center gap-2.5 rounded-md outline-none transition-fast focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-sidebar"
    >
      <span className="grid size-9 shrink-0 place-items-center rounded-lg gradient-primary text-primary-foreground shadow-subtle">
        <Wallet className="size-5" aria-hidden="true" />
      </span>
      <span className="flex min-w-0 flex-col leading-tight">
        <span className="truncate font-display text-sm font-bold tracking-tight text-sidebar-foreground">
          Bisnis Online
        </span>
        <span className="truncate text-[11px] font-medium text-muted-foreground">
          Buku usaha harian
        </span>
      </span>
    </Link>
  );
}

function DesktopNav({ pathname }: { pathname: string }) {
  return (
    <nav aria-label="Navigasi utama" className="flex flex-col gap-1">
      {NAV_ITEMS.map((item) => {
        const Icon = ICONS[item.icon];
        const active = isActivePath(pathname, item.to);
        return (
          <Link
            key={item.to}
            to={item.to}
            data-ocid={`nav.${item.icon}_link`}
            aria-current={active ? "page" : undefined}
            className={cn(
              "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium outline-none transition-fast",
              "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-sidebar",
              active
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-foreground",
            )}
          >
            <span
              aria-hidden="true"
              className={cn(
                "absolute inset-y-1.5 left-0 w-0.5 rounded-full bg-primary transition-fast",
                active ? "opacity-100" : "opacity-0",
              )}
            />
            <Icon
              className={cn(
                "size-[18px] shrink-0 transition-fast",
                active
                  ? "text-primary"
                  : "text-muted-foreground group-hover:text-sidebar-foreground",
              )}
              aria-hidden="true"
            />
            <span className="flex min-w-0 flex-col">
              <span className="truncate">{item.label}</span>
              <span className="truncate text-[11px] font-normal text-muted-foreground">
                {item.description}
              </span>
            </span>
          </Link>
        );
      })}
    </nav>
  );
}

function MobileNav({ pathname }: { pathname: string }) {
  return (
    <nav
      aria-label="Navigasi utama"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-sidebar-border bg-sidebar/95 backdrop-blur supports-[backdrop-filter]:bg-sidebar/85 md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <ul className="grid grid-cols-5">
        {NAV_ITEMS.map((item) => {
          const Icon = ICONS[item.icon];
          const active = isActivePath(pathname, item.to);
          return (
            <li key={item.to} className="min-w-0">
              <Link
                to={item.to}
                data-ocid={`nav.${item.icon}_link`}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex min-h-[56px] flex-col items-center justify-center gap-1 px-1 py-2 text-[11px] font-medium outline-none transition-fast",
                  "focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring",
                  active ? "text-primary" : "text-muted-foreground",
                )}
              >
                <Icon className="size-5 shrink-0" aria-hidden="true" />
                <span className="w-full truncate text-center">
                  {item.label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export function Layout({ children }: { children: ReactNode }) {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });
  const year = new Date().getFullYear();

  return (
    <div className="min-h-dvh bg-background">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-sidebar-border bg-sidebar md:flex">
        <div className="flex h-16 items-center border-b border-sidebar-border px-4">
          <BrandMark />
        </div>
        <div className="flex-1 overflow-y-auto px-3 py-4">
          <DesktopNav pathname={pathname} />
        </div>
        <div className="border-t border-sidebar-border px-4 py-3">
          <p className="text-[11px] leading-relaxed text-muted-foreground">
            Data tersimpan otomatis di backend.
          </p>
        </div>
      </aside>

      {/* Mobile top bar */}
      <header className="sticky top-0 z-30 flex h-14 items-center border-b border-sidebar-border bg-sidebar/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-sidebar/85 md:hidden">
        <BrandMark />
      </header>

      <div className="md:pl-64">
        <main className="mx-auto w-full max-w-6xl px-4 pb-24 pt-5 md:px-8 md:pb-12 md:pt-8">
          {children}
        </main>
        <footer className="mx-auto w-full max-w-6xl px-4 pb-24 md:px-8 md:pb-8">
          <p className="border-t border-border pt-4 text-center text-xs text-muted-foreground">
            © {year}. Built with love using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noreferrer"
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </footer>
      </div>

      <MobileNav pathname={pathname} />
    </div>
  );
}
