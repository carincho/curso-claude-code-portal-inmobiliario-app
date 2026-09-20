"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { useFavorites } from "@/components/favorites/FavoritesProvider";
import { cn } from "@/lib/cn";
import { BrandIcon } from "./BrandIcon";
import { isNavLinkActive, NAV_LINKS } from "./nav-links";

function FavoritesLink({ count, className }: { count: number; className?: string }) {
  return (
    <Link
      href="/account"
      aria-label={`Favoritos: ${count} ${count === 1 ? "propiedad" : "propiedades"}`}
      className={cn(
        "relative inline-flex h-9 w-9 items-center justify-center rounded-full text-header-text/80 transition-colors hover:text-header-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-header-text",
        className,
      )}
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 20.25c-.3 0-.6-.09-.85-.28C7.29 17.1 3.75 14 3.75 9.94 3.75 7.2 5.93 5 8.63 5c1.4 0 2.74.63 3.62 1.68A4.83 4.83 0 0 1 15.87 5c2.7 0 4.88 2.2 4.88 4.94 0 4.06-3.54 7.16-7.4 10.03-.25.19-.55.28-.85.28Z"
        />
      </svg>
      {count > 0 && (
        <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-semibold leading-none text-accent-foreground">
          {count}
        </span>
      )}
    </Link>
  );
}

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { user, isLoading, logout } = useAuth();
  const { favoriteIds } = useFavorites();

  useEffect(() => {
    function handleScroll() {
      setIsScrolled(window.scrollY > 24);
    }

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b transition-colors duration-300",
        isScrolled
          ? "border-white/10 bg-header/85 backdrop-blur-md supports-[backdrop-filter]:bg-header/70"
          : "border-transparent bg-header",
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex items-center gap-2.5 text-lg font-semibold tracking-tight text-header-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-header-text"
        >
          <BrandIcon />
          Portal Inmobiliario
        </Link>

        <nav aria-label="Navegación principal" className="hidden md:block">
          <ul className="flex items-center gap-6">
            {NAV_LINKS.map((link) => {
              const isActive = isNavLinkActive(link.href, pathname, searchParams);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={isActive ? "page" : undefined}
                    className={cn(
                      "text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-header-text",
                      isActive
                        ? "font-semibold text-white"
                        : "text-header-text/80 hover:text-header-text",
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {!isLoading &&
            (user ? (
              user.role === "ADMIN" ? (
                <>
                  <Link
                    href="/admin"
                    className="text-sm text-header-text/80 hover:text-header-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-header-text"
                  >
                    Panel de administración
                  </Link>
                  <button
                    type="button"
                    onClick={() => logout()}
                    className="rounded-full border border-white/20 px-4 py-2 text-sm font-medium text-header-text transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-header-text"
                  >
                    Salir
                  </button>
                </>
              ) : (
                <>
                  <FavoritesLink count={favoriteIds.size} />
                  <Link
                    href="/account"
                    className="text-sm text-header-text/80 hover:text-header-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-header-text"
                  >
                    Hola, {user.name}
                  </Link>
                  <button
                    type="button"
                    onClick={() => logout()}
                    className="rounded-full border border-white/20 px-4 py-2 text-sm font-medium text-header-text transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-header-text"
                  >
                    Salir
                  </button>
                </>
              )
            ) : (
              <Link
                href="/login"
                className="rounded-full bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-header-text"
              >
                Ingresar
              </Link>
            ))}
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-md p-2 text-header-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-header-text md:hidden"
          aria-expanded={isMenuOpen}
          aria-controls="mobile-menu"
          onClick={() => setIsMenuOpen((open) => !open)}
        >
          <span className="sr-only">
            {isMenuOpen ? "Cerrar menú" : "Abrir menú"}
          </span>
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.8}
          >
            {isMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18 18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5"
              />
            )}
          </svg>
        </button>
      </div>

      <nav
        id="mobile-menu"
        aria-label="Navegación móvil"
        className={cn(
          "border-t border-white/10 md:hidden",
          isMenuOpen ? "block" : "hidden",
        )}
      >
        <ul className="flex flex-col gap-1 px-4 py-3 sm:px-6">
          {NAV_LINKS.map((link) => {
            const isActive = isNavLinkActive(link.href, pathname, searchParams);
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "block rounded-md px-3 py-2 text-base font-medium",
                    isActive
                      ? "bg-white/10 text-white"
                      : "text-header-text/80 hover:bg-white/10 hover:text-header-text",
                  )}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
          {!isLoading &&
            (user ? (
              user.role === "ADMIN" ? (
                <>
                  <li>
                    <Link
                      href="/admin"
                      className="block rounded-md px-3 py-2 text-base font-medium text-header-text hover:bg-white/10"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Panel de administración
                    </Link>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => {
                        setIsMenuOpen(false);
                        void logout();
                      }}
                      className="block w-full rounded-md px-3 py-2 text-left text-base font-medium text-header-text hover:bg-white/10"
                    >
                      Salir
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link
                      href="/account"
                      className="block rounded-md px-3 py-2 text-base font-medium text-header-text hover:bg-white/10"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Mi cuenta ({user.name})
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/account"
                      className="block rounded-md px-3 py-2 text-base font-medium text-header-text hover:bg-white/10"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Favoritos ({favoriteIds.size})
                    </Link>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => {
                        setIsMenuOpen(false);
                        void logout();
                      }}
                      className="block w-full rounded-md px-3 py-2 text-left text-base font-medium text-header-text hover:bg-white/10"
                    >
                      Salir
                    </button>
                  </li>
                </>
              )
            ) : (
              <li>
                <Link
                  href="/login"
                  className="block rounded-md px-3 py-2 text-base font-medium text-header-text hover:bg-white/10"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Ingresar
                </Link>
              </li>
            ))}
        </ul>
      </nav>
    </header>
  );
}
