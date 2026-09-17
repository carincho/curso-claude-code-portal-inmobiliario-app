import Link from "next/link";
import { NAV_LINKS } from "./nav-links";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
        <div>
          <p className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            Portal Inmobiliario
          </p>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Encuentra propiedades en venta y arriendo en México.
          </p>
        </div>

        <nav aria-label="Navegación de pie de página">
          <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-zinc-600 transition-colors hover:text-zinc-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/login"
                className="text-zinc-600 transition-colors hover:text-zinc-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
              >
                Ingresar
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      <div className="border-t border-zinc-200 px-4 py-4 text-center text-xs text-zinc-500 sm:px-6 lg:px-8 dark:border-zinc-800 dark:text-zinc-500">
        © {year} Portal Inmobiliario. Todos los derechos reservados.
      </div>
    </footer>
  );
}
