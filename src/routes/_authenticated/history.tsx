import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useI18n } from "@/lib/i18n";
import { StatusBadge, type Status } from "@/components/StatusBadge";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/history")({
  component: HistoryPage,
});

function HistoryPage() {
  const { t } = useI18n();
  const { user } = Route.useRouteContext();
  const [filter, setFilter] = useState<"all" | Status>("all");

  const q = useQuery({
    queryKey: ["history", user.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("analyses")
        .select("id, title, status, type, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      return data ?? [];
    },
  });

  const items = (q.data ?? []).filter((a) => filter === "all" || a.status === filter);

  const filters: Array<{ k: "all" | Status; label: string }> = [
    { k: "all", label: t("history.filter.all") },
    { k: "safe", label: t("result.safe") },
    { k: "warning", label: t("result.warning") },
    { k: "danger", label: t("result.danger") },
  ];

  return (
    <div className="container-x anim-rise py-10 md:py-14">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <h1 className="font-serif text-4xl text-foreground">{t("history.title")}</h1>
        <div className="inline-flex rounded-full border border-border bg-surface p-0.5">
          {filters.map((f) => (
            <button key={f.k} onClick={() => setFilter(f.k)} className={cn("rounded-full px-3.5 py-1.5 text-xs font-medium", filter === f.k ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground")}>
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-surface p-16 text-center text-sm text-muted-foreground">
          {t("history.empty")}
        </div>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((a) => (
            <li key={a.id}>
              <Link to="/analysis/$id" params={{ id: a.id }} className="block h-full rounded-2xl border border-border bg-surface p-5 transition-shadow hover:shadow-[0_10px_30px_-15px_oklch(0.3_0.06_255_/_0.3)]">
                <div className="mb-4 flex items-start justify-between gap-3">
                  <p className="font-serif text-lg leading-tight text-foreground">{a.title ?? "—"}</p>
                  <StatusBadge status={a.status as Status} size="sm" />
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="uppercase tracking-wider">{a.type === "meal" ? t("analyze.type.meal") : t("analyze.type.product")}</span>
                  <span>{new Date(a.created_at).toLocaleDateString()}</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
