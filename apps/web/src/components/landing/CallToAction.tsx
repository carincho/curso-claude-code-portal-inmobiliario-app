import Link from "next/link";

export function CallToAction() {
  return (
    <section className="bg-footer">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 py-16 text-center sm:px-6 lg:px-8">
        <h2 className="text-2xl font-semibold text-white sm:text-3xl">
          ¿Listo para encontrar tu próxima propiedad?
        </h2>
        <p className="max-w-xl text-sm text-footer-text sm:text-base">
          Regístrate para guardar tus propiedades favoritas y dar seguimiento a tus consultas
          desde tu cuenta.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            href="/properties"
            className="rounded-full bg-accent px-6 py-2.5 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent-hover"
          >
            Explorar propiedades
          </Link>
          <Link
            href="/register"
            className="rounded-full border border-white/30 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:border-white"
          >
            Crear cuenta
          </Link>
        </div>
      </div>
    </section>
  );
}
