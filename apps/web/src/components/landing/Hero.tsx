import Link from "next/link";

export function Hero() {
  return (
    <section className="border-b border-zinc-200 bg-gradient-to-b from-zinc-50 to-white dark:border-zinc-800 dark:from-zinc-950 dark:to-black">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-8 px-4 py-16 text-center sm:px-6 sm:py-24 lg:px-8">
        <div className="flex flex-col gap-4">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-5xl dark:text-zinc-50">
            Encuentra tu próxima propiedad en México
          </h1>
          <p className="mx-auto max-w-2xl text-base text-zinc-600 sm:text-lg dark:text-zinc-400">
            Explora casas, departamentos, terrenos y oficinas en venta y arriendo en las
            principales ciudades del país.
          </p>
        </div>

        <form
          action="/properties"
          method="GET"
          className="flex w-full max-w-xl flex-col gap-3 rounded-xl border border-zinc-200 bg-white p-3 shadow-sm sm:flex-row dark:border-zinc-800 dark:bg-zinc-900"
        >
          <label htmlFor="hero-search" className="sr-only">
            Buscar propiedades
          </label>
          <input
            id="hero-search"
            type="search"
            name="search"
            placeholder="Busca por comuna, ciudad o palabra clave"
            className="flex-1 rounded-lg border border-zinc-200 px-4 py-2.5 text-sm text-zinc-900 outline-none focus-visible:border-zinc-900 focus-visible:ring-2 focus-visible:ring-zinc-900/20 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50"
          />
          <button
            type="submit"
            className="rounded-lg bg-zinc-900 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            Buscar
          </button>
        </form>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/properties?operation=SALE"
            className="rounded-full border border-zinc-300 px-5 py-2 text-sm font-medium text-zinc-700 transition-colors hover:border-zinc-900 hover:text-zinc-900 dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-zinc-50 dark:hover:text-zinc-50"
          >
            Comprar
          </Link>
          <Link
            href="/properties?operation=RENT"
            className="rounded-full border border-zinc-300 px-5 py-2 text-sm font-medium text-zinc-700 transition-colors hover:border-zinc-900 hover:text-zinc-900 dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-zinc-50 dark:hover:text-zinc-50"
          >
            Arrendar
          </Link>
          <Link
            href="/properties"
            className="rounded-full bg-zinc-900 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            Ver todas las propiedades
          </Link>
        </div>
      </div>
    </section>
  );
}
