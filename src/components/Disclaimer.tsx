import { Info } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function Disclaimer({ variant = "default", className }: { variant?: "default" | "compact" | "inline"; className?: string }) {
  const { t } = useI18n();

  if (variant === "inline") {
    return (
      <p className={cn("text-xs leading-relaxed text-muted-foreground", className)}>
        <span className="font-medium text-foreground">{t("disclaimer.title")}: </span>
        {t("disclaimer.body")}
      </p>
    );
  }

  return (
    <div
      className={cn(
        "flex gap-3 rounded-xl border border-border bg-surface-muted/60 p-4",
        variant === "compact" && "p-3",
        className,
      )}
      role="note"
    >
      <Info className="mt-0.5 h-4 w-4 shrink-0 text-[oklch(0.38_0.06_255)]" aria-hidden="true" />
      <div className="space-y-1">
        <p className="text-xs font-semibold uppercase tracking-wider text-foreground">
          {t("disclaimer.title")}
        </p>
        <p className="text-xs leading-relaxed text-muted-foreground">{t("disclaimer.body")}</p>
      </div>
    </div>
  );
}
