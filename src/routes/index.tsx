import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Disclaimer } from "@/components/Disclaimer";
import { useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { ArrowRight, Camera, HeartPulse, ShieldCheck, History, Star, Flame, Wheat, Droplet, Beef, Activity, Plus, Minus, ScanLine } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Alentra AI — Fotoğrafını Çek, Sağlığını Koru" },
      { name: "description", content: "Kişisel sağlık profiline göre gıda analizi. Etiketi veya yemeği fotoğraflayın, saniyeler içinde güvenli/dikkat/uygun değil kararını alın." },
    ],
  }),
  component: Landing,
});

function Landing() {
  const { t } = useI18n();
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main>
        {/* HERO */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-x-0 top-0 -z-10 h-[620px] bg-[radial-gradient(70%_60%_at_50%_0%,oklch(0.94_0.04_220)_0%,transparent_70%)]" />
          <div className="container-x grid gap-10 pt-12 pb-20 lg:grid-cols-[1.1fr_1fr] lg:gap-14 lg:pt-20">
            <div className="space-y-7">
              <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                <div className="flex -space-x-1.5">
                  {[0,1,2,3].map((i) => (
                    <div key={i} className="h-6 w-6 rounded-full border-2 border-background bg-gradient-to-br from-[oklch(0.85_0.08_220)] to-[oklch(0.75_0.1_148)]" />
                  ))}
                </div>
                <span>{t("hero.social")}</span>
                <span className="inline-flex items-center gap-0.5 text-[oklch(0.75_0.15_85)]">
                  {[0,1,2,3,4].map((i) => (
                    <Star key={i} className="h-3 w-3 fill-current" />
                  ))}
                </span>
                <span className="text-foreground">4.9</span>
              </div>

              <h1 className="font-serif text-5xl leading-[1.02] tracking-tight text-foreground md:text-6xl lg:text-7xl">
                {t("hero.title")}
              </h1>
              <p className="max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
                {t("hero.sub")}
              </p>

              <div className="flex flex-wrap items-center gap-3">
                <Link to="/auth">
                  <Button size="lg" className="rounded-full">
                    {t("cta.start")}
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </Link>
                <a href="#how">
                  <Button size="lg" variant="ghost" className="rounded-full">{t("cta.learn")}</Button>
                </a>
              </div>

              <Disclaimer className="max-w-xl" />
            </div>

            <div className="relative flex items-center justify-center">
              <div className="absolute -inset-6 -z-10 rounded-[3rem] bg-gradient-to-br from-[oklch(0.94_0.03_220)] to-[oklch(0.96_0.06_148)] blur-2xl opacity-70" />
              <PhoneMockup />
              <NutritionFloat />
              <IngredientBubble label="Kalori" value="615" icon={Flame} className="-left-2 top-8 hidden md:flex" />
              <IngredientBubble label="Protein" value="11g" icon={Beef} className="-left-4 bottom-32 hidden md:flex" />
            </div>
          </div>
        </section>


        {/* FEATURES */}
        <section id="features" className="container-x py-20">
          <div className="mb-12 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <h2 className="font-serif text-3xl text-foreground md:text-4xl">{t("feat.title")}</h2>
            <p className="max-w-md text-sm text-muted-foreground">{t("brand.tagline")}</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <FeatureCard icon={HeartPulse} t={t("feat.profile.t")} d={t("feat.profile.d")} />
            <FeatureCard icon={Camera} t={t("feat.scan.t")} d={t("feat.scan.d")} />
            <FeatureCard icon={ShieldCheck} t={t("feat.result.t")} d={t("feat.result.d")} />
            <FeatureCard icon={History} t={t("feat.history.t")} d={t("feat.history.d")} />
          </div>
        </section>

        {/* HOW */}
        <section id="how" className="border-y border-border bg-surface-muted/40 py-20">
          <div className="container-x">
            <h2 className="mb-12 font-serif text-3xl text-foreground md:text-4xl">{t("how.title")}</h2>
            <div className="grid gap-px overflow-hidden rounded-2xl border border-border bg-border md:grid-cols-3">
              {[1, 2, 3].map((n) => (
                <div key={n} className="bg-surface p-8">
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary font-serif text-lg text-primary-foreground">{n}</div>
                  <h3 className="font-serif text-xl text-foreground">{t(`how.${n}.t`)}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t(`how.${n}.d`)}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="container-x py-20">
          <div className="overflow-hidden rounded-3xl bg-primary p-10 text-primary-foreground md:p-16">
            <div className="grid gap-8 md:grid-cols-[1.4fr_1fr] md:items-end">
              <div>
                <h2 className="font-serif text-3xl leading-tight md:text-5xl">{t("brand.tagline")}</h2>
                <p className="mt-3 max-w-lg text-sm opacity-80">{t("hero.sub")}</p>
              </div>
              <div className="md:text-right">
                <Link to="/auth">
                  <Button size="lg" variant="secondary" className="rounded-full">
                    {t("nav.getstarted")}
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

function FeatureCard({ icon: Icon, t, d }: { icon: any; t: string; d: string }) {
  return (
    <div className="group rounded-2xl border border-border bg-surface p-6 transition-colors hover:border-[oklch(0.7_0.08_230)]">
      <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-primary">
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="font-serif text-xl text-foreground">{t}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{d}</p>
    </div>
  );
}

function HeroCard() {
  return (
    <div className="relative rounded-3xl border border-border bg-surface p-6 shadow-[0_30px_60px_-30px_oklch(0.3_0.06_255_/_0.35)]">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div>
          <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Analiz</p>
          <p className="mt-0.5 font-serif text-xl text-foreground">Tam Buğday Bisküvi</p>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-[oklch(0.82_0.14_85)] bg-warning-soft px-2.5 py-1 text-[11px] font-medium uppercase tracking-wide text-[oklch(0.4_0.1_75)]">
          <span className="h-1.5 w-1.5 rounded-full bg-[oklch(0.65_0.18_75)]" />
          Dikkat
        </span>
      </div>
      <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
        <Stat label="Kalori" value="142 kcal" />
        <Stat label="Şeker" value="8.4 g" />
        <Stat label="Gluten" value="Var" tone="danger" />
        <Stat label="Laktoz" value="Yok" tone="safe" />
      </dl>
      <div className="mt-5 space-y-2 border-t border-border pt-5">
        <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Profil eşleşmesi</p>
        <ul className="space-y-1.5 text-sm">
          <li className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[oklch(0.65_0.18_75)]" />
            <span className="text-foreground">Gluten içerir — Çölyak profili</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[oklch(0.55_0.16_148)]" />
            <span className="text-muted-foreground">Laktoz tespit edilmedi</span>
          </li>
        </ul>
      </div>
    </div>
  );
}

function Stat({ label, value, tone }: { label: string; value: string; tone?: "safe" | "danger" }) {
  return (
    <div className="rounded-xl border border-border bg-surface-muted/60 px-3 py-2.5">
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className={`mt-0.5 font-medium ${tone === "danger" ? "text-[oklch(0.5_0.18_27)]" : tone === "safe" ? "text-[oklch(0.4_0.14_148)]" : "text-foreground"}`}>{value}</p>
    </div>
  );
}
