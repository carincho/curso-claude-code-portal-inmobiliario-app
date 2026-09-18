import { PropertyGridSkeleton } from "@/components/properties/PropertyGridSkeleton";

export function PropertyResultsSkeleton() {
  return (
    <>
      <div className="mb-6 h-4 w-48 animate-pulse rounded bg-stone-200" />
      <PropertyGridSkeleton />
    </>
  );
}
