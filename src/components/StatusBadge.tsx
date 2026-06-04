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
      cls: "bg-safe-soft text-[oklch(0.4_0.12_148)] border-[oklch(0.78_0.12_148)]",
    },
    warning: {
      label: t("result.warning"),
      Icon: AlertTriangle,
      cls: "bg-warning-soft text-[oklch(0.4_0.1_75)] border-[oklch(0.82_0.14_85)]",
    },
    danger: {
      label: t("result.danger"),
      Icon: ShieldAlert,
      cls: "bg-danger-soft text-[oklch(0.45_0.18_27)] border-[oklch(0.7_0.18_27)]",
    },
  } as const;
  const m = map[status];
  const sizeCls = size === "lg" ? "px-4 py-2 text-sm" : size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-xs";
  const iconCls = size === "lg" ? "h-4 w-4" : size === "sm" ? "h-3 w-3" : "h-3.5 w-3.5";
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full border font-medium uppercase tracking-wide", sizeCls, m.cls)}>
      <m.Icon className={iconCls} aria-hidden="true" />
      {m.label}
    </span>
  );
}
