import { cn } from "@/lib/cn";

export function BrandIcon({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-accent",
        className,
      )}
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="h-5 w-5 text-accent-foreground"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 10.5 12 3l9 7.5" />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M5.25 9.75V20a.75.75 0 0 0 .75.75h3.75v-5.25a1.5 1.5 0 0 1 1.5-1.5h1.5a1.5 1.5 0 0 1 1.5 1.5v5.25H18a.75.75 0 0 0 .75-.75V9.75"
        />
      </svg>
    </span>
  );
}
