import type { PropertyFeatureDTO } from "@portal-inmobiliario/shared-types";
import { findAllFeatures } from "@/repositories/feature.repository";

export async function listFeatures(): Promise<PropertyFeatureDTO[]> {
  const features = await findAllFeatures();
  return features.map((feature) => ({ id: feature.id, name: feature.name }));
}
