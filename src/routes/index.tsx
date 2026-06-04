import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Disclaimer } from "@/components/Disclaimer";
import { useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { ArrowRight, Camera, HeartPulse, ShieldCheck, History, Play } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Alentra AI — Fotoğrafını Çek, Sağlığını Koru" },
      { name: "description", content: "Kişisel sağlık profiline göre gıda analizi. Etiketi veya yemeği fotoğraflayın, saniyeler içinde güvenli/dikkat/uygun değil kararını alın." },
    ],
  }),
  component: Landing,
});

// Editorial Organic palette (hero only)
const CREAM = "oklch(0.985 0.012 92)";
const INK = "oklch(0.28 0.04 152)";
const MOSS = "oklch(0.38 0.06 152)";
const SAGE_SOFT = "oklch(0.92 0.025 140)";
const SAGE_LINE = "oklch(0.87 0.03 140)";
const SAGE_MUTED = "oklch(0.55 0.04 150)";
const SAGE_DOT_1 = "oklch(0.72 0.05 145)";
const SAGE_DOT_2 = "oklch(0.78 0.07 140)";
const SAGE_DOT_3 = "oklch(0.55 0.1 145)";
const EMBER = "oklch(0.68 0.16 35)";

function Landing() {
  const { t } = useI18n();
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main>
        {/* HERO — Editorial Organic */}
        <section className="relative overflow-hidden" style={{ backgroundColor: CREAM }}>
          <div className="container-x grid items-center gap-12 pt-14 pb-24 lg:grid-cols-12 lg:gap-10 lg:pt-20">
            {/* Content */}
            <div className="z-10 lg:col-span-6">
              <div
                className="mb-8 inline-flex items-center gap-2 rounded-full border px-3 py-1"
                style={{ backgroundColor: SAGE_SOFT, borderColor: SAGE_LINE }}
              >
                <div className="flex -space-x-2">
                  <span className="h-6 w-6 rounded-full border-2" style={{ background: SAGE_DOT_1, borderColor: CREAM }} />
                  <span className="h-6 w-6 rounded-full border-2" style={{ background: SAGE_DOT_2, borderColor: CREAM }} />
                  <span className="h-6 w-6 rounded-full border-2" style={{ background: SAGE_DOT_3, borderColor: CREAM }} />
                </div>
                <span className="text-[11px] font-medium uppercase tracking-tight" style={{ color: MOSS }}>
                  {t("hero.social")}
                </span>
              </div>

              <h1
                className="mb-7 font-serif text-5xl font-bold leading-[1.05] tracking-tight md:text-6xl lg:text-7xl"
                style={{ color: INK }}
              >
                Beslenme <br />
                <span className="font-normal italic">bilincinizi</span> <br />
                yeniden tanımlayın.
              </h1>

              <p className="mb-9 max-w-lg text-base leading-relaxed md:text-lg" style={{ color: SAGE_MUTED }}>
                {t("hero.sub")}
              </p>

              <div className="flex flex-wrap items-center gap-5">
                <Link to="/auth">
                  <Button
                    size="lg"
                    className="group rounded-full px-7 shadow-lg"
                    style={{ backgroundColor: MOSS, color: CREAM }}
                  >
                    {t("cta.start")}
                    <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
                <a href="#how" className="group flex items-center gap-3 font-medium" style={{ color: MOSS }}>
                  <span
                    className="flex h-10 w-10 items-center justify-center rounded-full border transition-colors group-hover:bg-[oklch(0.92_0.025_140)]"
                    style={{ borderColor: SAGE_LINE }}
                  >
                    <Play className="h-3.5 w-3.5 fill-current" />
                  </span>
                  {t("cta.learn")}
                </a>
              </div>

              <Disclaimer className="mt-8 max-w-lg" />
            </div>

            {/* Visual */}
            <div className="relative flex justify-center lg:col-span-6">
              {/* Floating card: Protein */}
              <FloatCard
                className="absolute -left-2 top-10 z-20 animate-bounce-slow md:-left-8"
                accent={MOSS}
                label="Protein"
                value="24.5"
                unit="gram"
              />
              {/* Floating card: Kalori */}
              <FloatCard
                className="absolute -right-2 top-1/2 z-20 animate-bounce-slow-delay md:-right-6"
                accent={EMBER}
                label="Kalori"
                value="482"
                unit="kcal"
              />

              <div className="relative">
                {/* Glow */}
                <div
                  className="pointer-events-none absolute inset-0 -z-10 rounded-full opacity-50 blur-[110px]"
                  style={{ background: SAGE_DOT_2 }}
                />
                <PhoneMockup />
              </div>
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

      <style>{`
        @keyframes scanLine { 0%,100% { top: 18%; opacity: .55; } 50% { top: 78%; opacity: 1; } }
        @keyframes bounceSlow { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-12px); } }
        .animate-scan-line { animation: scanLine 3s ease-in-out infinite; }
        .animate-bounce-slow { animation: bounceSlow 4s ease-in-out infinite; }
        .animate-bounce-slow-delay { animation: bounceSlow 4s ease-in-out .7s infinite; }
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

function FloatCard({
  className = "",
  accent,
  label,
  value,
  unit,
}: {
  className?: string;
  accent: string;
  label: string;
  value: string;
  unit: string;
}) {
  return (
    <div
      className={`rounded-2xl border bg-white/90 p-4 shadow-xl backdrop-blur-md ${className}`}
      style={{ borderColor: "oklch(1 0 0 / 0.5)" }}
    >
      <div
        className="mb-1 text-[10px] font-bold uppercase tracking-wider"
        style={{ color: accent }}
      >
        {label}
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-bold" style={{ color: INK }}>{value}</span>
        <span className="text-xs font-medium" style={{ color: SAGE_MUTED }}>{unit}</span>
      </div>
    </div>
  );
}

function PhoneMockup() {
  return (
    <div
      className="relative h-[600px] w-[300px] rounded-[3.5rem] p-3 shadow-2xl"
      style={{ backgroundColor: INK, border: `8px solid ${MOSS}` }}
    >
      {/* Notch */}
      <div
        className="absolute left-1/2 top-0 z-30 h-7 w-32 -translate-x-1/2 rounded-b-3xl"
        style={{ backgroundColor: INK }}
      />
      <div className="relative h-full w-full overflow-hidden rounded-[2.5rem] bg-black">
        {/* Food image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=600')",
          }}
        />
        {/* Top scrim + mode pill */}
        <div className="absolute inset-x-0 top-0 z-10 flex flex-col items-center bg-gradient-to-b from-black/45 to-transparent pt-14">
          <div className="rounded-full border border-white/20 bg-white/20 px-4 py-1 text-[12px] font-medium text-white backdrop-blur-md">
            Tarama Modu: Gıda
          </div>
        </div>
        {/* Target brackets */}
        <div className="absolute inset-16 rounded-3xl border-2 border-white/40">
          <span className="absolute -left-1 -top-1 h-8 w-8 border-l-4 border-t-4 border-white" />
          <span className="absolute -right-1 -top-1 h-8 w-8 border-r-4 border-t-4 border-white" />
          <span className="absolute -bottom-1 -left-1 h-8 w-8 border-b-4 border-l-4 border-white" />
          <span className="absolute -bottom-1 -right-1 h-8 w-8 border-b-4 border-r-4 border-white" />
        </div>
        {/* Scanner line */}
        <div className="animate-scan-line absolute inset-x-0 h-0.5 bg-white shadow-[0_0_15px_rgba(255,255,255,0.8)]" />

        {/* Analysis result */}
        <div className="absolute inset-x-0 bottom-0 z-20 rounded-t-3xl bg-white/95 p-6 backdrop-blur-xl">
          <div className="mx-auto mb-4 h-1 w-10 rounded-full" style={{ backgroundColor: SAGE_LINE }} />
          <div className="mb-4 flex items-start justify-between">
            <div>
              <h3 className="font-serif text-lg font-bold" style={{ color: INK }}>Kinoalı Izgara Somon</h3>
              <p className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: SAGE_DOT_1 }}>
                Akdeniz Mutfağı
              </p>
            </div>
            <span
              className="rounded px-2 py-1 text-[10px] font-bold"
              style={{ backgroundColor: SAGE_SOFT, color: MOSS }}
            >
              AI ANALİZİ
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div
              className="rounded-xl border p-3"
              style={{ borderColor: `${SAGE_LINE}66`, backgroundColor: "oklch(0.98 0.01 140)" }}
            >
              <span className="mb-1 block text-[10px]" style={{ color: SAGE_MUTED }}>Karbonhidrat</span>
              <span className="text-sm font-bold" style={{ color: INK }}>18g</span>
            </div>
            <div
              className="rounded-xl border p-3"
              style={{ borderColor: `${SAGE_LINE}66`, backgroundColor: "oklch(0.98 0.01 140)" }}
            >
              <span className="mb-1 block text-[10px]" style={{ color: SAGE_MUTED }}>Doymuş Yağ</span>
              <span className="text-sm font-bold" style={{ color: INK }}>4.2g</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
