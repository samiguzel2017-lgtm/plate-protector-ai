import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Disclaimer } from "@/components/Disclaimer";
import { useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import {
  HeartPulse,
  ShieldCheck,
  Sparkles,
  Flame,
  Star,
  Moon,
  ChevronRight,
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

// Cal-AI inspired palette — cream canvas + crisp ink + warm accents
const CANVAS = "#FBF9F1";
const CANVAS_DEEP = "#F4EFE0";
const INK = "#0E0E0E";
const INK_SOFT = "#4A4A4A";
const LINE = "#E8E2CF";
const MOSS = "#1F6B3A";
const LIME = "#C8F25C";
const EMBER = "#F26B3A";
const BERRY = "#E94B7B";
const SKY = "#3B82F6";

function Landing() {
  const { t } = useI18n();
  return (
    <div className="min-h-screen" style={{ backgroundColor: CANVAS }}>
      <SiteHeader />
      <main className="font-sans" style={{ color: INK }}>
        {/* ============ HERO ============ */}
        <section className="relative overflow-hidden" style={{ backgroundColor: CANVAS }}>
          <div className="container-x grid items-center gap-12 pt-10 pb-20 lg:grid-cols-12 lg:gap-8 lg:pt-16 lg:pb-28">
            {/* LEFT — Content */}
            <div className="lg:col-span-6">
              {/* Social proof */}
              <div className="mb-8 inline-flex items-center gap-3">
                <div className="flex -space-x-2">
                  {[BERRY, EMBER, MOSS].map((c, i) => (
                    <span
                      key={i}
                      className="h-8 w-8 rounded-full ring-2"
                      style={{ background: c, borderColor: CANVAS, boxShadow: `0 0 0 2px ${CANVAS}` }}
                    />
                  ))}
                </div>
                <p className="text-sm font-medium" style={{ color: INK_SOFT }}>
                  10.000+ kullanıcı tarafından beğenildi ·{" "}
                  <span className="inline-flex items-center gap-1 font-semibold" style={{ color: INK }}>
                    <Star className="h-3.5 w-3.5 fill-current" style={{ color: "#F5B400" }} /> 4,9
                  </span>
                </p>
              </div>

              <h1
                className="text-[2.75rem] font-extrabold leading-[1.02] tracking-[-0.035em] md:text-[4.25rem] lg:text-[5.25rem]"
                style={{ color: INK, fontFamily: "var(--font-display)" }}
              >
                Alentra AI ile tanışın:
                <br />
                <span className="inline-block">Sadece bir</span>{" "}
                <span className="relative inline-block">
                  fotoğrafla
                  <svg
                    className="absolute -bottom-2 left-0 w-full"
                    height="14"
                    viewBox="0 0 300 14"
                    fill="none"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M2 9 C 70 2, 150 12, 298 5"
                      stroke={LIME}
                      strokeWidth="6"
                      strokeLinecap="round"
                      fill="none"
                    />
                  </svg>
                </span>
                <br />
                sağlığınızı koruyun.
              </h1>

              <p
                className="mt-7 max-w-xl text-[16px] font-normal leading-[1.65] md:text-[17px]"
                style={{ color: INK_SOFT }}
              >
                {t("hero.sub")}
              </p>

              {/* CTAs */}
              <div className="mt-9 flex flex-wrap items-center gap-3">
                <Link to="/auth">
                  <StoreButton variant="dark" topLine="HEMEN" mainLine="Ücretsiz Başla" icon="apple" />
                </Link>
                <a href="#how">
                  <StoreButton variant="dark" topLine="DETAYLAR" mainLine="Nasıl Çalışır" icon="play" />
                </a>
              </div>

              <Disclaimer className="mt-8 max-w-lg" />
            </div>

            {/* RIGHT — Tilted phone duo */}
            <div className="relative flex min-h-[600px] items-center justify-center lg:col-span-6">
              {/* Ambient blob */}
              <div
                className="pointer-events-none absolute inset-0 -z-10"
                style={{
                  background: `radial-gradient(55% 50% at 60% 45%, ${LIME}33 0%, transparent 70%), radial-gradient(45% 40% at 20% 80%, ${EMBER}1f 0%, transparent 70%)`,
                }}
              />

              {/* Phone A — Scanner */}
              <div className="relative" style={{ transform: "rotate(-6deg)" }}>
                <PhoneScanner />
              </div>

              {/* Floating chip: Syrup */}
              <FloatChip
                className="absolute left-[8%] top-[28%]"
                label="Şurup"
                value="12g"
                tone={EMBER}
              />

              {/* Phone B — Nutrition */}
              <div
                className="absolute right-0 top-6 hidden md:block"
                style={{ transform: "rotate(7deg)" }}
              >
                <PhoneNutrition />
              </div>

              {/* Floating chip: Blueberries */}
              <FloatChip
                className="absolute right-[4%] top-[6%]"
                label="Yaban mersini"
                value="8 adet"
                tone={BERRY}
              />
              {/* Floating chip: Pancakes */}
              <FloatChip
                className="absolute right-[6%] top-[34%]"
                label="Pankek"
                value="595 kcal"
                tone={MOSS}
              />

              {/* Connector squiggle */}
              <svg
                className="pointer-events-none absolute left-[44%] top-[44%] hidden md:block"
                width="120"
                height="40"
                viewBox="0 0 120 40"
                fill="none"
              >
                <path
                  d="M2 20 Q 30 0, 60 20 T 115 20"
                  stroke={INK}
                  strokeWidth="2"
                  strokeDasharray="0 0"
                  fill="none"
                  strokeLinecap="round"
                />
                <path d="M105 14 L 117 20 L 105 26" stroke={INK} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        </section>

        {/* ============ FEATURE 1 — Photo tracking ============ */}
        <section id="features" className="relative" style={{ backgroundColor: CANVAS }}>
          <div className="container-x grid items-center gap-12 py-20 lg:grid-cols-2 lg:gap-20 lg:py-28">
            <div className="relative flex items-center justify-center">
              <div
                className="pointer-events-none absolute inset-0"
                style={{ background: `radial-gradient(50% 50% at 50% 50%, ${LIME}22, transparent 70%)` }}
              />
              <div style={{ transform: "rotate(-4deg)" }}>
                <PhoneSalmon />
              </div>
            </div>

            <div className="space-y-5">
              <FeatureBlock
                title="Yiyeceklerinizi sadece bir fotoğrafla takip edin"
                desc="Alentra AI ile fotoğraf çekin; yapay zekâmız porsiyon hacmini hesaplar, kalori, protein, karbonhidrat ve yağ içeriğini saniyeler içinde ayrıştırır."
                highlighted
              />
              <FeatureBlock
                title="1 milyondan fazla gıda içeren veritabanında arama yapın"
                desc="Geniş veritabanından yiyecekleri hızlıca bulun ve kaydedin. İsim, marka ile arama yapın ya da barkod tarayarak anında besin değerlerine ulaşın."
              />
              <FeatureBlock
                title="Eksiksiz ilerleme takibi ve yapay zekâ önerileri"
                desc="Kilonuzu, ölçümlerinizi ve beslenme hedeflerinizi takip edin. Hedeflerinize ulaşmanız için kişiselleştirilmiş öneriler alın."
              />
            </div>
          </div>
        </section>

        {/* ============ FEATURE 2 — Dark mode showcase ============ */}
        <section className="relative overflow-hidden" style={{ backgroundColor: "#EAF2F8" }}>
          <div className="container-x grid items-center gap-12 py-20 lg:grid-cols-2 lg:py-28">
            <div>
              <span
                className="text-[11px] font-bold uppercase tracking-[0.18em]"
                style={{ color: EMBER }}
              >
                YENİ ÖZELLİK
              </span>
              <h2
                className="mt-4 text-[2.5rem] font-extrabold leading-[1.05] tracking-[-0.03em] md:text-[3.75rem]"
                style={{ color: INK, fontFamily: "var(--font-display)" }}
              >
                Şık bir takip deneyimi için Karanlık Mod{" "}
                <span className="inline-block align-middle">
                  <Moon className="inline h-9 w-9" style={{ color: "#F5B400" }} />
                  <Sparkles className="ml-1 inline h-7 w-7" style={{ color: BERRY }} />
                </span>
              </h2>
              <p className="mt-5 max-w-md text-[15px]" style={{ color: INK_SOFT }}>
                Her hafta yeni özellikler ekleniyor :)
              </p>
            </div>

            <div className="relative flex items-center justify-end">
              <div style={{ transform: "rotate(8deg)" }}>
                <PhoneDark />
              </div>
            </div>
          </div>
        </section>

        {/* ============ HOW (kept, restyled) ============ */}
        <section id="how" className="container-x py-24">
          <div className="mb-12 max-w-2xl">
            <h2
              className="text-[2.25rem] font-extrabold tracking-[-0.03em] md:text-[3rem]"
              style={{ fontFamily: "var(--font-display)", color: INK }}
            >
              {t("how.title")}
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="rounded-3xl border bg-white p-8 transition-transform hover:-translate-y-1"
                style={{ borderColor: LINE }}
              >
                <div
                  className="mb-5 flex h-11 w-11 items-center justify-center rounded-2xl text-lg font-extrabold"
                  style={{ backgroundColor: INK, color: LIME, fontFamily: "var(--font-display)" }}
                >
                  {n}
                </div>
                <h3
                  className="text-xl font-bold tracking-[-0.01em]"
                  style={{ fontFamily: "var(--font-display)", color: INK }}
                >
                  {t(`how.${n}.t`)}
                </h3>
                <p className="mt-2 text-[14px] leading-relaxed" style={{ color: INK_SOFT }}>
                  {t(`how.${n}.d`)}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ============ FINAL CTA ============ */}
        <section className="container-x pb-24">
          <div
            className="relative overflow-hidden rounded-[2.5rem] p-10 md:p-16"
            style={{ backgroundColor: INK, color: CANVAS }}
          >
            <div
              className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full"
              style={{ background: `radial-gradient(circle, ${LIME}66, transparent 70%)` }}
            />
            <div className="relative grid gap-8 md:grid-cols-[1.4fr_1fr] md:items-end">
              <div>
                <h2
                  className="text-[2.25rem] font-extrabold leading-[1.05] tracking-[-0.03em] md:text-[3.5rem]"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Bugün başla. <span style={{ color: LIME }}>Bilinçli ye.</span>
                </h2>
                <p className="mt-3 max-w-lg text-sm opacity-80">{t("hero.sub")}</p>
              </div>
              <div className="flex flex-wrap gap-3 md:justify-end">
                <Link to="/auth">
                  <StoreButton variant="light" topLine="HEMEN" mainLine="Ücretsiz Başla" icon="apple" />
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

/* ---------- Reusable bits ---------- */

function FeatureBlock({
  title,
  desc,
  highlighted = false,
}: {
  title: string;
  desc: string;
  highlighted?: boolean;
}) {
  return (
    <div
      className="rounded-3xl border bg-white p-7 transition-shadow"
      style={{
        borderColor: highlighted ? "#D8D2BD" : LINE,
        boxShadow: highlighted ? "0 24px 60px -30px rgba(0,0,0,0.18)" : "none",
      }}
    >
      <h3
        className="text-[20px] font-extrabold tracking-[-0.015em] md:text-[22px]"
        style={{ fontFamily: "var(--font-display)", color: INK }}
      >
        {title}
      </h3>
      <p className="mt-3 text-[14.5px] leading-relaxed" style={{ color: INK_SOFT }}>
        {desc}
      </p>
    </div>
  );
}

function StoreButton({
  variant,
  topLine,
  mainLine,
  icon,
}: {
  variant: "dark" | "light";
  topLine: string;
  mainLine: string;
  icon: "apple" | "play";
}) {
  const isDark = variant === "dark";
  return (
    <button
      className="group inline-flex items-center gap-3 rounded-2xl px-5 py-3 transition-transform hover:-translate-y-0.5"
      style={{
        backgroundColor: isDark ? INK : "#fff",
        color: isDark ? CANVAS : INK,
        boxShadow: isDark ? "0 12px 30px -12px rgba(0,0,0,0.45)" : "0 8px 22px -10px rgba(0,0,0,0.2)",
      }}
    >
      <span className="flex h-7 w-7 items-center justify-center">
        {icon === "apple" ? (
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor">
            <path d="M16.365 1.43c0 1.14-.45 2.22-1.2 3.02-.83.9-2.13 1.6-3.18 1.51-.13-1.1.44-2.27 1.2-3.02.85-.86 2.27-1.5 3.18-1.51zM20.5 17.05c-.55 1.27-.82 1.84-1.53 2.97-.99 1.57-2.39 3.53-4.12 3.54-1.54.02-1.93-1-4.02-1-2.09 0-2.52.99-4.06.99-1.73.02-3.05-1.77-4.04-3.34C.34 16.96-.31 12.5 1.76 9.7c1.46-1.98 3.78-2.95 5.96-2.95 2.22 0 3.62 1.21 5.46 1.21 1.78 0 2.86-1.21 5.43-1.21 1.94 0 4 .98 5.46 2.67-4.79 2.62-4.01 9.46-3.57 7.63z" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor">
            <path d="M5 3.5v17l13-8.5L5 3.5z" />
          </svg>
        )}
      </span>
      <span className="flex flex-col items-start leading-none">
        <span className="text-[9px] font-semibold uppercase tracking-[0.14em] opacity-80">
          {topLine}
        </span>
        <span className="mt-1 text-[15px] font-bold tracking-tight">{mainLine}</span>
      </span>
    </button>
  );
}

function FloatChip({
  className = "",
  label,
  value,
  tone,
}: {
  className?: string;
  label: string;
  value: string;
  tone: string;
}) {
  return (
    <div
      className={`z-20 flex items-center gap-2 rounded-2xl border bg-white py-2 pl-2.5 pr-3.5 shadow-xl ${className}`}
      style={{ borderColor: LINE }}
    >
      <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: tone }} />
      <div className="leading-tight">
        <div className="text-[10px] font-medium uppercase tracking-wider" style={{ color: INK_SOFT }}>
          {label}
        </div>
        <div className="text-sm font-extrabold" style={{ color: INK, fontFamily: "var(--font-display)" }}>
          {value}
        </div>
      </div>
    </div>
  );
}

/* ---------- Phone mockups ---------- */

function PhoneFrame({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <div
      className="relative h-[560px] w-[270px] rounded-[2.8rem] p-[6px] shadow-[0_40px_80px_-30px_rgba(0,0,0,0.35)]"
      style={{ background: "linear-gradient(160deg, #2a2a2a, #0a0a0a)" }}
    >
      <div
        className="relative h-full w-full overflow-hidden rounded-[2.45rem]"
        style={{ backgroundColor: dark ? "#0A0A0A" : "#fff" }}
      >
        <div className="absolute left-1/2 top-2 z-40 h-6 w-24 -translate-x-1/2 rounded-full bg-black" />
        {children}
      </div>
    </div>
  );
}

function PhoneScanner() {
  return (
    <PhoneFrame>
      {/* Food image bg */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&q=80&w=600')",
        }}
      />
      <div className="absolute inset-x-0 top-0 z-10 h-32 bg-gradient-to-b from-black/55 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 z-10 h-40 bg-gradient-to-t from-black/55 to-transparent" />

      {/* Top bar */}
      <div className="absolute inset-x-0 top-12 z-20 flex items-center justify-between px-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-black/40 backdrop-blur-md">
          <ChevronRight className="h-4 w-4 rotate-180 text-white" />
        </div>
        <div className="text-[12px] font-semibold text-white">Scanner</div>
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-black/40 backdrop-blur-md">
          <Sparkles className="h-3.5 w-3.5 text-white" />
        </div>
      </div>

      {/* Target brackets */}
      <div className="absolute left-8 right-8 top-24 bottom-[200px] rounded-2xl">
        <span className="absolute left-0 top-0 h-6 w-6 border-l-[3px] border-t-[3px] border-white" />
        <span className="absolute right-0 top-0 h-6 w-6 border-r-[3px] border-t-[3px] border-white" />
        <span className="absolute bottom-0 left-0 h-6 w-6 border-b-[3px] border-l-[3px] border-white" />
        <span className="absolute bottom-0 right-0 h-6 w-6 border-b-[3px] border-r-[3px] border-white" />
      </div>

      {/* Bottom toolbar */}
      <div className="absolute inset-x-4 bottom-20 z-30 flex items-center gap-2 rounded-full border border-white/20 bg-white/15 px-3 py-2 backdrop-blur-xl">
        <span className="rounded-full bg-white px-3 py-1 text-[10px] font-bold" style={{ color: INK }}>
          Yemek tara
        </span>
        <span className="text-[10px] font-semibold text-white/80">Barkod</span>
        <span className="text-[10px] font-semibold text-white/80">Galeri</span>
        <span className="ml-auto text-[10px] font-semibold text-white/80">Tarif</span>
      </div>

      {/* Shutter */}
      <div className="absolute inset-x-0 bottom-6 z-30 flex justify-center">
        <div className="h-14 w-14 rounded-full border-[3px] border-white bg-white/90" />
      </div>
    </PhoneFrame>
  );
}

function PhoneNutrition() {
  return (
    <PhoneFrame>
      <div
        className="absolute inset-x-0 top-0 h-[55%] bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1528207776546-365bb710ee93?auto=format&fit=crop&q=80&w=600')",
        }}
      />
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/45 to-transparent" />

      {/* Top bar */}
      <div className="absolute inset-x-0 top-12 z-20 flex items-center justify-between px-4 text-white">
        <ChevronRight className="h-4 w-4 rotate-180" />
        <div className="text-[12px] font-semibold">Nutrition</div>
        <Sparkles className="h-3.5 w-3.5" />
      </div>

      {/* Sheet */}
      <div className="absolute inset-x-0 bottom-0 z-30 rounded-t-[1.8rem] bg-white p-4">
        <div className="mx-auto mb-3 h-1 w-10 rounded-full" style={{ backgroundColor: LINE }} />
        <div className="mb-3 flex items-center justify-between">
          <div>
            <div className="text-[9px] font-bold uppercase tracking-[0.16em]" style={{ color: INK_SOFT }}>
              Kahvaltı
            </div>
            <div className="text-[15px] font-extrabold leading-tight" style={{ color: INK, fontFamily: "var(--font-display)" }}>
              Pankek &<br />yaban mersini
            </div>
          </div>
          <div className="flex items-center gap-1 rounded-full border px-2 py-1 text-[11px] font-bold" style={{ borderColor: LINE, color: INK }}>
            <span>−</span>
            <span className="px-1">1</span>
            <span>+</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <MacroCell icon={Flame} color={EMBER} label="Kalori" value="615" />
          <MacroCell icon={Sparkles} color="#C8A24A" label="Karb." value="93g" />
          <MacroCell icon={HeartPulse} color={BERRY} label="Protein" value="11g" />
          <MacroCell icon={ShieldCheck} color={SKY} label="Yağ" value="21g" />
        </div>

        <div className="mt-3 rounded-2xl border p-3" style={{ borderColor: LINE }}>
          <div className="flex items-center justify-between text-[11px]">
            <span className="font-semibold" style={{ color: INK }}>
              Sağlık skoru
            </span>
            <span className="font-extrabold" style={{ color: INK }}>
              7/10
            </span>
          </div>
          <div className="mt-1.5 h-1.5 rounded-full" style={{ backgroundColor: CANVAS_DEEP }}>
            <div className="h-full rounded-full" style={{ width: "70%", backgroundColor: MOSS }} />
          </div>
        </div>

        <div className="mt-3 flex items-center gap-2">
          <button
            className="flex-1 rounded-full border py-2 text-[11px] font-bold"
            style={{ borderColor: LINE, color: INK }}
          >
            ✦ Düzelt
          </button>
          <button
            className="flex-1 rounded-full py-2 text-[11px] font-bold"
            style={{ backgroundColor: INK, color: CANVAS }}
          >
            Bitti
          </button>
        </div>
      </div>
    </PhoneFrame>
  );
}

function MacroCell({ icon: Icon, color, label, value }: any) {
  return (
    <div className="flex items-center gap-2 rounded-2xl border p-2.5" style={{ borderColor: LINE }}>
      <span className="flex h-8 w-8 items-center justify-center rounded-xl" style={{ backgroundColor: `${color}1f`, color }}>
        <Icon className="h-4 w-4" />
      </span>
      <div className="leading-tight">
        <div className="text-[9px] uppercase tracking-wider" style={{ color: INK_SOFT }}>{label}</div>
        <div className="text-[13px] font-extrabold" style={{ color: INK }}>{value}</div>
      </div>
    </div>
  );
}

function PhoneSalmon() {
  return (
    <PhoneFrame>
      <div
        className="absolute inset-x-0 top-0 h-[48%] bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&q=80&w=600')",
        }}
      />
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/40 to-transparent" />
      <div className="absolute inset-x-0 top-12 z-20 flex items-center justify-between px-4 text-white">
        <ChevronRight className="h-4 w-4 rotate-180" />
        <div className="text-[12px] font-semibold">Nutrition</div>
        <Sparkles className="h-3.5 w-3.5" />
      </div>

      <div className="absolute inset-x-0 bottom-0 z-30 rounded-t-[1.8rem] bg-white p-4">
        <div className="mb-2 flex items-center gap-2 text-[10px]" style={{ color: INK_SOFT }}>
          <span>🔖</span>
          <span className="font-semibold">12:46 PM</span>
        </div>
        <div className="mb-3 flex items-start justify-between gap-3">
          <h4
            className="text-[16px] font-extrabold leading-tight"
            style={{ color: INK, fontFamily: "var(--font-display)" }}
          >
            Somon ve Brokoli<br />Fırın Tepsisi
          </h4>
          <span className="rounded-full border px-2 py-1 text-[10px] font-bold" style={{ borderColor: LINE, color: INK }}>
            1 ✎
          </span>
        </div>

        <div className="mb-2 flex items-center gap-2 rounded-2xl border p-2.5" style={{ borderColor: LINE }}>
          <span className="flex h-8 w-8 items-center justify-center rounded-xl" style={{ backgroundColor: `${EMBER}1f`, color: EMBER }}>
            <Flame className="h-4 w-4" />
          </span>
          <div className="leading-tight">
            <div className="text-[9px] uppercase tracking-wider" style={{ color: INK_SOFT }}>Calories</div>
            <div className="text-[15px] font-extrabold" style={{ color: INK }}>621</div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <MacroCell icon={HeartPulse} color={BERRY} label="Protein" value="52g" />
          <MacroCell icon={Sparkles} color="#C8A24A" label="Karb." value="20g" />
          <MacroCell icon={ShieldCheck} color={SKY} label="Yağ" value="36g" />
        </div>

        <div className="mt-3 rounded-2xl border p-3" style={{ borderColor: LINE }}>
          <div className="flex items-center justify-between text-[11px]">
            <span className="inline-flex items-center gap-1 font-semibold" style={{ color: INK }}>
              <HeartPulse className="h-3.5 w-3.5" style={{ color: BERRY }} /> Sağlık Skoru
            </span>
            <span className="font-extrabold" style={{ color: INK }}>7/10</span>
          </div>
          <div className="mt-1.5 h-1.5 rounded-full" style={{ backgroundColor: CANVAS_DEEP }}>
            <div className="h-full rounded-full" style={{ width: "70%", backgroundColor: MOSS }} />
          </div>
        </div>
      </div>
    </PhoneFrame>
  );
}

function PhoneDark() {
  return (
    <PhoneFrame dark>
      <div className="absolute inset-0 p-5 pt-12 text-white">
        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">🍎</span>
            <span className="font-extrabold tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
              Alentra
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="rounded-lg bg-white/10 px-2 py-1 text-[10px]">📷</span>
            <span className="inline-flex items-center gap-1 rounded-lg bg-white/10 px-2 py-1 text-[10px]">
              <Flame className="h-3 w-3" style={{ color: EMBER }} /> 15
            </span>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-3 text-[11px]">
          <span className="border-b-2 pb-1 font-bold" style={{ borderColor: LIME }}>
            Bugün
          </span>
          <span className="opacity-50">Dün</span>
        </div>

        <div className="mt-4 rounded-2xl bg-white/[0.06] p-4">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-[2rem] font-extrabold leading-none" style={{ fontFamily: "var(--font-display)" }}>
                2500
              </div>
              <div className="mt-1 text-[10px] opacity-70">Kalan kalori</div>
            </div>
            <div className="relative h-14 w-14">
              <svg viewBox="0 0 36 36" className="h-full w-full -rotate-90">
                <circle cx="18" cy="18" r="15" stroke="rgba(255,255,255,0.1)" strokeWidth="3" fill="none" />
                <circle cx="18" cy="18" r="15" stroke={LIME} strokeWidth="3" fill="none" strokeDasharray="70 100" strokeLinecap="round" />
              </svg>
              <Flame className="absolute inset-0 m-auto h-4 w-4" />
            </div>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-3 gap-2">
          {[
            { v: "45g", l: "Protein", c: EMBER, p: 90 },
            { v: "89g", l: "Karb.", c: "#C8A24A", p: 60 },
            { v: "48g", l: "Yağ", c: SKY, p: 45 },
          ].map((m) => (
            <div key={m.l} className="rounded-2xl bg-white/[0.06] p-3">
              <div className="text-[13px] font-extrabold">{m.v}</div>
              <div className="text-[9px] opacity-70">{m.l}</div>
              <div className="relative mx-auto mt-2 h-10 w-10">
                <svg viewBox="0 0 36 36" className="h-full w-full -rotate-90">
                  <circle cx="18" cy="18" r="15" stroke="rgba(255,255,255,0.1)" strokeWidth="3" fill="none" />
                  <circle cx="18" cy="18" r="15" stroke={m.c} strokeWidth="3" fill="none" strokeDasharray={`${m.p} 100`} strokeLinecap="round" />
                </svg>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 text-[11px] font-bold">Son yüklenenler</div>
        <div className="mt-2 space-y-2">
          {[1, 2].map((i) => (
            <div key={i} className="flex items-center gap-2 rounded-2xl bg-white/[0.06] p-2">
              <div
                className="h-9 w-9 rounded-xl bg-cover"
                style={{
                  backgroundImage:
                    "url('https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=200')",
                }}
              />
              <div className="flex-1 leading-tight">
                <div className="text-[11px] font-bold">Somon salatası…</div>
                <div className="text-[9px] opacity-60">500 kcal · 78g · 78g</div>
              </div>
              <div className="text-[9px] opacity-60">9:00</div>
            </div>
          ))}
        </div>
      </div>
    </PhoneFrame>
  );
}
