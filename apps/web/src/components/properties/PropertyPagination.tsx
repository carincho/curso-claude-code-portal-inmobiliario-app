import Link from "next/link";
import type { ReactNode } from "react";
import { buildFiltersQuery, type PropertyFilters } from "@/lib/properties-client";

const SIBLING_COUNT = 3;

type PageItem = number | "ellipsis";

function pageHref(filters: PropertyFilters, page: number) {
  const query = buildFiltersQuery({ ...filters, page: page > 1 ? String(page) : undefined });
  return query ? `/properties?${query}` : "/properties";
}

function getPageItems(current: number, totalPages: number): PageItem[] {
  const start = Math.max(1, current - SIBLING_COUNT);
  const end = Math.min(totalPages, current + SIBLING_COUNT);
  const items: PageItem[] = [];

  if (start > 1) {
    items.push(1);
    if (start > 2) items.push("ellipsis");
  }

  for (let page = start; page <= end; page += 1) {
    items.push(page);
  }

  if (end < totalPages) {
    if (end < totalPages - 1) items.push("ellipsis");
    items.push(totalPages);
  }

  return items;
}

export function PropertyPagination({
  filters,
  page,
  totalPages,
}: {
  filters: PropertyFilters;
  page: number;
  totalPages: number;
}) {
  if (totalPages <= 1) {
    return null;
  }

  const isFirst = page <= 1;
  const isLast = page >= totalPages;

  return (
    <nav
      aria-label="Paginación de propiedades"
      className="mt-10 flex flex-wrap items-center justify-center gap-1"
    >
      <PaginationLink href={pageHref(filters, 1)} disabled={isFirst} label="Primera página">
        «
      </PaginationLink>
      <PaginationLink href={pageHref(filters, page - 1)} disabled={isFirst} label="Página anterior">
        ‹
      </PaginationLink>

      {getPageItems(page, totalPages).map((item, index) =>
        item === "ellipsis" ? (
          <span
            key={`ellipsis-${index}`}
            aria-hidden="true"
            className="flex h-9 min-w-9 items-center justify-center px-1 text-sm text-stone-400"
          >
            …
          </span>
        ) : (
          <PaginationLink
            key={item}
            href={pageHref(filters, item)}
            current={item === page}
            label={item === page ? `Página ${item}, actual` : `Ir a la página ${item}`}
          >
            {item}
          </PaginationLink>
        ),
      )}

      <PaginationLink href={pageHref(filters, page + 1)} disabled={isLast} label="Página siguiente">
        ›
      </PaginationLink>
      <PaginationLink href={pageHref(filters, totalPages)} disabled={isLast} label="Última página">
        »
      </PaginationLink>
    </nav>
  );
}

function PaginationLink({
  href,
  disabled,
  current,
  label,
  children,
}: {
  href: string;
  disabled?: boolean;
  current?: boolean;
  label: string;
  children: ReactNode;
}) {
  const baseClasses =
    "flex h-9 min-w-9 items-center justify-center rounded-md px-2 text-sm font-medium transition-colors";

  if (disabled) {
    return (
      <span aria-disabled="true" aria-label={label} className={`${baseClasses} text-stone-300`}>
        {children}
      </span>
    );
  }

  if (current) {
    return (
      <span aria-current="page" aria-label={label} className={`${baseClasses} bg-accent text-accent-foreground`}>
        {children}
      </span>
    );
  }

  return (
    <Link
      href={href}
      aria-label={label}
      className={`${baseClasses} border border-card-border text-stone-700 hover:bg-stone-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent`}
    >
      {children}
    </Link>
  );
}
