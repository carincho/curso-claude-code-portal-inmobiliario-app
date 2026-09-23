"use client";

import type { Role, UserDTO } from "@portal-inmobiliario/shared-types";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { useFlash } from "@/components/flash/FlashProvider";
import { createUser, fetchUsers, updateUser } from "@/lib/admin-users-client";
import { formatDate } from "@/lib/format";

const inputClassName =
  "w-full rounded-lg border border-card-border bg-card px-3 py-2 text-sm text-foreground outline-none focus-visible:border-accent focus-visible:ring-2 focus-visible:ring-accent/20";

const ROLE_LABELS: Record<Role, string> = {
  USER: "Usuario",
  ADMIN: "Administrador",
};

type EditDraft = {
  name: string;
  email: string;
  password: string;
  role: Role;
};

const EMPTY_CREATE_DRAFT = { name: "", email: "", password: "", role: "USER" as Role };

export function AdminUsersContent() {
  const { apiUrl, user: currentUser, setUser: setCurrentUser } = useAuth();
  const { showFlash } = useFlash();
  const [users, setUsers] = useState<UserDTO[] | null>(null);
  const [error, setError] = useState(false);

  const [searchInput, setSearchInput] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<Role | "">("");

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState<EditDraft | null>(null);
  const [editError, setEditError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);
  const [createDraft, setCreateDraft] = useState(EMPTY_CREATE_DRAFT);
  const [createError, setCreateError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setAppliedSearch(searchInput.trim());
    }, 300);

    return () => clearTimeout(timeout);
  }, [searchInput]);

  useEffect(() => {
    let cancelled = false;

    fetchUsers(apiUrl, {
      search: appliedSearch || undefined,
      role: roleFilter || undefined,
    })
      .then((data) => {
        if (!cancelled) {
          setUsers(data);
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
  }, [apiUrl, appliedSearch, roleFilter]);

  function applyUpdatedUser(updated: UserDTO) {
    setUsers((prev) => (prev ?? []).map((item) => (item.id === updated.id ? updated : item)));

    if (currentUser && updated.id === currentUser.id) {
      setCurrentUser(updated);
    }
  }

  function openCreateForm() {
    setIsCreateFormOpen(true);
    setCreateDraft(EMPTY_CREATE_DRAFT);
    setCreateError(null);
  }

  function closeCreateForm() {
    setIsCreateFormOpen(false);
    setCreateDraft(EMPTY_CREATE_DRAFT);
    setCreateError(null);
  }

  async function handleCreateUser() {
    const name = createDraft.name.trim();
    const email = createDraft.email.trim();

    if (!name || !email) {
      setCreateError("El nombre y el email son obligatorios");
      return;
    }

    if (createDraft.password.length < 8) {
      setCreateError("La contraseña debe tener al menos 8 caracteres");
      return;
    }

    setIsCreating(true);
    setCreateError(null);

    try {
      const created = await createUser(apiUrl, {
        name,
        email,
        password: createDraft.password,
        role: createDraft.role,
      });
      setUsers((prev) => [created, ...(prev ?? [])]);
      closeCreateForm();
      showFlash("success", `Usuario "${created.name}" creado correctamente.`);
    } catch (createErr) {
      setCreateError(
        createErr instanceof Error ? createErr.message : "No se pudo crear el usuario",
      );
    } finally {
      setIsCreating(false);
    }
  }

  function startEditing(targetUser: UserDTO) {
    setEditingId(targetUser.id);
    setEditDraft({
      name: targetUser.name,
      email: targetUser.email,
      password: "",
      role: targetUser.role,
    });
    setEditError(null);
  }

  function cancelEditing() {
    setEditingId(null);
    setEditDraft(null);
    setEditError(null);
  }

  async function handleSaveEdit(targetUser: UserDTO) {
    if (!editDraft) {
      return;
    }

    const name = editDraft.name.trim();
    const email = editDraft.email.trim();

    if (!name || !email) {
      setEditError("El nombre y el email son obligatorios");
      return;
    }

    if (editDraft.password && editDraft.password.length < 8) {
      setEditError("La contraseña debe tener al menos 8 caracteres");
      return;
    }

    setBusyId(targetUser.id);
    setEditError(null);

    try {
      const updated = await updateUser(apiUrl, targetUser.id, {
        name,
        email,
        password: editDraft.password || undefined,
        role: editDraft.role !== targetUser.role ? editDraft.role : undefined,
      });
      applyUpdatedUser(updated);
      cancelEditing();
      showFlash("success", `Usuario "${updated.name}" actualizado correctamente.`);
    } catch (saveError) {
      setEditError(
        saveError instanceof Error ? saveError.message : "No se pudo actualizar el usuario",
      );
    } finally {
      setBusyId(null);
    }
  }

  async function handleToggleActive(targetUser: UserDTO) {
    const isSelf = currentUser?.id === targetUser.id;

    if (isSelf && targetUser.isActive) {
      return;
    }

    const confirmMessage = targetUser.isActive
      ? `¿Desactivar a "${targetUser.name}"? No podrá iniciar sesión.`
      : `¿Activar a "${targetUser.name}"?`;

    if (!window.confirm(confirmMessage)) {
      return;
    }

    setBusyId(targetUser.id);

    try {
      const updated = await updateUser(apiUrl, targetUser.id, { isActive: !targetUser.isActive });
      applyUpdatedUser(updated);
      showFlash(
        "success",
        `Usuario "${updated.name}" ${updated.isActive ? "activado" : "desactivado"} correctamente.`,
      );
    } catch (toggleError) {
      window.alert(
        toggleError instanceof Error ? toggleError.message : "No se pudo actualizar el usuario",
      );
    } finally {
      setBusyId(null);
    }
  }

  const hasActiveSearchOrFilter = appliedSearch !== "" || roleFilter !== "";

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Usuarios</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Administra las cuentas registradas: busca, activa o desactiva y modifica roles.
          </p>
        </div>
        <button
          type="button"
          onClick={() => (isCreateFormOpen ? closeCreateForm() : openCreateForm())}
          className="inline-flex shrink-0 items-center justify-center rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          {isCreateFormOpen ? "Cancelar" : "Nuevo usuario"}
        </button>
      </div>

      {isCreateFormOpen && (
        <div className="mt-6 rounded-lg border border-card-border bg-card p-4">
          <h2 className="text-sm font-semibold text-foreground">Nuevo usuario</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <div>
              <label
                htmlFor="create-user-name"
                className="mb-1 block text-xs font-medium text-muted-foreground"
              >
                Nombre
              </label>
              <input
                id="create-user-name"
                type="text"
                value={createDraft.name}
                onChange={(event) =>
                  setCreateDraft({ ...createDraft, name: event.target.value })
                }
                className={inputClassName}
              />
            </div>
            <div>
              <label
                htmlFor="create-user-email"
                className="mb-1 block text-xs font-medium text-muted-foreground"
              >
                Email
              </label>
              <input
                id="create-user-email"
                type="email"
                value={createDraft.email}
                onChange={(event) =>
                  setCreateDraft({ ...createDraft, email: event.target.value })
                }
                className={inputClassName}
              />
            </div>
            <div>
              <label
                htmlFor="create-user-password"
                className="mb-1 block text-xs font-medium text-muted-foreground"
              >
                Contraseña
              </label>
              <input
                id="create-user-password"
                type="password"
                autoComplete="new-password"
                value={createDraft.password}
                onChange={(event) =>
                  setCreateDraft({ ...createDraft, password: event.target.value })
                }
                placeholder="Mínimo 8 caracteres"
                className={inputClassName}
              />
            </div>
            <div>
              <label
                htmlFor="create-user-role"
                className="mb-1 block text-xs font-medium text-muted-foreground"
              >
                Rol
              </label>
              <select
                id="create-user-role"
                value={createDraft.role}
                onChange={(event) =>
                  setCreateDraft({ ...createDraft, role: event.target.value as Role })
                }
                className={inputClassName}
              >
                <option value="USER">Usuario</option>
                <option value="ADMIN">Administrador</option>
              </select>
            </div>
          </div>

          {createError && (
            <p role="alert" className="mt-2 text-xs text-red-600">
              {createError}
            </p>
          )}

          <div className="mt-3 flex items-center gap-2">
            <button
              type="button"
              onClick={handleCreateUser}
              disabled={isCreating}
              className="rounded-lg bg-accent px-3 py-1.5 text-xs font-medium text-accent-foreground transition-colors hover:bg-accent-hover disabled:opacity-50"
            >
              {isCreating ? "Creando…" : "Crear usuario"}
            </button>
            <button
              type="button"
              onClick={closeCreateForm}
              disabled={isCreating}
              className="rounded-lg border border-card-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-accent hover:text-accent disabled:opacity-50"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <label htmlFor="users-search" className="sr-only">
          Buscar usuarios
        </label>
        <input
          id="users-search"
          type="search"
          value={searchInput}
          onChange={(event) => setSearchInput(event.target.value)}
          placeholder="Buscar por nombre o email…"
          className={`${inputClassName} sm:max-w-sm`}
        />

        <label htmlFor="users-role-filter" className="sr-only">
          Filtrar por rol
        </label>
        <select
          id="users-role-filter"
          value={roleFilter}
          onChange={(event) => setRoleFilter(event.target.value as Role | "")}
          className={`${inputClassName} sm:max-w-[180px]`}
        >
          <option value="">Todos los roles</option>
          <option value="USER">Usuario</option>
          <option value="ADMIN">Administrador</option>
        </select>
      </div>

      <div className="mt-6">
        {error && (
          <p role="alert" className="text-sm text-red-600">
            No se pudieron cargar los usuarios.
          </p>
        )}

        {!error && users === null && (
          <p className="text-sm text-muted-foreground">Cargando…</p>
        )}

        {!error && users !== null && users.length === 0 && (
          <div className="rounded-lg border border-dashed border-card-border bg-card p-6 text-center text-sm text-muted-foreground">
            {hasActiveSearchOrFilter
              ? "No encontramos usuarios que coincidan con tu búsqueda o filtro."
              : "Todavía no hay usuarios registrados."}
          </div>
        )}

        {!error && users !== null && users.length > 0 && (
          <ul className="flex flex-col gap-3">
            {users.map((targetUser) => {
              const isSelf = currentUser?.id === targetUser.id;
              const isEditing = editingId === targetUser.id;
              const isBusy = busyId === targetUser.id;

              return (
                <li
                  key={targetUser.id}
                  className="rounded-lg border border-card-border bg-card p-4"
                >
                  {isEditing && editDraft ? (
                    <div className="flex flex-col gap-3">
                      <div className="grid gap-3 sm:grid-cols-2">
                        <div>
                          <label
                            htmlFor={`edit-name-${targetUser.id}`}
                            className="mb-1 block text-xs font-medium text-muted-foreground"
                          >
                            Nombre
                          </label>
                          <input
                            id={`edit-name-${targetUser.id}`}
                            type="text"
                            value={editDraft.name}
                            onChange={(event) =>
                              setEditDraft({ ...editDraft, name: event.target.value })
                            }
                            className={inputClassName}
                          />
                        </div>
                        <div>
                          <label
                            htmlFor={`edit-email-${targetUser.id}`}
                            className="mb-1 block text-xs font-medium text-muted-foreground"
                          >
                            Email
                          </label>
                          <input
                            id={`edit-email-${targetUser.id}`}
                            type="email"
                            value={editDraft.email}
                            onChange={(event) =>
                              setEditDraft({ ...editDraft, email: event.target.value })
                            }
                            className={inputClassName}
                          />
                        </div>
                        <div>
                          <label
                            htmlFor={`edit-password-${targetUser.id}`}
                            className="mb-1 block text-xs font-medium text-muted-foreground"
                          >
                            Nueva contraseña (opcional)
                          </label>
                          <input
                            id={`edit-password-${targetUser.id}`}
                            type="password"
                            autoComplete="new-password"
                            value={editDraft.password}
                            onChange={(event) =>
                              setEditDraft({ ...editDraft, password: event.target.value })
                            }
                            placeholder="Dejar en blanco para no cambiarla"
                            className={inputClassName}
                          />
                        </div>
                        <div>
                          <label
                            htmlFor={`edit-role-${targetUser.id}`}
                            className="mb-1 block text-xs font-medium text-muted-foreground"
                          >
                            Rol
                          </label>
                          <select
                            id={`edit-role-${targetUser.id}`}
                            value={editDraft.role}
                            disabled={isSelf}
                            onChange={(event) =>
                              setEditDraft({ ...editDraft, role: event.target.value as Role })
                            }
                            className={`${inputClassName} disabled:cursor-not-allowed disabled:opacity-60`}
                          >
                            <option value="USER">Usuario</option>
                            <option value="ADMIN">Administrador</option>
                          </select>
                          {isSelf && (
                            <p className="mt-1 text-xs text-muted-foreground">
                              No puedes cambiar tu propio rol.
                            </p>
                          )}
                        </div>
                      </div>

                      {editError && (
                        <p role="alert" className="text-xs text-red-600">
                          {editError}
                        </p>
                      )}

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleSaveEdit(targetUser)}
                          disabled={isBusy}
                          className="rounded-lg bg-accent px-3 py-1.5 text-xs font-medium text-accent-foreground transition-colors hover:bg-accent-hover disabled:opacity-50"
                        >
                          {isBusy ? "Guardando…" : "Guardar"}
                        </button>
                        <button
                          type="button"
                          onClick={cancelEditing}
                          disabled={isBusy}
                          className="rounded-lg border border-card-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-accent hover:text-accent disabled:opacity-50"
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="truncate font-medium text-foreground">
                            {targetUser.name}
                          </p>
                          {isSelf && (
                            <span className="rounded-full bg-accent-soft px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-accent-hover">
                              Tú
                            </span>
                          )}
                          <span
                            className={
                              targetUser.role === "ADMIN"
                                ? "rounded-full bg-accent-soft px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-accent-hover"
                                : "rounded-full bg-stone-200 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-stone-600"
                            }
                          >
                            {ROLE_LABELS[targetUser.role]}
                          </span>
                          <span
                            className={
                              targetUser.isActive
                                ? "rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-emerald-700"
                                : "rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-red-700"
                            }
                          >
                            {targetUser.isActive ? "Activo" : "Inactivo"}
                          </span>
                        </div>
                        <p className="mt-0.5 truncate text-xs text-muted-foreground">
                          {targetUser.email}
                        </p>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          Registrado el {formatDate(targetUser.createdAt)}
                        </p>
                      </div>

                      <div className="flex shrink-0 items-center gap-2">
                        <button
                          type="button"
                          onClick={() => startEditing(targetUser)}
                          disabled={isBusy}
                          className="rounded-lg border border-card-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-accent hover:text-accent disabled:opacity-50"
                        >
                          Editar
                        </button>
                        <button
                          type="button"
                          onClick={() => handleToggleActive(targetUser)}
                          disabled={isBusy || (isSelf && targetUser.isActive)}
                          title={
                            isSelf && targetUser.isActive
                              ? "No puedes desactivar tu propia cuenta"
                              : undefined
                          }
                          className="rounded-lg border border-card-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-red-400 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {isBusy
                            ? "…"
                            : targetUser.isActive
                              ? "Desactivar"
                              : "Activar"}
                        </button>
                      </div>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
