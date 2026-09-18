import Link from "next/link";
import { BrandIcon } from "./BrandIcon";
import { NAV_LINKS } from "./nav-links";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-footer">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
        <div>
          <div className="flex items-center gap-2.5">
            <BrandIcon />
            <p className="text-lg font-semibold text-white">Portal Inmobiliario</p>
          </div>
          <p className="mt-2 text-sm text-footer-text">
            Encuentra propiedades en venta y arriendo en México.
          </p>
        </div>

        <nav aria-label="Navegación de pie de página">
          <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-footer-text transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/login"
                className="text-footer-text transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Ingresar
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      <div className="border-t border-white/10 px-4 py-4 text-center text-xs text-footer-text-muted sm:px-6 lg:px-8">
        © {year} Portal Inmobiliario. Todos los derechos reservados.
      </div>
    </footer>
  );
}
