"use client";

import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";

export type FlashType = "success" | "error";

type FlashMessage = {
  id: string;
  type: FlashType;
  text: string;
};

type FlashContextValue = {
  showFlash: (type: FlashType, text: string) => void;
};

const FlashContext = createContext<FlashContextValue | null>(null);

const AUTO_DISMISS_MS = 5000;

function CheckCircleIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 shrink-0 text-green-600" fill="none" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
  );
}

function ErrorCircleIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 shrink-0 text-red-600" fill="none" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m0 3.75h.008M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
    </svg>
  );
}

export function FlashProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<FlashMessage[]>([]);
  const timeouts = useRef(new Map<string, ReturnType<typeof setTimeout>>());

  const dismissFlash = useCallback((id: string) => {
    const timeout = timeouts.current.get(id);

    if (timeout) {
      clearTimeout(timeout);
      timeouts.current.delete(id);
    }

    setMessages((current) => current.filter((message) => message.id !== id));
  }, []);

  const showFlash = useCallback(
    (type: FlashType, text: string) => {
      const id = crypto.randomUUID();
      setMessages((current) => [...current, { id, type, text }]);

      const timeout = setTimeout(() => dismissFlash(id), AUTO_DISMISS_MS);
      timeouts.current.set(id, timeout);
    },
    [dismissFlash],
  );

  return (
    <FlashContext.Provider value={{ showFlash }}>
      {children}

      {messages.length > 0 && (
        <div
          aria-live="polite"
          aria-atomic="false"
          className="pointer-events-none fixed inset-x-0 top-0 z-[70] flex flex-col items-center gap-2 px-4 py-3 sm:items-end sm:px-6"
        >
          {messages.map((message) => (
            <div
              key={message.id}
              role={message.type === "error" ? "alert" : "status"}
              className={cn(
                "pointer-events-auto flex w-full max-w-sm items-start gap-2 rounded-lg border bg-card px-4 py-3 shadow-lg",
                message.type === "error" ? "border-red-200" : "border-green-200",
              )}
            >
              {message.type === "error" ? <ErrorCircleIcon /> : <CheckCircleIcon />}
              <p className="flex-1 text-sm text-foreground">{message.text}</p>
              <button
                type="button"
                onClick={() => dismissFlash(message.id)}
                aria-label="Cerrar mensaje"
                className="shrink-0 rounded-md p-0.5 text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                <CloseIcon />
              </button>
            </div>
          ))}
        </div>
      )}
    </FlashContext.Provider>
  );
}

export function useFlash() {
  const context = useContext(FlashContext);

  if (!context) {
    throw new Error("useFlash debe usarse dentro de FlashProvider");
  }

  return context;
}
