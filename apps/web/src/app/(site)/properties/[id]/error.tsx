"use client";

import { useEffect } from "react";

export default function PropertyDetailError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col items-center gap-4 px-4 py-24 text-center sm:px-6 lg:px-8">
      <h1 className="text-2xl font-semibold text-stone-900">No pudimos cargar esta propiedad</h1>
      <p className="max-w-md text-sm text-stone-600">
        Ocurrió un problema al conectar con el servidor. Intenta de nuevo en unos segundos.
      </p>
      <button
        type="button"
        onClick={() => reset()}
        className="rounded-lg bg-accent px-6 py-2.5 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        Reintentar
      </button>
    </div>
  );
}
