"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useSyncExternalStore, type ReactNode } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { BrandIcon } from "@/components/layout/BrandIcon";
import { cn } from "@/lib/cn";

type AdminTheme = "light" | "dark";

const ADMIN_THEME_STORAGE_KEY = "admin-theme";
const adminThemeListeners = new Set<() => void>();

function readAdminTheme(): AdminTheme {
  try {
    return window.localStorage.getItem(ADMIN_THEME_STORAGE_KEY) === "dark" ? "dark" : "light";
  } catch {
    return "light";
  }
}

function subscribeAdminTheme(listener: () => void) {
  adminThemeListeners.add(listener);
  return () => adminThemeListeners.delete(listener);
}

function writeAdminTheme(theme: AdminTheme) {
  try {
    window.localStorage.setItem(ADMIN_THEME_STORAGE_KEY, theme);
  } catch {
    // localStorage no disponible (modo privado, etc.): el cambio solo dura la sesión actual.
  }
  adminThemeListeners.forEach((listener) => listener());
}

// El servidor no conoce la preferencia guardada en localStorage, así que la primera
// hidratación siempre asume tema claro; useSyncExternalStore corrige al valor real
// del cliente justo después, sin generar un mismatch de hidratación.
function useAdminTheme() {
  const theme = useSyncExternalStore(subscribeAdminTheme, readAdminTheme, () => "light" as const);

  function toggleTheme() {
    writeAdminTheme(theme === "light" ? "dark" : "light");
  }

  return { theme, toggleTheme };
}

type NavItem = {
  href: string;
  label: string;
  icon: ReactNode;
  enabled: boolean;
};

function DashboardIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5h6.75V4.5h-6.75v9Zm0 6h6.75v-3.75h-6.75V19.5Zm9.75 0h6.75V10.5h-6.75V19.5Zm0-15v3.75h6.75V4.5h-6.75Z" />
    </svg>
  );
}

function BuildingIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 21V6.75a1.5 1.5 0 0 1 1.5-1.5h6a1.5 1.5 0 0 1 1.5 1.5V21M4.5 21h15M13.5 21v-6a1.5 1.5 0 0 1 1.5-1.5h3a1.5 1.5 0 0 1 1.5 1.5v6M7.5 8.25h.008M7.5 11.25h.008M7.5 14.25h.008M10.5 8.25h.008M10.5 11.25h.008M10.5 14.25h.008" />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.5v-1.5a3.75 3.75 0 0 0-3.75-3.75h-4.5A3.75 3.75 0 0 0 3 18v1.5M16.5 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM21 19.5v-1.5a3.75 3.75 0 0 0-2.625-3.578M15.375 4.578a3 3 0 0 1 0 5.845" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75A2.25 2.25 0 0 1 4.5 4.5h15a2.25 2.25 0 0 1 2.25 2.25v10.5A2.25 2.25 0 0 1 19.5 19.5h-15a2.25 2.25 0 0 1-2.25-2.25V6.75Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="m3 6.75 9 6.75 9-6.75" />
    </svg>
  );
}

function TagIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.169.659 1.591l9.581 9.581a2.25 2.25 0 0 0 3.182 0l4.318-4.318a2.25 2.25 0 0 0 0-3.182L11.16 3.659A2.25 2.25 0 0 0 9.568 3Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.375 7.5a.375.375 0 1 1 0-.75.375.375 0 0 1 0 .75Z" />
    </svg>
  );
}

function ChevronIcon({ collapsed }: { collapsed: boolean }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={cn("h-5 w-5 shrink-0 transition-transform", collapsed && "rotate-180")}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5" />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25M12 18.75V21M4.219 4.219l1.591 1.591M18.19 18.19l1.591 1.591M3 12h2.25M18.75 12H21M4.219 19.781l1.591-1.591M18.19 5.81l1.591-1.591M16.5 12a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Z" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
    </svg>
  );
}

const NAV_ITEMS: NavItem[] = [
  { href: "/admin", label: "Dashboard", icon: <DashboardIcon />, enabled: true },
  { href: "/admin/properties", label: "Propiedades", icon: <BuildingIcon />, enabled: true },
  { href: "/admin/features", label: "Características", icon: <TagIcon />, enabled: true },
  { href: "/admin/users", label: "Usuarios", icon: <UsersIcon />, enabled: true },
  { href: "/admin/inquiries", label: "Consultas", icon: <MailIcon />, enabled: true },
];

function isActivePath(href: string, pathname: string | null) {
  if (!pathname) {
    return false;
  }

  return href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
}

export function AdminShell({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useAdminTheme();

  return (
    <div className="flex min-h-screen bg-background" data-admin-theme={theme}>
      {mobileOpen && (
        <button
          type="button"
          aria-label="Cerrar menú"
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 -translate-x-full flex-col border-r border-sidebar-border bg-sidebar text-sidebar-text transition-transform duration-200 md:sticky md:top-0 md:h-screen md:translate-x-0 md:self-start",
          mobileOpen && "translate-x-0",
          collapsed && "md:w-[72px]",
        )}
      >
        <div className="flex h-16 items-center gap-2.5 border-b border-sidebar-border px-4">
          <BrandIcon />
          {!collapsed && (
            <span className="truncate text-sm font-semibold tracking-tight text-sidebar-text">
              Panel de administración
            </span>
          )}
        </div>

        <div className="border-b border-sidebar-border p-3">
          <button
            type="button"
            onClick={() => setCollapsed((value) => !value)}
            aria-label={collapsed ? "Expandir menú" : "Colapsar menú"}
            className="hidden w-full items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-sidebar-text-muted transition-colors hover:bg-sidebar-hover hover:text-sidebar-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent md:flex"
          >
            <ChevronIcon collapsed={collapsed} />
            {!collapsed && "Colapsar menú"}
          </button>
        </div>

        <nav aria-label="Navegación de administración" className="flex-1 overflow-y-auto py-4">
          <ul className="flex flex-col gap-1 px-3">
            {NAV_ITEMS.map((item) => {
              if (!item.enabled) {
                return (
                  <li key={item.href}>
                    <span
                      aria-disabled="true"
                      title="Próximamente"
                      className={cn(
                        "flex cursor-not-allowed items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-text-muted/60",
                        collapsed && "justify-center",
                      )}
                    >
                      {item.icon}
                      {!collapsed && (
                        <span className="flex flex-1 items-center justify-between">
                          {item.label}
                          <span className="rounded-full bg-sidebar-hover px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide">
                            Próx.
                          </span>
                        </span>
                      )}
                    </span>
                  </li>
                );
              }

              const active = isActivePath(item.href, pathname);

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    aria-current={active ? "page" : undefined}
                    title={collapsed ? item.label : undefined}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
                      collapsed && "justify-center",
                      active
                        ? "bg-accent text-accent-foreground"
                        : "text-sidebar-text hover:bg-sidebar-hover",
                    )}
                  >
                    {item.icon}
                    {!collapsed && item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>

      <div className="flex min-h-screen min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-card-border bg-card px-4 sm:px-6">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            aria-label="Abrir menú de administración"
            className="inline-flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground hover:bg-foreground/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent md:hidden"
          >
            <MenuIcon />
          </button>

          <Link
            href="/"
            className="text-sm text-muted-foreground hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            ← Ver sitio público
          </Link>

          <div className="ml-auto flex items-center gap-3">
            <button
              type="button"
              onClick={toggleTheme}
              aria-pressed={theme === "dark"}
              aria-label={theme === "dark" ? "Cambiar a tema claro" : "Cambiar a tema oscuro"}
              title={theme === "dark" ? "Cambiar a tema claro" : "Cambiar a tema oscuro"}
              className="inline-flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-foreground/10 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              {theme === "dark" ? <SunIcon /> : <MoonIcon />}
            </button>
            <span className="hidden text-sm text-muted-foreground sm:inline">{user?.name}</span>
            <button
              type="button"
              onClick={() => logout()}
              className="inline-flex items-center gap-1.5 rounded-lg border border-card-border px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:border-accent hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              <LogoutIcon />
              Salir
            </button>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
