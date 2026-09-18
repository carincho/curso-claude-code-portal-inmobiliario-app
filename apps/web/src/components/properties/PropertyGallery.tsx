"use client";

import Image from "next/image";
import { useState } from "react";
import type { PropertyImageDTO } from "@portal-inmobiliario/shared-types";

export function PropertyGallery({
  images,
  title,
  badgeLabel,
}: {
  images: PropertyImageDTO[];
  title: string;
  badgeLabel?: string;
}) {
  const initialIndex = Math.max(
    images.findIndex((image) => image.isMain),
    0,
  );
  const [activeIndex, setActiveIndex] = useState(initialIndex);

  if (images.length === 0) {
    return (
      <div className="relative mb-6 aspect-[16/9] w-full overflow-hidden rounded-xl bg-stone-100">
        <div className="flex h-full w-full items-center justify-center text-sm text-stone-400">
          Sin imagen
        </div>
        {badgeLabel ? (
          <span className="absolute left-4 top-4 rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground">
            {badgeLabel}
          </span>
        ) : null}
      </div>
    );
  }

  const activeImage = images[activeIndex];
  const hasMultiple = images.length > 1;

  function goTo(index: number) {
    setActiveIndex((index + images.length) % images.length);
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (!hasMultiple) return;

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      goTo(activeIndex - 1);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      goTo(activeIndex + 1);
    }
  }

  return (
    <div className="mb-6">
      <div
        role="group"
        aria-label={`Galería de imágenes de ${title}`}
        tabIndex={hasMultiple ? 0 : -1}
        onKeyDown={handleKeyDown}
        className="relative aspect-[16/9] w-full overflow-hidden rounded-xl bg-stone-100 outline-none focus-visible:ring-2 focus-visible:ring-accent"
      >
        <Image
          key={activeImage.id}
          src={activeImage.url}
          alt={`${title} — imagen ${activeIndex + 1} de ${images.length}`}
          fill
          sizes="(min-width: 1024px) 960px, 100vw"
          className="object-cover"
          priority={activeIndex === 0}
        />

        {badgeLabel ? (
          <span className="absolute left-4 top-4 rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground">
            {badgeLabel}
          </span>
        ) : null}

        {hasMultiple && (
          <>
            <button
              type="button"
              onClick={() => goTo(activeIndex - 1)}
              aria-label="Imagen anterior"
              className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white transition-colors hover:bg-black/70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => goTo(activeIndex + 1)}
              aria-label="Imagen siguiente"
              className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white transition-colors hover:bg-black/70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>

            <span className="absolute bottom-3 right-3 rounded-full bg-black/60 px-2.5 py-1 text-xs text-white">
              {activeIndex + 1} / {images.length}
            </span>
          </>
        )}
      </div>

      {hasMultiple && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {images.map((image, index) => (
            <button
              key={image.id}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`Ver imagen ${index + 1} de ${images.length}`}
              aria-current={index === activeIndex}
              className={`relative h-16 w-24 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                index === activeIndex
                  ? "border-accent"
                  : "border-transparent hover:border-stone-300"
              }`}
            >
              <Image src={image.url} alt="" fill sizes="96px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
