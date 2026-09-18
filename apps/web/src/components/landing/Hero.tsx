import Image from "next/image";
import Link from "next/link";

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-card-border">
      <Image
        src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1600&auto=format&fit=crop"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-header/90 via-header/80 to-header/95" />

      <div className="relative mx-auto flex max-w-6xl flex-col items-center gap-8 px-4 py-16 text-center sm:px-6 sm:py-28 lg:px-8">
        <div className="flex flex-col gap-4">
          <h1 className="text-3xl font-bold tracking-tight text-white text-balance sm:text-5xl">
            Encuentra tu próxima propiedad en México
          </h1>
          <p className="mx-auto max-w-2xl text-base text-header-text sm:text-lg">
            Explora casas, departamentos, terrenos y oficinas en venta y arriendo en las
            principales ciudades del país.
          </p>
        </div>

        <form
          action="/properties"
          method="GET"
          className="flex w-full max-w-xl flex-col gap-3 rounded-xl border border-card-border bg-card p-3 shadow-lg sm:flex-row"
        >
          <label htmlFor="hero-search" className="sr-only">
            Buscar propiedades
          </label>
          <input
            id="hero-search"
            type="search"
            name="search"
            placeholder="Busca por comuna, ciudad o palabra clave…"
            className="flex-1 rounded-lg border border-card-border px-4 py-2.5 text-sm text-stone-900 outline-none focus-visible:border-accent focus-visible:ring-2 focus-visible:ring-accent/20"
          />
          <button
            type="submit"
            className="rounded-lg bg-accent px-6 py-2.5 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            Buscar
          </button>
        </form>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/properties?operation=SALE"
            className="rounded-full border border-white/30 px-5 py-2 text-sm font-medium text-white transition-colors hover:border-white hover:bg-white/10"
          >
            Comprar
          </Link>
          <Link
            href="/properties?operation=RENT"
            className="rounded-full border border-white/30 px-5 py-2 text-sm font-medium text-white transition-colors hover:border-white hover:bg-white/10"
          >
            Arrendar
          </Link>
          <Link
            href="/properties"
            className="rounded-full bg-accent px-5 py-2 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent-hover"
          >
            Ver todas las propiedades
          </Link>
        </div>
      </div>
    </section>
  );
}
