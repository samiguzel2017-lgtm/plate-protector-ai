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
        "group relative inline-flex h-8 w-14 shrink-0 items-center rounded-full border border-border bg-secondary px-1 transition-all duration-300",
        isDark && "shadow-sm",
        className,
      )}
    >
      <span
        className={cn(
          "flex h-5 w-5 items-center justify-center rounded-full transition-transform duration-300 sm:h-6 sm:w-6",
          isDark ? "translate-x-6 bg-primary text-primary-foreground" : "translate-x-0 bg-card text-primary shadow-sm",
        )}
      >
        {isDark ? <Moon className="h-3.5 w-3.5" /> : <Sun className="h-3.5 w-3.5" />}
      </span>
    </button>
  );
}
