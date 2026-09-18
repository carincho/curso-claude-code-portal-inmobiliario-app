export function PropertyCardSkeleton() {
  return (
    <div
      role="status"
      aria-label="Cargando propiedad"
      className="flex animate-pulse flex-col overflow-hidden rounded-xl border border-card-border bg-card"
    >
      <div className="aspect-[4/3] w-full bg-stone-200" />
      <div className="flex flex-col gap-2 p-4">
        <div className="h-5 w-1/2 rounded bg-stone-200" />
        <div className="h-4 w-full rounded bg-stone-200" />
        <div className="h-4 w-2/3 rounded bg-stone-200" />
        <div className="mt-2 h-4 w-1/3 rounded bg-stone-200" />
      </div>
    </div>
  );
}
