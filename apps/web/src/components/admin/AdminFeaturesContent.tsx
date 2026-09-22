"use client";

import type { FeatureDTO } from "@portal-inmobiliario/shared-types";
import { useEffect, useState, type FormEvent } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import {
  createFeature,
  deleteFeature,
  fetchFeatures,
  renameFeature,
} from "@/lib/admin-features-client";

const inputClassName =
  "w-full rounded-lg border border-card-border bg-card px-3 py-2 text-sm text-foreground outline-none focus-visible:border-accent focus-visible:ring-2 focus-visible:ring-accent/20";

export function AdminFeaturesContent() {
  const { apiUrl } = useAuth();
  const [features, setFeatures] = useState<FeatureDTO[] | null>(null);
  const [error, setError] = useState(false);

  const [newName, setNewName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState("");
  const [editError, setEditError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetchFeatures(apiUrl)
      .then((data) => {
        if (!cancelled) {
          setFeatures(data);
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
  }, [apiUrl]);

  async function handleCreate(event: FormEvent) {
    event.preventDefault();

    const name = newName.trim();
    if (!name) {
      return;
    }

    setCreateError(null);
    setIsCreating(true);

    try {
      const created = await createFeature(apiUrl, name);
      setFeatures((prev) => [...(prev ?? []), created].sort((a, b) => a.name.localeCompare(b.name)));
      setNewName("");
    } catch (createErr) {
      setCreateError(
        createErr instanceof Error ? createErr.message : "No se pudo crear la característica",
      );
    } finally {
      setIsCreating(false);
    }
  }

  function startEditing(feature: FeatureDTO) {
    setEditingId(feature.id);
    setEditingValue(feature.name);
    setEditError(null);
  }

  function cancelEditing() {
    setEditingId(null);
    setEditingValue("");
    setEditError(null);
  }

  async function handleRename(feature: FeatureDTO) {
    const name = editingValue.trim();

    if (!name || name === feature.name) {
      cancelEditing();
      return;
    }

    setBusyId(feature.id);
    setEditError(null);

    try {
      const updated = await renameFeature(apiUrl, feature.id, name);
      setFeatures((prev) =>
        (prev ?? [])
          .map((item) => (item.id === feature.id ? updated : item))
          .sort((a, b) => a.name.localeCompare(b.name)),
      );
      cancelEditing();
    } catch (renameErr) {
      setEditError(
        renameErr instanceof Error ? renameErr.message : "No se pudo renombrar la característica",
      );
    } finally {
      setBusyId(null);
    }
  }

  async function handleDelete(feature: FeatureDTO) {
    const message =
      feature.propertiesCount > 0
        ? `"${feature.name}" está en uso en ${feature.propertiesCount} ${
            feature.propertiesCount === 1 ? "propiedad" : "propiedades"
          }. Si la eliminas, se quitará de todas ellas. ¿Continuar?`
        : `¿Eliminar "${feature.name}"? Esta acción no se puede deshacer.`;

    if (!window.confirm(message)) {
      return;
    }

    setBusyId(feature.id);

    try {
      await deleteFeature(apiUrl, feature.id);
      setFeatures((prev) => (prev ?? []).filter((item) => item.id !== feature.id));
    } catch (deleteErr) {
      window.alert(
        deleteErr instanceof Error ? deleteErr.message : "No se pudo eliminar la característica",
      );
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-foreground">Características</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Administra el catálogo de amenities y características disponibles para las propiedades.
      </p>

      <form onSubmit={handleCreate} className="mt-6 flex items-start gap-3">
        <div className="flex-1">
          <label htmlFor="new-feature-name" className="sr-only">
            Nueva característica
          </label>
          <input
            id="new-feature-name"
            type="text"
            value={newName}
            onChange={(event) => setNewName(event.target.value)}
            placeholder="Ej: Terraza, Piscina…"
            className={inputClassName}
          />
          {createError && <p className="mt-1 text-xs text-red-600">{createError}</p>}
        </div>
        <button
          type="submit"
          disabled={isCreating || newName.trim() === ""}
          className="shrink-0 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isCreating ? "Agregando…" : "Agregar"}
        </button>
      </form>

      <div className="mt-6">
        {error && (
          <p className="text-sm text-red-600">No se pudieron cargar las características.</p>
        )}

        {!error && features === null && (
          <p className="text-sm text-muted-foreground">Cargando…</p>
        )}

        {!error && features !== null && features.length === 0 && (
          <div className="rounded-lg border border-dashed border-card-border bg-card p-6 text-center text-sm text-muted-foreground">
            Todavía no hay características registradas.
          </div>
        )}

        {!error && features !== null && features.length > 0 && (
          <ul className="flex flex-col gap-2">
            {features.map((feature) => (
              <li
                key={feature.id}
                className="flex items-center gap-3 rounded-lg border border-card-border bg-card p-3"
              >
                {editingId === feature.id ? (
                  <div className="flex flex-1 items-center gap-2">
                    <input
                      type="text"
                      value={editingValue}
                      onChange={(event) => setEditingValue(event.target.value)}
                      autoFocus
                      className={inputClassName}
                    />
                    <button
                      type="button"
                      onClick={() => handleRename(feature)}
                      disabled={busyId === feature.id}
                      className="shrink-0 rounded-lg bg-accent px-3 py-1.5 text-xs font-medium text-accent-foreground transition-colors hover:bg-accent-hover disabled:opacity-50"
                    >
                      Guardar
                    </button>
                    <button
                      type="button"
                      onClick={cancelEditing}
                      disabled={busyId === feature.id}
                      className="shrink-0 rounded-lg border border-card-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-accent hover:text-accent disabled:opacity-50"
                    >
                      Cancelar
                    </button>
                    {editError && <p className="text-xs text-red-600">{editError}</p>}
                  </div>
                ) : (
                  <>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-foreground">
                        {feature.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {feature.propertiesCount}{" "}
                        {feature.propertiesCount === 1 ? "propiedad" : "propiedades"}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <button
                        type="button"
                        onClick={() => startEditing(feature)}
                        disabled={busyId === feature.id}
                        className="rounded-lg border border-card-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-accent hover:text-accent disabled:opacity-50"
                      >
                        Renombrar
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(feature)}
                        disabled={busyId === feature.id}
                        className="rounded-lg border border-card-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-red-400 hover:text-red-600 disabled:opacity-50"
                      >
                        {busyId === feature.id ? "…" : "Eliminar"}
                      </button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
