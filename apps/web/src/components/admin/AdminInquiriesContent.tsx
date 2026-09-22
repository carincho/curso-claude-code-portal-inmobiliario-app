"use client";

import type { AdminInquiryDTO } from "@portal-inmobiliario/shared-types";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { fetchAdminInquiries } from "@/lib/admin-inquiries-client";
import { formatDate } from "@/lib/format";

const inputClassName =
  "w-full max-w-sm rounded-lg border border-card-border bg-card px-3 py-2 text-sm text-foreground outline-none focus-visible:border-accent focus-visible:ring-2 focus-visible:ring-accent/20";

export function AdminInquiriesContent() {
  const { apiUrl } = useAuth();
  const [inquiries, setInquiries] = useState<AdminInquiryDTO[] | null>(null);
  const [error, setError] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");

  useEffect(() => {
    const timeout = setTimeout(() => {
      setAppliedSearch(searchInput.trim());
    }, 300);

    return () => clearTimeout(timeout);
  }, [searchInput]);

  useEffect(() => {
    let cancelled = false;

    fetchAdminInquiries(apiUrl, { search: appliedSearch || undefined })
      .then((data) => {
        if (!cancelled) {
          setInquiries(data);
          setError(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError(true);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [apiUrl, appliedSearch]);

  return (
    <div>
      <h1 className="text-2xl font-semibold text-foreground">Consultas</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Solicitudes de información enviadas por visitantes y usuarios registrados.
      </p>

      <div className="mt-6">
        <label htmlFor="inquiries-search" className="sr-only">
          Buscar consultas
        </label>
        <input
          id="inquiries-search"
          type="search"
          value={searchInput}
          onChange={(event) => setSearchInput(event.target.value)}
          placeholder="Buscar por nombre, email, mensaje o propiedad…"
          className={inputClassName}
        />
      </div>

      <div className="mt-6">
        {error && <p className="text-sm text-red-600">No se pudieron cargar las consultas.</p>}

        {!error && inquiries === null && (
          <p className="text-sm text-muted-foreground">Cargando…</p>
        )}

        {!error && inquiries !== null && inquiries.length === 0 && (
          <div className="rounded-lg border border-dashed border-card-border bg-card p-6 text-center text-sm text-muted-foreground">
            {appliedSearch
              ? "No encontramos consultas que coincidan con tu búsqueda."
              : "Todavía no hay consultas registradas."}
          </div>
        )}

        {!error && inquiries !== null && inquiries.length > 0 && (
          <ul className="flex flex-col gap-3">
            {inquiries.map((inquiry) => (
              <li
                key={inquiry.id}
                className="flex flex-col gap-4 rounded-lg border border-card-border bg-card p-4 sm:flex-row"
              >
                <Link
                  href={`/admin/properties/${inquiry.property.id}/edit`}
                  className="relative h-16 w-24 shrink-0 overflow-hidden rounded-md bg-background"
                >
                  {inquiry.property.mainImage ? (
                    <Image
                      src={inquiry.property.mainImage.url}
                      alt={inquiry.property.title}
                      fill
                      sizes="96px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-[10px] text-muted-foreground">
                      Sin imagen
                    </div>
                  )}
                </Link>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-medium text-foreground">{inquiry.name}</p>
                    {inquiry.user ? (
                      <span className="rounded-full bg-accent-soft px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-accent-hover">
                        Usuario registrado
                      </span>
                    ) : (
                      <span className="rounded-full bg-stone-200 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-stone-600">
                        Visitante
                      </span>
                    )}
                  </div>

                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {inquiry.email} · {inquiry.phone}
                  </p>
                  {inquiry.user && (
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      Cuenta: {inquiry.user.name} ({inquiry.user.email})
                    </p>
                  )}

                  <p className="mt-2 text-sm text-foreground">{inquiry.message}</p>

                  <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    <span>Consultó el {formatDate(inquiry.createdAt)}</span>
                    <span>·</span>
                    <Link
                      href={`/admin/properties/${inquiry.property.id}/edit`}
                      className="font-medium text-accent transition-colors hover:text-accent-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                    >
                      Ver propiedad: {inquiry.property.title}
                    </Link>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
