import { cn } from "@/lib/utils";

export function AlentraLogo({ className, withWordmark = true }: { className?: string; withWordmark?: boolean }) {
  return (
    <div className={cn("inline-flex items-center gap-2.5", className)}>
      <svg viewBox="0 0 40 40" className="h-8 w-8" aria-hidden="true">
        <defs>
          <linearGradient id="alentraShield" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="oklch(0.38 0.07 255)" />
            <stop offset="100%" stopColor="oklch(0.26 0.06 255)" />
          </linearGradient>
        </defs>
        {/* Shield */}
        <path
          d="M20 2.5 L34 7.5 V20 C34 28 27.5 34.5 20 37.5 C12.5 34.5 6 28 6 20 V7.5 Z"
          fill="url(#alentraShield)"
        />
        {/* Circuit nodes */}
        <circle cx="13" cy="14" r="1.2" fill="oklch(0.7 0.18 148)" />
        <circle cx="27" cy="14" r="1.2" fill="oklch(0.7 0.18 148)" />
        <circle cx="20" cy="29" r="1.2" fill="oklch(0.7 0.18 148)" />
        <path
          d="M13 14 L20 18 L27 14 M20 18 L20 29"
          stroke="oklch(0.7 0.18 148)"
          strokeWidth="0.9"
          fill="none"
          strokeLinecap="round"
        />
        {/* Leaf */}
        <path
          d="M20 11 C22.5 13 24 16 23 19.5 C22 23 19 24 17 22 C15 20 15.5 16.5 17.5 14 C18.3 13 19.2 11.7 20 11 Z"
          fill="oklch(0.78 0.16 148)"
          opacity="0.95"
        />
        <path d="M20 11 C19.5 14 18.5 18 17.2 21.5" stroke="oklch(0.35 0.07 150)" strokeWidth="0.5" fill="none" opacity="0.5" />
      </svg>
      {withWordmark && (
        <span className="font-serif text-xl tracking-tight text-foreground">
          Alentra<span className="text-[oklch(0.55_0.12_148)]">.</span>AI
        </span>
      )}
    </div>
  );
}
