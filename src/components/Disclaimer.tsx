import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

/**
 * Minimal disclaimer used inside analysis screens where it is legally required.
 * Landing/header areas should NOT render this — the full disclaimer lives only
 * in the SiteFooter to avoid visual clutter.
 */
export function Disclaimer({ className }: { variant?: "default" | "compact" | "inline"; className?: string }) {
  const { t } = useI18n();
  return (
    <p className={cn("text-[11px] font-light leading-relaxed text-muted-foreground/80", className)}>
      <span className="font-medium text-foreground/80">{t("disclaimer.title")}: </span>
      {t("disclaimer.body")}
    </p>
  );
}
