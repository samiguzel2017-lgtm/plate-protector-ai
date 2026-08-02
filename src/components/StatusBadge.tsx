import { CheckCircle2, AlertTriangle, ShieldAlert } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export type Status = "safe" | "warning" | "danger";

export function StatusBadge({ status, size = "md" }: { status: Status; size?: "sm" | "md" | "lg" }) {
  const { t } = useI18n();
  const map = {
    safe: {
      label: t("result.safe"),
      Icon: CheckCircle2,
      style: {
        color: "var(--safe-foreground)",
        background: "var(--safe)",
        borderColor: "color-mix(in oklab, var(--safe) 70%, transparent)",
      },
    },
    warning: {
      label: t("result.warning"),
      Icon: AlertTriangle,
      style: {
        color: "var(--warning-foreground)",
        background: "var(--warning)",
        borderColor: "color-mix(in oklab, var(--warning) 70%, transparent)",
      },
    },
    danger: {
      label: t("result.danger"),
      Icon: ShieldAlert,
      style: {
        color: "var(--danger-foreground)",
        background: "var(--danger)",
        borderColor: "color-mix(in oklab, var(--danger) 70%, transparent)",
      },
    },
  } as const;

  const m = map[status];
  const sizeCls = size === "lg" ? "px-4 py-2 text-sm" : size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-xs";
  const iconCls = size === "lg" ? "h-4 w-4" : size === "sm" ? "h-3 w-3" : "h-3.5 w-3.5";
  return (
    <span
      className={cn("inline-flex items-center gap-1.5 rounded-full border font-bold uppercase tracking-wider", sizeCls)}
      style={m.style}
    >
      <m.Icon className={iconCls} aria-hidden="true" />
      {m.label}
    </span>
  );
}
