import type { PropertyListItem } from "@portal-inmobiliario/shared-types";
import { HttpError } from "@/lib/http-error";
import {
  createFavorite,
  deleteFavorite,
  findFavorite,
  findFavoritesByUserId,
} from "@/repositories/favorite.repository";
import { findPublishedPropertyById } from "@/repositories/property.repository";
import { toListItem } from "@/services/property.service";

export async function listUserFavorites(userId: string): Promise<PropertyListItem[]> {
  const favorites = await findFavoritesByUserId(userId);
  return favorites.map((favorite) => toListItem(favorite.property));
}

export async function addFavorite(userId: string, propertyId: string): Promise<void> {
  const property = await findPublishedPropertyById(propertyId);

  if (!property) {
    throw new HttpError(404, "Propiedad no encontrada");
  }

  const existing = await findFavorite(userId, propertyId);

  if (existing) {
    return;
  }

  await createFavorite(userId, propertyId);
}

export async function removeFavorite(userId: string, propertyId: string): Promise<void> {
  await deleteFavorite(userId, propertyId);
}
