export function parseSearchParams(searchParams: URLSearchParams): Record<string, string | string[]> {
  const raw: Record<string, string | string[]> = {};

  for (const key of new Set(searchParams.keys())) {
    const values = searchParams.getAll(key);
    raw[key] = values.length > 1 ? values : values[0];
  }

  return raw;
}
