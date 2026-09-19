"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import { useFavorites } from "@/components/favorites/FavoritesProvider";
import { cn } from "@/lib/cn";

export function FavoriteButton({
  propertyId,
  className,
}: {
  propertyId: string;
  className?: string;
}) {
  const router = useRouter();
  const { user } = useAuth();
  const { favoriteIds, toggleFavorite } = useFavorites();
  const isFavorite = favoriteIds.has(propertyId);

  function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();

    if (!user) {
      router.push("/login");
      return;
    }

    void toggleFavorite(propertyId);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-pressed={isFavorite}
      aria-label={isFavorite ? "Quitar de favoritos" : "Guardar como favorita"}
      className={cn(
        "inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-stone-600 shadow-sm backdrop-blur transition-colors hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
        isFavorite && "text-accent",
        className,
      )}
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="h-5 w-5"
        fill={isFavorite ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth={1.8}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 20.25c-.3 0-.6-.09-.85-.28C7.29 17.1 3.75 14 3.75 9.94 3.75 7.2 5.93 5 8.63 5c1.4 0 2.74.63 3.62 1.68A4.83 4.83 0 0 1 15.87 5c2.7 0 4.88 2.2 4.88 4.94 0 4.06-3.54 7.16-7.4 10.03-.25.19-.55.28-.85.28Z"
        />
      </svg>
    </button>
  );
}
