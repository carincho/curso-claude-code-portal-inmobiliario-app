"use client";

import { useState, type KeyboardEvent } from "react";

export function FeaturesInput({
  id,
  value,
  onChange,
  suggestions,
}: {
  id?: string;
  value: string[];
  onChange: (next: string[]) => void;
  suggestions: string[];
}) {
  const [draft, setDraft] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  function addFeature(rawName: string) {
    const name = rawName.trim();

    if (!name) {
      return;
    }

    const alreadyAdded = value.some(
      (existing) => existing.toLowerCase() === name.toLowerCase(),
    );

    if (!alreadyAdded) {
      onChange([...value, name]);
    }

    setDraft("");
  }

  function removeFeature(name: string) {
    onChange(value.filter((existing) => existing !== name));
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      addFeature(draft);
    } else if (event.key === "Backspace" && draft === "" && value.length > 0) {
      removeFeature(value[value.length - 1]);
    }
  }

  const matchingSuggestions = suggestions.filter((name) => {
    if (value.some((existing) => existing.toLowerCase() === name.toLowerCase())) {
      return false;
    }

    return draft.trim() === "" || name.toLowerCase().includes(draft.trim().toLowerCase());
  });

  const showSuggestions = isFocused && matchingSuggestions.length > 0;

  return (
    <div>
      {value.length > 0 && (
        <ul className="mb-2 flex flex-wrap gap-2">
          {value.map((name) => (
            <li
              key={name}
              className="flex items-center gap-1.5 rounded-full border border-accent/30 bg-accent-soft px-3 py-1 text-xs text-accent-hover"
            >
              {name}
              <button
                type="button"
                onClick={() => removeFeature(name)}
                aria-label={`Quitar característica ${name}`}
                className="leading-none text-accent-hover/70 hover:text-accent-hover focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-accent"
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="relative flex gap-2">
        <input
          id={id}
          type="text"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 150)}
          placeholder="Ej: Piscina, Gimnasio…"
          autoComplete="off"
          className="w-full rounded-lg border border-card-border bg-card px-3 py-2 text-sm text-foreground outline-none focus-visible:border-accent focus-visible:ring-2 focus-visible:ring-accent/20"
        />
        <button
          type="button"
          onClick={() => addFeature(draft)}
          className="shrink-0 rounded-lg border border-card-border px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:border-accent hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          Agregar
        </button>

        {showSuggestions && (
          <ul className="absolute left-0 top-full z-10 mt-1 w-full max-w-[calc(100%-5.5rem)] overflow-hidden rounded-lg border border-card-border bg-card shadow-md">
            {matchingSuggestions.slice(0, 6).map((name) => (
              <li key={name}>
                <button
                  type="button"
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => addFeature(name)}
                  className="block w-full px-3 py-2 text-left text-sm text-foreground hover:bg-accent-soft hover:text-accent-hover"
                >
                  {name}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      <p className="mt-1 text-xs text-muted-foreground">
        Presiona Enter o coma para agregar. Elige una sugerencia existente cuando sea posible.
      </p>
    </div>
  );
}
