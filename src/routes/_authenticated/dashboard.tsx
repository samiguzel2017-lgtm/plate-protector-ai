import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useI18n } from "@/lib/i18n";
import { Disclaimer } from "@/components/Disclaimer";
import { StatusBadge, type Status } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Camera, ArrowRight, Lightbulb, HeartPulse, Plus } from "lucide-react";

export const Route = createFileRoute("/_authenticated/dashboard")({
  component: Dashboard,
});

function Dashboard() {
  const { t } = useI18n();
  const { user } = Route.useRouteContext();

  const profileQ = useQuery({
    queryKey: ["dash-profile"],
    queryFn: async () => {
      const [{ data: p }, { data: hp }, { data: list }] = await Promise.all([
        supabase.from("profiles").select("display_name").eq("id", user.id).maybeSingle(),
        supabase.from("health_profiles").select("allergies, conditions, diet_preferences").eq("user_id", user.id).maybeSingle(),
        supabase.from("analyses").select("id, title, status, created_at, type").eq("user_id", user.id).order("created_at", { ascending: false }).limit(5),
      ]);
      return { profile: p, health: hp, analyses: list ?? [] };
    },
  });

  const displayName = profileQ.data?.profile?.display_name ?? user.email?.split("@")[0] ?? "";
  const hp = profileQ.data?.health;
  const hpEmpty = !hp || (!hp.allergies?.length && !hp.conditions?.length && !hp.diet_preferences?.length);
  const analyses = profileQ.data?.analyses ?? [];

  return (
    <div className="container-x py-10 md:py-14">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm text-muted-foreground">{t("dash.welcome")}</p>
          <h1 className="mt-1 font-serif text-4xl text-foreground">{displayName}</h1>
        </div>
        <Link to="/analyze">
          <Button className="rounded-full">
            <Camera className="mr-1.5 h-4 w-4" />
            {t("dash.quick.cta")}
          </Button>
        </Link>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.6fr_1fr]">
        {/* Left: quick analyze + recent */}
        <div className="space-y-5">
          <Link to="/analyze" className="group block overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-primary to-[oklch(0.28_0.07_255)] p-7 text-primary-foreground transition-shadow hover:shadow-[0_24px_50px_-24px_oklch(0.28_0.07_255_/_0.6)]">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-xs uppercase tracking-widest opacity-70">{t("dash.quick.t")}</p>
                <h2 className="font-serif text-2xl">{t("dash.quick.d")}</h2>
              </div>
              <span className="rounded-full bg-primary-foreground/15 p-3 transition-transform group-hover:translate-x-1">
                <ArrowRight className="h-5 w-5" />
              </span>
            </div>
          </Link>

          <div className="rounded-2xl border border-border bg-surface">
            <div className="flex items-center justify-between border-b border-border p-5">
              <h3 className="font-serif text-xl text-foreground">{t("dash.recent.t")}</h3>
              <Link to="/history" className="text-xs text-muted-foreground hover:text-foreground">{t("dash.recent.view")}</Link>
            </div>
            <ul className="divide-y divide-border">
              {analyses.length === 0 && (
                <li className="p-6 text-sm text-muted-foreground">{t("dash.recent.empty")}</li>
              )}
              {analyses.map((a: any) => (
                <li key={a.id}>
                  <Link to="/analysis/$id" params={{ id: a.id }} className="flex items-center justify-between gap-3 p-4 hover:bg-surface-muted/60">
                    <div className="min-w-0">
                      <p className="truncate font-medium text-foreground">{a.title ?? t("result.summary")}</p>
                      <p className="text-xs text-muted-foreground">{new Date(a.created_at).toLocaleString()}</p>
                    </div>
                    <StatusBadge status={a.status as Status} />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right: profile + tip */}
        <div className="space-y-5">
          <div className="rounded-2xl border border-border bg-surface p-6">
            <div className="mb-4 flex items-center gap-2">
              <HeartPulse className="h-4 w-4 text-[oklch(0.55_0.12_148)]" />
              <h3 className="font-serif text-xl text-foreground">{t("dash.profile.t")}</h3>
            </div>
            {hpEmpty ? (
              <>
                <p className="text-sm text-muted-foreground">{t("dash.profile.empty")}</p>
                <Link to="/profile"><Button variant="outline" size="sm" className="mt-4 rounded-full"><Plus className="mr-1 h-3.5 w-3.5" />{t("dash.profile.edit")}</Button></Link>
              </>
            ) : (
              <div className="space-y-3 text-sm">
                <Row label={t("prof.allergies")} items={hp.allergies ?? []} />
                <Row label={t("prof.conditions")} items={hp.conditions ?? []} />
                <Row label={t("prof.diet")} items={hp.diet_preferences ?? []} />
                <Link to="/profile" className="inline-flex text-xs text-[oklch(0.4_0.08_240)] hover:underline">{t("dash.profile.edit")}</Link>
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-border bg-surface-muted/60 p-6">
            <div className="mb-2 flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-[oklch(0.6_0.14_85)]" />
              <h3 className="font-medium text-foreground">{t("dash.tip.t")}</h3>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">{t("dash.tip.d")}</p>
          </div>

          <Disclaimer />
        </div>
      </div>
    </div>
  );
}

function Row({ label, items }: { label: string; items: string[] }) {
  return (
    <div>
      <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
      <div className="mt-1 flex flex-wrap gap-1.5">
        {items.length === 0 ? (
          <span className="text-xs text-muted-foreground">—</span>
        ) : (
          items.map((i) => (
            <span key={i} className="rounded-full bg-secondary px-2 py-0.5 text-xs text-secondary-foreground">{i}</span>
          ))
        )}
      </div>
    </div>
  );
}
