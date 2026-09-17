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
