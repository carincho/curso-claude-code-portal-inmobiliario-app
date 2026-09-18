import Link from "next/link";

export default function PropertyNotFound() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col items-center gap-4 px-4 py-24 text-center sm:px-6 lg:px-8">
      <h1 className="text-2xl font-semibold text-stone-900">Propiedad no encontrada</h1>
      <p className="max-w-md text-sm text-stone-600">
        La propiedad que buscas no existe o ya no está publicada.
      </p>
      <Link
        href="/properties"
        className="rounded-lg bg-accent px-6 py-2.5 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        Ver todas las propiedades
      </Link>
    </div>
  );
}
