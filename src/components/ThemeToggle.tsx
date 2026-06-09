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
        "group relative inline-flex h-8 w-14 items-center rounded-full border border-border bg-surface px-1 transition-all",
        isDark && "shadow-[0_0_18px_-4px_var(--color-neon)]",
        className,
      )}
    >
      <span
        className={cn(
          "flex h-6 w-6 items-center justify-center rounded-full transition-transform duration-300",
          isDark ? "translate-x-6 bg-[var(--color-neon)] text-[var(--color-charcoal)]" : "translate-x-0 bg-[oklch(0.85_0.12_85)] text-white",
        )}
      >
        {isDark ? <Moon className="h-3.5 w-3.5" /> : <Sun className="h-3.5 w-3.5" />}
      </span>
    </button>
  );
}
