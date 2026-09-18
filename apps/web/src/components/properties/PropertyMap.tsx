const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

export function PropertyMap({ address, title }: { address: string; title: string }) {
  const externalMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;

  if (!GOOGLE_MAPS_API_KEY) {
    return (
      <div className="flex aspect-video w-full flex-col items-center justify-center gap-2 rounded-lg border border-card-border bg-card px-4 text-center">
        <p className="text-sm text-stone-600">El mapa no está disponible en este momento.</p>
        <a
          href={externalMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium text-accent hover:text-accent-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          Ver ubicación en Google Maps →
        </a>
      </div>
    );
  }

  const embedUrl = `https://www.google.com/maps/embed/v1/place?key=${GOOGLE_MAPS_API_KEY}&q=${encodeURIComponent(address)}`;

  return (
    <div className="aspect-video w-full overflow-hidden rounded-lg border border-card-border">
      <iframe
        title={`Mapa de ubicación de ${title}`}
        src={embedUrl}
        className="h-full w-full"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
      />
    </div>
  );
}
