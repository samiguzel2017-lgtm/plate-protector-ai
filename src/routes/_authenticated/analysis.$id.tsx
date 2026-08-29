import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useI18n } from "@/lib/i18n";
import { StatusBadge, type Status } from "@/components/StatusBadge";
import { Disclaimer } from "@/components/Disclaimer";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/_authenticated/analysis/$id")({
  component: AnalysisDetail,
});

function AnalysisDetail() {
  const { t } = useI18n();
  const { id } = Route.useParams();
  const { user } = Route.useRouteContext();
  const [imgUrl, setImgUrl] = useState<string | null>(null);

  const q = useQuery({
    queryKey: ["analysis", id],
    queryFn: async () => {
      const { data, error } = await supabase.from("analyses").select("*").eq("id", id).eq("user_id", user.id).maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    if (q.data?.image_url) {
      supabase.storage.from("food-images").createSignedUrl(q.data.image_url, 3600).then(({ data }) => {
        if (data?.signedUrl) setImgUrl(data.signedUrl);
      });
    }
  }, [q.data?.image_url]);

  if (q.isLoading) return <div className="container-x py-20 text-center text-muted-foreground">{t("common.loading")}</div>;
  if (!q.data) return <div className="container-x py-20 text-center text-muted-foreground">—</div>;

  const r = q.data.result as any;

  return (
    <div className="container-x anim-rise py-10 md:py-14">
      <Link to="/dashboard" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> {t("result.back")}
      </Link>

      <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        {/* Image + status */}
        <div className="space-y-4">
          <div className="overflow-hidden rounded-2xl border border-border bg-surface-muted">
            {imgUrl ? <img src={imgUrl} alt={q.data.title ?? ""} className="w-full object-cover" /> : <div className="aspect-square animate-pulse bg-surface-muted" />}
          </div>
          <div className="rounded-2xl border border-border bg-surface p-5">
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs uppercase tracking-widest text-muted-foreground">{new Date(q.data.created_at).toLocaleString()}</p>
              <StatusBadge status={q.data.status as Status} size="lg" />
            </div>
            <h1 className="mt-3 font-serif text-3xl text-foreground">{q.data.title ?? r?.title}</h1>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{r?.summary}</p>
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-5">
          <Section title={t("result.ingredients")} items={r?.ingredients ?? []} />
          <Section title={t("result.allergens")} items={r?.allergens_detected ?? []} tone="danger" />
          <Section title={t("result.risks")} items={r?.risks ?? []} tone="warning" />
          <Section title={t("result.recommendations")} items={r?.recommendations ?? []} />

          {r?.nutrition_estimate && (
            <div className="rounded-2xl border border-border bg-surface p-6">
              <h3 className="mb-4 font-serif text-lg text-foreground">{t("result.nutrition")}</h3>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <NutritionTile label={t("result.calories")} value={r.nutrition_estimate.calories} />
                <NutritionTile label={t("result.protein")} value={r.nutrition_estimate.protein} />
                <NutritionTile label={t("result.carbs")} value={r.nutrition_estimate.carbs} />
                <NutritionTile label={t("result.fat")} value={r.nutrition_estimate.fat} />
              </div>
            </div>
          )}

          <Disclaimer />
        </div>
      </div>
    </div>
  );
}

function Section({ title, items, tone }: { title: string; items: string[]; tone?: "danger" | "warning" }) {
  const { t } = useI18n();
  return (
    <div className="rounded-2xl border border-border bg-surface p-6">
      <h3 className="mb-3 font-serif text-lg text-foreground">{title}</h3>
      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">{t("result.none")}</p>
      ) : (
        <ul className="space-y-2">
          {items.map((it, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm">
              <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${tone === "danger" ? "bg-danger" : tone === "warning" ? "bg-warning" : "bg-safe"}`} />
              <span className="text-foreground">{it}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function NutritionTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-surface-muted/60 p-3">
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-1 font-serif text-lg text-foreground">{value}</p>
    </div>
  );
}
