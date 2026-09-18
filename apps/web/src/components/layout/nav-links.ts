export type NavLink = {
  href: string;
  label: string;
};

export const NAV_LINKS: NavLink[] = [
  { href: "/", label: "Inicio" },
  { href: "/properties", label: "Propiedades" },
  { href: "/properties?operation=SALE", label: "Comprar" },
  { href: "/properties?operation=RENT", label: "Arrendar" },
];

/**
 * Un link está activo si coincide el pathname y, cuando el link define query
 * params (ej. ?operation=SALE), también coinciden esos params exactamente —
 * así "Propiedades" no queda marcado activo cuando en realidad estás en "Comprar".
 */
export function isNavLinkActive(
  href: string,
  pathname: string,
  searchParams: URLSearchParams,
): boolean {
  const [linkPath, linkQuery] = href.split("?");

  if (pathname !== linkPath) {
    return false;
  }

  if (!linkQuery) {
    return !searchParams.get("operation");
  }

  const linkParams = new URLSearchParams(linkQuery);
  return [...linkParams.entries()].every(([key, value]) => searchParams.get(key) === value);
}
