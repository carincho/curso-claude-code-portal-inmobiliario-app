"use client";

import { useEffect, useRef, useState } from "react";
import type { Coordinates } from "@/lib/geocode-address";

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

type Status = "loading" | "ready" | "error";

const MAPS_CALLBACK_NAME = "__portalInmobiliarioGoogleMapsReady";

let mapsScriptPromise: Promise<void> | null = null;

function loadGoogleMapsScript(apiKey: string): Promise<void> {
  if (typeof window.google?.maps?.importLibrary === "function") {
    return Promise.resolve();
  }

  if (!mapsScriptPromise) {
    mapsScriptPromise = new Promise((resolve, reject) => {
      const callbackWindow = window as unknown as Record<string, () => void>;
      callbackWindow[MAPS_CALLBACK_NAME] = () => {
        delete callbackWindow[MAPS_CALLBACK_NAME];
        resolve();
      };

      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&loading=async&callback=${MAPS_CALLBACK_NAME}`;
      script.async = true;
      script.onerror = () => {
        mapsScriptPromise = null;
        reject(new Error("No se pudo cargar Google Maps"));
      };
      document.head.appendChild(script);
    });
  }

  return mapsScriptPromise;
}

function MapFallback({ address }: { address: string }) {
  const externalMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;

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

export function PropertyMap({
  address,
  title,
  coordinates,
}: {
  address: string;
  title: string;
  coordinates: Coordinates | null;
}) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<Status>(
    GOOGLE_MAPS_API_KEY && coordinates ? "loading" : "error",
  );

  useEffect(() => {
    if (!GOOGLE_MAPS_API_KEY || !coordinates || !mapContainerRef.current) {
      return;
    }

    let cancelled = false;

    loadGoogleMapsScript(GOOGLE_MAPS_API_KEY)
      .then(async () => {
        if (cancelled || !mapContainerRef.current) {
          return;
        }

        const { Map } = (await window.google.maps.importLibrary(
          "maps",
        )) as google.maps.MapsLibrary;
        const { Marker } = (await window.google.maps.importLibrary(
          "marker",
        )) as google.maps.MarkerLibrary;

        if (cancelled || !mapContainerRef.current) {
          return;
        }

        const map = new Map(mapContainerRef.current, { center: coordinates, zoom: 15 });
        new Marker({ position: coordinates, map, title });
        setStatus("ready");
      })
      .catch(() => {
        if (!cancelled) {
          setStatus("error");
        }
      });

    return () => {
      cancelled = true;
    };
  }, [coordinates, title]);

  if (status === "error") {
    return <MapFallback address={address} />;
  }

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-card-border">
      {status === "loading" && (
        <div className="absolute inset-0 flex items-center justify-center bg-card text-sm text-stone-500">
          Cargando mapa…
        </div>
      )}
      <div
        ref={mapContainerRef}
        role="img"
        aria-label={`Mapa de ubicación de ${title}`}
        className="h-full w-full"
      />
    </div>
  );
}
