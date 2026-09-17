export function getApiUrl() {
  const apiUrl = process.env.API_URL;

  if (!apiUrl) {
    throw new Error("La variable de entorno API_URL no está configurada");
  }

  return apiUrl;
}
