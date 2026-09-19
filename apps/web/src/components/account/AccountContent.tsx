"use client";

import type { InquiryWithPropertyDTO, PropertyListItem } from "@portal-inmobiliario/shared-types";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { useFavorites } from "@/components/favorites/FavoritesProvider";
import { PropertyGrid } from "@/components/properties/PropertyGrid";
import { formatDate } from "@/lib/format";
import { fetchFavorites } from "@/lib/favorites-client";
import { fetchMyInquiries } from "@/lib/inquiries-client";

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
    return <p className="mt-3 text-sm text-red-600">No se pudieron cargar tus favoritos.</p>;
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

function InquiriesSection({ apiUrl }: { apiUrl: string }) {
  const [inquiries, setInquiries] = useState<InquiryWithPropertyDTO[] | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    fetchMyInquiries(apiUrl)
      .then((data) => {
        if (!cancelled) {
          setInquiries(data);
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
    return <p className="mt-3 text-sm text-red-600">No se pudieron cargar tus consultas.</p>;
  }

  if (inquiries === null) {
    return <p className="mt-3 text-sm text-stone-500">Cargando…</p>;
  }

  if (inquiries.length === 0) {
    return (
      <div className="mt-3 rounded-lg border border-dashed border-card-border bg-card p-6 text-center text-sm text-stone-600">
        Todavía no has enviado consultas sobre ninguna propiedad.
      </div>
    );
  }

  return (
    <ul className="mt-3 flex flex-col gap-3">
      {inquiries.map((inquiry) => (
        <li key={inquiry.id} className="rounded-lg border border-card-border bg-card p-4">
          <Link
            href={`/properties/${inquiry.property.id}`}
            className="font-medium text-stone-900 hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            {inquiry.property.title}
          </Link>
          <p className="mt-1 text-xs text-stone-500">
            Consultado el {formatDate(inquiry.createdAt)}
          </p>
          <p className="mt-2 text-sm text-stone-600">{inquiry.message}</p>
        </li>
      ))}
    </ul>
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
