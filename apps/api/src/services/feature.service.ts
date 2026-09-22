import type { FeatureDTO } from "@portal-inmobiliario/shared-types";
import { HttpError } from "@/lib/http-error";
import {
  createFeature,
  deleteFeature,
  findAllFeaturesWithUsage,
  isUniqueConstraintError,
  renameFeature,
} from "@/repositories/feature.repository";

function toFeatureDTO(feature: {
  id: string;
  name: string;
  _count: { properties: number };
}): FeatureDTO {
  return { id: feature.id, name: feature.name, propertiesCount: feature._count.properties };
}

export async function listFeatures(): Promise<FeatureDTO[]> {
  const features = await findAllFeaturesWithUsage();
  return features.map(toFeatureDTO);
}

export async function createFeatureService(name: string): Promise<FeatureDTO> {
  try {
    const feature = await createFeature(name);
    return toFeatureDTO(feature);
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      throw new HttpError(409, "Ya existe una característica con ese nombre");
    }
    throw error;
  }
}

export async function renameFeatureService(id: string, name: string): Promise<FeatureDTO> {
  try {
    const feature = await renameFeature(id, name);

    if (!feature) {
      throw new HttpError(404, "Característica no encontrada");
    }

    return toFeatureDTO(feature);
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      throw new HttpError(409, "Ya existe una característica con ese nombre");
    }
    throw error;
  }
}

export async function deleteFeatureService(id: string): Promise<void> {
  const deleted = await deleteFeature(id);

  if (!deleted) {
    throw new HttpError(404, "Característica no encontrada");
  }
}
