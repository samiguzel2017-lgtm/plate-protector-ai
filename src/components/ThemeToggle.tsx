import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/lib/theme";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggle } = useTheme();
  const isDark = theme === "dark";
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className={cn(
        "group relative inline-flex h-7 w-12 shrink-0 items-center rounded-full border border-border bg-surface px-1 transition-all sm:h-8 sm:w-14",
        isDark && "shadow-[0_0_18px_-4px_var(--color-neon)]",
        className,
      )}
    >
      <span
        className={cn(
          "flex h-5 w-5 items-center justify-center rounded-full transition-transform duration-300 sm:h-6 sm:w-6",
          isDark ? "translate-x-5 sm:translate-x-6 bg-[var(--color-neon)] text-[var(--color-charcoal)]" : "translate-x-0 bg-[oklch(0.85_0.12_85)] text-white",
        )}
      >
        {isDark ? <Moon className="h-3.5 w-3.5" /> : <Sun className="h-3.5 w-3.5" />}
      </span>
    </button>
  );
}
