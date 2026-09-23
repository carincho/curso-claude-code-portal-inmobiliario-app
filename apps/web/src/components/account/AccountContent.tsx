"use client";

import type { PaginatedInquiries, PropertyListItem } from "@portal-inmobiliario/shared-types";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { useFavorites } from "@/components/favorites/FavoritesProvider";
import { PropertyGrid } from "@/components/properties/PropertyGrid";
import { formatDate } from "@/lib/format";
import { fetchFavorites } from "@/lib/favorites-client";
import { deleteInquiry, fetchMyInquiries } from "@/lib/inquiries-client";

const ROLE_LABELS = { USER: "Usuario", ADMIN: "Administrador" } as const;

function FavoritesSection({ apiUrl }: { apiUrl: string }) {
  const { favoriteIds, isLoading: favoritesLoading } = useFavorites();
  const [properties, setProperties] = useState<PropertyListItem[] | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    fetchFavorites(apiUrl)
      .then((data) => {
        if (!cancelled) {
          setProperties(data);
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
  }, [apiUrl]);

  if (error) {
    return (
      <p role="alert" className="mt-3 text-sm text-red-600">
        No se pudieron cargar tus favoritos.
      </p>
    );
  }

  if (properties === null || favoritesLoading) {
    return <p className="mt-3 text-sm text-stone-500">Cargando…</p>;
  }

  const visibleProperties = properties.filter((property) => favoriteIds.has(property.id));

  return (
    <div className="mt-3">
      <PropertyGrid
        properties={visibleProperties}
        emptyMessage="Todavía no has guardado ninguna propiedad como favorita."
      />
    </div>
  );
}

const inputClassName =
  "w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900 outline-none focus-visible:border-accent focus-visible:ring-2 focus-visible:ring-accent/20";

function InquiriesSection({ apiUrl }: { apiUrl: string }) {
  const [result, setResult] = useState<PaginatedInquiries | null>(null);
  const [error, setError] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [reloadKey, setReloadKey] = useState(0);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, 300);
    return () => clearTimeout(timeout);
  }, [searchInput]);

  useEffect(() => {
    let cancelled = false;

    fetchMyInquiries(apiUrl, { search: search || undefined, page })
      .then((data) => {
        if (!cancelled) {
          setResult(data);
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
  }, [apiUrl, search, page, reloadKey]);

  async function handleDelete(inquiryId: string) {
    if (!window.confirm("¿Eliminar esta consulta? Esta acción no se puede deshacer.")) {
      return;
    }

    setDeletingId(inquiryId);

    try {
      await deleteInquiry(apiUrl, inquiryId);

      const isLastItemOnPage = result?.items.length === 1 && page > 1;
      if (isLastItemOnPage) {
        setPage((current) => current - 1);
      } else {
        setReloadKey((key) => key + 1);
      }
    } catch {
      window.alert("No se pudo eliminar la consulta. Inténtalo nuevamente.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="mt-3">
      <label htmlFor="inquiries-search" className="sr-only">
        Buscar en mis consultas
      </label>
      <input
        id="inquiries-search"
        type="search"
        value={searchInput}
        onChange={(event) => setSearchInput(event.target.value)}
        placeholder="Buscar por título de propiedad o mensaje…"
        className={inputClassName}
      />

      <div className="mt-3">
        {error && (
          <p role="alert" className="text-sm text-red-600">
            No se pudieron cargar tus consultas.
          </p>
        )}

        {!error && result === null && <p className="text-sm text-stone-500">Cargando…</p>}

        {!error && result !== null && result.items.length === 0 && (
          <div className="rounded-lg border border-dashed border-card-border bg-card p-6 text-center text-sm text-stone-600">
            {search
              ? "No encontramos consultas que coincidan con tu búsqueda."
              : "Todavía no has enviado consultas sobre ninguna propiedad."}
          </div>
        )}

        {!error && result !== null && result.items.length > 0 && (
          <ul className="flex flex-col gap-3">
            {result.items.map((inquiry) => (
              <li
                key={inquiry.id}
                className="flex items-start gap-4 rounded-lg border border-card-border bg-card p-4"
              >
                <Link
                  href={`/properties/${inquiry.property.id}`}
                  className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md bg-stone-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                  {inquiry.property.mainImage ? (
                    <Image
                      src={inquiry.property.mainImage.url}
                      alt={inquiry.property.title}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-[10px] text-stone-400">
                      Sin imagen
                    </div>
                  )}
                </Link>

                <div className="min-w-0 flex-1">
                  <Link
                    href={`/properties/${inquiry.property.id}`}
                    className="font-medium text-stone-900 hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                  >
                    {inquiry.property.title}
                  </Link>
                  <p className="mt-0.5 text-xs text-stone-500">
                    {inquiry.email} · Consultado el {formatDate(inquiry.createdAt)}
                  </p>
                  <p className="mt-1.5 line-clamp-2 text-sm text-stone-600">{inquiry.message}</p>
                </div>

                <button
                  type="button"
                  onClick={() => handleDelete(inquiry.id)}
                  disabled={deletingId === inquiry.id}
                  aria-label={`Eliminar consulta sobre ${inquiry.property.title}`}
                  className="shrink-0 rounded-lg border border-stone-300 px-3 py-1.5 text-xs font-medium text-stone-600 transition-colors hover:border-red-400 hover:text-red-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:opacity-50"
                >
                  {deletingId === inquiry.id ? "Eliminando…" : "Eliminar"}
                </button>
              </li>
            ))}
          </ul>
        )}

        {!error && result !== null && result.totalPages > 1 && (
          <div className="mt-4 flex items-center justify-between text-sm text-stone-600">
            <button
              type="button"
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              disabled={page <= 1}
              className="rounded-lg border border-stone-300 px-3 py-1.5 font-medium transition-colors hover:border-accent hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-not-allowed disabled:opacity-50"
            >
              Anterior
            </button>
            <span>
              Página {result.page} de {result.totalPages}
            </span>
            <button
              type="button"
              onClick={() => setPage((current) => Math.min(result.totalPages, current + 1))}
              disabled={page >= result.totalPages}
              className="rounded-lg border border-stone-300 px-3 py-1.5 font-medium transition-colors hover:border-accent hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-not-allowed disabled:opacity-50"
            >
              Siguiente
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export function AccountContent() {
  const { user, apiUrl } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <div className="flex flex-col gap-10">
      <section>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-stone-900">Mi cuenta</h1>
          <Link
            href="/account/edit"
            className="rounded-lg border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700 transition-colors hover:border-accent hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            Editar cuenta
          </Link>
        </div>
        <dl className="mt-4 grid grid-cols-1 gap-4 rounded-lg border border-card-border bg-card p-6 sm:grid-cols-2">
          <div>
            <dt className="text-xs uppercase tracking-wide text-stone-500">Nombre</dt>
            <dd className="mt-1 text-sm font-medium text-stone-900">{user.name}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-stone-500">Email</dt>
            <dd className="mt-1 text-sm font-medium text-stone-900">{user.email}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-stone-500">Rol</dt>
            <dd className="mt-1 text-sm font-medium text-stone-900">
              {ROLE_LABELS[user.role]}
            </dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-stone-500">Miembro desde</dt>
            <dd className="mt-1 text-sm font-medium text-stone-900">
              {formatDate(user.createdAt)}
            </dd>
          </div>
        </dl>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-stone-900">Propiedades interesadas</h2>
        <FavoritesSection apiUrl={apiUrl} />
      </section>

      <section>
        <h2 className="text-lg font-semibold text-stone-900">Propiedades consultadas</h2>
        <InquiriesSection apiUrl={apiUrl} />
      </section>
    </div>
  );
}
