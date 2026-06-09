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
        color: "#ffffff",
        background: "linear-gradient(135deg, #00ff88 0%, #00cc66 100%)",
        borderColor: "#00ff88",
        boxShadow: "0 0 12px -2px #00ff88, inset 0 0 8px -2px rgba(255,255,255,0.3)",
      },
    },
    warning: {
      label: t("result.warning"),
      Icon: AlertTriangle,
      style: {
        color: "#ffffff",
        background: "linear-gradient(135deg, #ff9500 0%, #ff6a00 100%)",
        borderColor: "#ff9500",
        boxShadow: "0 0 12px -2px #ff9500, inset 0 0 8px -2px rgba(255,255,255,0.3)",
      },
    },
    danger: {
      label: t("result.danger"),
      Icon: ShieldAlert,
      style: {
        color: "#ffffff",
        background: "linear-gradient(135deg, #ff3366 0%, #cc0033 100%)",
        borderColor: "#ff3366",
        boxShadow: "0 0 12px -2px #ff3366, inset 0 0 8px -2px rgba(255,255,255,0.3)",
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
