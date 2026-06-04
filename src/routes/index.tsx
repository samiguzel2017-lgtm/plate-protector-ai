import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Disclaimer } from "@/components/Disclaimer";
import { useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Camera,
  HeartPulse,
  ShieldCheck,
  History,
  Sparkles,
  Activity,
  Zap,
  Check,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Alentra AI — Fotoğrafını Çek, Sağlığını Koru" },
      {
        name: "description",
        content:
          "Kişisel sağlık profiline göre gıda analizi. Etiketi veya yemeği fotoğraflayın, saniyeler içinde güvenli/dikkat/uygun değil kararını alın.",
      },
    ],
  }),
  component: Landing,
});

// Modern Editorial Organic palette
const CANVAS = "oklch(0.985 0.012 92)";
const INK = "oklch(0.22 0.04 152)";
const MOSS = "oklch(0.42 0.08 152)";
const MOSS_DEEP = "oklch(0.32 0.07 152)";
const SAGE_SOFT = "oklch(0.94 0.022 140)";
const SAGE_LINE = "oklch(0.88 0.028 140)";
const SAGE_MUTED = "oklch(0.5 0.04 150)";
const LIME = "oklch(0.78 0.18 130)";
const EMBER = "oklch(0.68 0.16 35)";

function Landing() {
  const { t } = useI18n();
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main>
        {/* HERO — Modern Editorial Organic */}
        <section className="relative overflow-hidden" style={{ backgroundColor: CANVAS }}>
          {/* Background mesh */}
          <div
            className="pointer-events-none absolute inset-0 -z-10"
            style={{
              background: `radial-gradient(60% 50% at 80% 20%, ${SAGE_SOFT} 0%, transparent 60%), radial-gradient(45% 40% at 10% 80%, oklch(0.92 0.05 130 / 0.5) 0%, transparent 60%)`,
            }}
          />
          {/* Subtle grid */}
          <div
            className="pointer-events-none absolute inset-0 -z-10 opacity-[0.04]"
            style={{
              backgroundImage:
                "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
              backgroundSize: "56px 56px",
              color: INK,
              maskImage: "radial-gradient(ellipse at center, black 40%, transparent 80%)",
            }}
          />

          <div className="container-x grid items-center gap-14 pt-14 pb-24 lg:grid-cols-12 lg:gap-10 lg:pt-24">
            {/* Content */}
            <div className="z-10 lg:col-span-6">
              {/* Live status chip */}
              <div
                className="mb-8 inline-flex items-center gap-2.5 rounded-full border bg-white/60 py-1.5 pl-2 pr-4 backdrop-blur-md"
                style={{ borderColor: SAGE_LINE }}
              >
                <span
                  className="flex h-6 w-6 items-center justify-center rounded-full"
                  style={{ backgroundColor: MOSS }}
                >
                  <Sparkles className="h-3 w-3" style={{ color: LIME }} />
                </span>
                <span
                  className="text-[11px] font-semibold uppercase tracking-[0.12em]"
                  style={{ color: MOSS_DEEP }}
                >
                  AI · v2.4 · {t("hero.social")}
                </span>
              </div>

              <h1
                className="mb-6 text-[3.25rem] font-bold leading-[0.95] tracking-[-0.03em] md:text-7xl lg:text-[5.25rem]"
                style={{ color: INK, fontFamily: "var(--font-serif)" }}
              >
                Beslenme
                <br />
                <span className="italic font-normal" style={{ color: MOSS }}>
                  bilincinizi
                </span>{" "}
                <span className="relative inline-block">
                  yeniden
                  <span
                    className="absolute -bottom-1 left-0 h-[6px] w-full rounded-full"
                    style={{ background: `linear-gradient(90deg, ${LIME}, transparent)` }}
                  />
                </span>
                <br />
                tanımlayın.
              </h1>

              <p
                className="mb-10 max-w-lg text-base leading-relaxed md:text-lg"
                style={{ color: SAGE_MUTED }}
              >
                {t("hero.sub")}
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-4">
                <Link to="/auth">
                  <Button
                    size="lg"
                    className="group h-14 rounded-full px-7 text-base font-semibold shadow-[0_18px_40px_-14px_oklch(0.32_0.07_152_/_0.45)] transition-transform hover:-translate-y-0.5"
                    style={{ backgroundColor: INK, color: CANVAS }}
                  >
                    {t("cta.start")}
                    <span
                      className="ml-2 flex h-8 w-8 items-center justify-center rounded-full transition-transform group-hover:rotate-45"
                      style={{ backgroundColor: LIME, color: INK }}
                    >
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </Button>
                </Link>
                <a
                  href="#how"
                  className="group flex items-center gap-3 rounded-full border bg-white/40 py-3 pl-3 pr-5 font-medium backdrop-blur-sm transition-colors hover:bg-white/80"
                  style={{ color: INK, borderColor: SAGE_LINE }}
                >
                  <span
                    className="flex h-8 w-8 items-center justify-center rounded-full"
                    style={{ backgroundColor: SAGE_SOFT, color: MOSS_DEEP }}
                  >
                    <Activity className="h-3.5 w-3.5" />
                  </span>
                  <span className="text-sm">{t("cta.learn")}</span>
                </a>
              </div>

              {/* Trust strip */}
              <div className="mt-10 grid max-w-lg grid-cols-3 gap-6 border-t pt-6" style={{ borderColor: SAGE_LINE }}>
                {[
                  { k: "10K+", v: "Aktif kullanıcı" },
                  { k: "2.4M", v: "Analiz" },
                  { k: "99.2%", v: "Doğruluk" },
                ].map((s) => (
                  <div key={s.k}>
                    <div className="text-2xl font-bold tracking-tight" style={{ color: INK }}>
                      {s.k}
                    </div>
                    <div className="mt-0.5 text-[11px] uppercase tracking-wider" style={{ color: SAGE_MUTED }}>
                      {s.v}
                    </div>
                  </div>
                ))}
              </div>

              <Disclaimer className="mt-8 max-w-lg" />
            </div>

            {/* Visual */}
            <div className="relative flex items-center justify-center lg:col-span-6">
              {/* Outer glow */}
              <div
                className="pointer-events-none absolute inset-0 -z-10 mx-auto h-[560px] w-[560px] rounded-full opacity-60 blur-[100px]"
                style={{ background: `radial-gradient(circle, ${LIME} 0%, transparent 70%)` }}
              />

              {/* Orbit ring */}
              <div
                className="pointer-events-none absolute h-[480px] w-[480px] rounded-full border border-dashed"
                style={{ borderColor: SAGE_LINE }}
              />

              {/* Floating: AI Live */}
              <div
                className="animate-bounce-slow absolute -left-4 top-6 z-20 flex items-center gap-2.5 rounded-full border bg-white/85 py-2 pl-2 pr-4 shadow-xl backdrop-blur-xl md:-left-10"
                style={{ borderColor: SAGE_LINE }}
              >
                <span className="relative flex h-7 w-7 items-center justify-center rounded-full" style={{ backgroundColor: MOSS }}>
                  <Zap className="h-3.5 w-3.5" style={{ color: LIME }} />
                  <span className="absolute inset-0 animate-ping rounded-full opacity-40" style={{ backgroundColor: MOSS }} />
                </span>
                <div>
                  <div className="text-[10px] uppercase tracking-wider" style={{ color: SAGE_MUTED }}>
                    AI Tarama
                  </div>
                  <div className="text-xs font-bold leading-tight" style={{ color: INK }}>
                    1.2s · 24 içerik
                  </div>
                </div>
              </div>

              {/* Floating: Macro */}
              <ModernFloat
                className="absolute -right-4 top-28 z-20 animate-bounce-slow-delay md:-right-8"
                accent={MOSS}
                label="Protein"
                value="24.5"
                unit="g"
                bar={72}
              />

              {/* Floating: Calorie */}
              <ModernFloat
                className="absolute -left-2 bottom-24 z-20 animate-bounce-slow-delay md:-left-12"
                accent={EMBER}
                label="Kalori"
                value="482"
                unit="kcal"
                bar={48}
              />

              {/* Floating: Safe badge */}
              <div
                className="absolute -right-2 bottom-16 z-20 flex items-center gap-2 rounded-2xl border bg-white/85 px-3 py-2.5 shadow-xl backdrop-blur-xl md:-right-6"
                style={{ borderColor: SAGE_LINE }}
              >
                <span
                  className="flex h-8 w-8 items-center justify-center rounded-xl"
                  style={{ backgroundColor: LIME }}
                >
                  <Check className="h-4 w-4" strokeWidth={3} style={{ color: MOSS_DEEP }} />
                </span>
                <div>
                  <div className="text-[10px] uppercase tracking-wider" style={{ color: SAGE_MUTED }}>
                    Profil uyumu
                  </div>
                  <div className="text-xs font-bold" style={{ color: INK }}>
                    Güvenli
                  </div>
                </div>
              </div>

              <PhoneMockup />
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
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary font-serif text-lg text-primary-foreground">
                    {n}
                  </div>
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

      <style>{`
        @keyframes scanLine { 0%,100% { top: 16%; opacity: .5; } 50% { top: 72%; opacity: 1; } }
        @keyframes bounceSlow { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        @keyframes spinSlow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-scan-line { animation: scanLine 3s ease-in-out infinite; }
        .animate-bounce-slow { animation: bounceSlow 4.5s ease-in-out infinite; }
        .animate-bounce-slow-delay { animation: bounceSlow 4.5s ease-in-out .8s infinite; }
        .animate-spin-slow { animation: spinSlow 40s linear infinite; }
      `}</style>
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

function ModernFloat({
  className = "",
  accent,
  label,
  value,
  unit,
  bar,
}: {
  className?: string;
  accent: string;
  label: string;
  value: string;
  unit: string;
  bar: number;
}) {
  return (
    <div
      className={`w-[180px] rounded-2xl border bg-white/85 p-4 shadow-xl backdrop-blur-xl ${className}`}
      style={{ borderColor: SAGE_LINE }}
    >
      <div className="mb-2 flex items-center justify-between">
        <span
          className="text-[10px] font-bold uppercase tracking-[0.14em]"
          style={{ color: accent }}
        >
          {label}
        </span>
        <span
          className="h-1.5 w-1.5 rounded-full"
          style={{ backgroundColor: accent, boxShadow: `0 0 8px ${accent}` }}
        />
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-3xl font-bold tracking-tight" style={{ color: INK }}>
          {value}
        </span>
        <span className="text-xs font-medium" style={{ color: SAGE_MUTED }}>
          {unit}
        </span>
      </div>
      <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full" style={{ backgroundColor: SAGE_SOFT }}>
        <div className="h-full rounded-full" style={{ width: `${bar}%`, backgroundColor: accent }} />
      </div>
    </div>
  );
}

function PhoneMockup() {
  return (
    <div
      className="relative h-[600px] w-[300px] rounded-[3.2rem] p-2 shadow-[0_50px_120px_-30px_oklch(0.22_0.04_152_/_0.5)]"
      style={{
        background: `linear-gradient(160deg, ${INK} 0%, ${MOSS_DEEP} 100%)`,
      }}
    >
      <div className="relative h-full w-full overflow-hidden rounded-[2.7rem] bg-black">
        {/* Dynamic Island */}
        <div
          className="absolute left-1/2 top-2 z-40 h-7 w-28 -translate-x-1/2 rounded-full bg-black"
        />
        {/* Food image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=600')",
          }}
        />
        {/* Top scrim */}
        <div className="absolute inset-x-0 top-0 z-10 h-32 bg-gradient-to-b from-black/55 to-transparent" />

        {/* Top bar */}
        <div className="absolute inset-x-0 top-12 z-20 flex items-center justify-between px-5">
          <div className="rounded-full border border-white/25 bg-white/15 px-3 py-1 text-[10px] font-medium uppercase tracking-wider text-white backdrop-blur-md">
            Gıda Tarama
          </div>
          <div className="flex h-7 w-7 items-center justify-center rounded-full border border-white/25 bg-white/15 backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5 text-white" />
          </div>
        </div>

        {/* Target brackets */}
        <div className="absolute left-10 right-10 top-24 bottom-[260px] rounded-3xl border-[1.5px] border-white/40">
          <span className="absolute -left-px -top-px h-7 w-7 border-l-[3px] border-t-[3px]" style={{ borderColor: LIME }} />
          <span className="absolute -right-px -top-px h-7 w-7 border-r-[3px] border-t-[3px]" style={{ borderColor: LIME }} />
          <span className="absolute -bottom-px -left-px h-7 w-7 border-b-[3px] border-l-[3px]" style={{ borderColor: LIME }} />
          <span className="absolute -bottom-px -right-px h-7 w-7 border-b-[3px] border-r-[3px]" style={{ borderColor: LIME }} />
          {/* Scan line */}
          <div
            className="animate-scan-line absolute inset-x-2 h-[2px]"
            style={{
              background: `linear-gradient(90deg, transparent, ${LIME}, transparent)`,
              boxShadow: `0 0 20px ${LIME}`,
            }}
          />
        </div>

        {/* Analysis result panel */}
        <div className="absolute inset-x-0 bottom-0 z-30 rounded-t-[2rem] bg-white/95 p-5 backdrop-blur-2xl">
          <div className="mx-auto mb-4 h-1 w-10 rounded-full" style={{ backgroundColor: SAGE_LINE }} />

          <div className="mb-4 flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p
                className="mb-0.5 text-[9px] font-bold uppercase tracking-[0.16em]"
                style={{ color: MOSS }}
              >
                Anlık Sonuç
              </p>
              <h3 className="truncate font-serif text-lg font-bold leading-tight" style={{ color: INK }}>
                Kinoalı Izgara Somon
              </h3>
            </div>
            <span
              className="flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold"
              style={{ backgroundColor: LIME, color: MOSS_DEEP }}
            >
              <Check className="h-3 w-3" strokeWidth={3} />
              92/100
            </span>
          </div>

          {/* Macro bars */}
          <div className="space-y-2.5">
            {[
              { l: "Karbonhidrat", v: "18g", p: 35, c: EMBER },
              { l: "Protein", v: "32g", p: 78, c: MOSS },
              { l: "Doymuş Yağ", v: "4.2g", p: 22, c: "oklch(0.68 0.14 250)" },
            ].map((m) => (
              <div key={m.l}>
                <div className="mb-1 flex items-center justify-between text-[10px]">
                  <span style={{ color: SAGE_MUTED }}>{m.l}</span>
                  <span className="font-bold" style={{ color: INK }}>
                    {m.v}
                  </span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full" style={{ backgroundColor: SAGE_SOFT }}>
                  <div className="h-full rounded-full" style={{ width: `${m.p}%`, backgroundColor: m.c }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
