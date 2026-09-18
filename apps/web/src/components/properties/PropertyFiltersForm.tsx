import type { PropertyLocations } from "@portal-inmobiliario/shared-types";
import Link from "next/link";
import { OPERATION_TYPE_LABELS, PROPERTY_TYPE_LABELS } from "@/lib/property-labels";

const SORT_OPTIONS = [
  { value: "newest", label: "Más recientes" },
  { value: "price_asc", label: "Precio: menor a mayor" },
  { value: "price_desc", label: "Precio: mayor a menor" },
  { value: "area_asc", label: "Superficie: menor a mayor" },
  { value: "area_desc", label: "Superficie: mayor a menor" },
] as const;

export type PropertyFiltersDefaultValues = {
  search?: string;
  sort?: string;
  operation?: string;
  type?: string[];
  minPrice?: string;
  maxPrice?: string;
  bedrooms?: string;
  bathrooms?: string;
  minUsableArea?: string;
  commune?: string[];
  city?: string[];
  region?: string[];
};

const fieldClassName =
  "w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900 outline-none focus-visible:border-accent focus-visible:ring-2 focus-visible:ring-accent/20";

const labelClassName = "mb-1 block text-xs font-medium text-stone-600";

const legendClassName = "mb-2 text-xs font-semibold uppercase tracking-wide text-stone-500";

const checkboxRowClassName = "flex items-center gap-2 text-sm text-stone-700";

const checkboxInputClassName =
  "h-4 w-4 rounded border-stone-300 text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

function CheckboxGroup({
  legend,
  name,
  options,
  selected,
}: {
  legend: string;
  name: string;
  options: string[];
  selected: string[];
}) {
  if (options.length === 0) {
    return null;
  }

  return (
    <fieldset>
      <legend className={legendClassName}>{legend}</legend>
      <div className="flex max-h-40 flex-col gap-2 overflow-y-auto pr-1">
        {options.map((option) => (
          <label key={option} className={checkboxRowClassName}>
            <input
              type="checkbox"
              name={name}
              value={option}
              defaultChecked={selected.includes(option)}
              className={checkboxInputClassName}
            />
            {option}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export function PropertyFiltersForm({
  defaultValues,
  locations,
}: {
  defaultValues: PropertyFiltersDefaultValues;
  locations: PropertyLocations;
}) {
  const selectedTypes = defaultValues.type ?? [];
  const selectedCommunes = defaultValues.commune ?? [];
  const selectedCities = defaultValues.city ?? [];
  const selectedRegions = defaultValues.region ?? [];

  return (
    <form action="/properties" method="GET" className="flex flex-col gap-6">
      <div>
        <label htmlFor="search" className="sr-only">
          Buscar propiedades
        </label>
        <input
          id="search"
          type="search"
          name="search"
          defaultValue={defaultValues.search}
          placeholder="Busca por título, comuna, ciudad o región…"
          className={fieldClassName}
        />
      </div>

      <div>
        <label htmlFor="sort" className={labelClassName}>
          Ordenar por
        </label>
        <select
          id="sort"
          name="sort"
          defaultValue={defaultValues.sort || "newest"}
          className={fieldClassName}
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <fieldset>
        <legend className={legendClassName}>Operación</legend>
        <div className="flex flex-col gap-2">
          <label className={checkboxRowClassName}>
            <input
              type="radio"
              name="operation"
              value=""
              defaultChecked={!defaultValues.operation}
              className={checkboxInputClassName}
            />
            Todas
          </label>
          {Object.entries(OPERATION_TYPE_LABELS).map(([value, label]) => (
            <label key={value} className={checkboxRowClassName}>
              <input
                type="radio"
                name="operation"
                value={value}
                defaultChecked={defaultValues.operation === value}
                className={checkboxInputClassName}
              />
              {label}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className={legendClassName}>Tipo</legend>
        <div className="flex flex-col gap-2">
          {Object.entries(PROPERTY_TYPE_LABELS).map(([value, label]) => (
            <label key={value} className={checkboxRowClassName}>
              <input
                type="checkbox"
                name="type"
                value={value}
                defaultChecked={selectedTypes.includes(value)}
                className={checkboxInputClassName}
              />
              {label}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="minPrice" className={labelClassName}>
            Precio mín. (USD)
          </label>
          <input
            id="minPrice"
            type="number"
            name="minPrice"
            min={0}
            defaultValue={defaultValues.minPrice}
            className={fieldClassName}
          />
        </div>
        <div>
          <label htmlFor="maxPrice" className={labelClassName}>
            Precio máx. (USD)
          </label>
          <input
            id="maxPrice"
            type="number"
            name="maxPrice"
            min={0}
            defaultValue={defaultValues.maxPrice}
            className={fieldClassName}
          />
        </div>
        <div>
          <label htmlFor="bedrooms" className={labelClassName}>
            Dormitorios mín.
          </label>
          <input
            id="bedrooms"
            type="number"
            name="bedrooms"
            min={0}
            defaultValue={defaultValues.bedrooms}
            className={fieldClassName}
          />
        </div>
        <div>
          <label htmlFor="bathrooms" className={labelClassName}>
            Baños mín.
          </label>
          <input
            id="bathrooms"
            type="number"
            name="bathrooms"
            min={0}
            defaultValue={defaultValues.bathrooms}
            className={fieldClassName}
          />
        </div>
        <div className="col-span-2">
          <label htmlFor="minUsableArea" className={labelClassName}>
            Superficie mín. (m²)
          </label>
          <input
            id="minUsableArea"
            type="number"
            name="minUsableArea"
            min={0}
            defaultValue={defaultValues.minUsableArea}
            className={fieldClassName}
          />
        </div>
      </div>

      <CheckboxGroup
        legend="Comuna"
        name="commune"
        options={locations.communes}
        selected={selectedCommunes}
      />

      <CheckboxGroup
        legend="Ciudad"
        name="city"
        options={locations.cities}
        selected={selectedCities}
      />

      <CheckboxGroup
        legend="Región"
        name="region"
        options={locations.regions}
        selected={selectedRegions}
      />

      <div className="flex items-center gap-4 border-t border-stone-200 pt-4">
        <button
          type="submit"
          className="rounded-lg bg-accent px-6 py-2.5 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          Aplicar filtros
        </button>
        <Link
          href="/properties"
          className="text-sm font-medium text-stone-600 underline underline-offset-4 hover:text-accent"
        >
          Limpiar todo
        </Link>
      </div>
    </form>
  );
}
