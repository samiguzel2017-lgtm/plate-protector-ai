import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import {
  ShieldCheck,
  Sparkles,
  ScanLine,
  Camera,
  HeartPulse,
  Leaf,
  AlertTriangle,
  Check,
  ChevronRight,
  Flame,
  Moon,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Alentra AI — Fotoğrafını Çek, Sağlığını Koru" },
      {
        name: "description",
        content:
          "Kişisel sağlık profiline göre gıda analizi. Etiketi, barkodu veya yemeği tarayın; saniyeler içinde güvenli/dikkat/uygun değil kararını alın.",
      },
    ],
  }),
  component: Landing,
});

/* Unified Forest & Sage palette */
const FOREST = "var(--lp-forest)";
const FOREST_FG = "var(--lp-forest-fg)";
const ON_DARK = "#FFFFFF";
const CTA_ACCENT = "var(--lp-cta-accent)";
const MOSS = "var(--lp-moss)";
const SAGE = "#52B788";
const MINT = "#B7E4C7";
const CANVAS = "var(--lp-canvas)";
const CARD = "var(--lp-card)";
const PANEL = "var(--lp-panel)";
const INK = "var(--lp-ink)";
const INK_SOFT = "var(--lp-ink-soft)";
const LINE = "var(--lp-line)";
const CHARCOAL = "#1A1F2C";
const LAVENDER_AMBIENT = "var(--lp-ambient)";

function Landing() {
  const { t, lang } = useI18n();
  const pc = phoneCopy(lang === "tr" ? "tr" : "en");
  return (
    <div className="min-h-screen" style={{ backgroundColor: CANVAS }}>
      <SiteHeader />
      <main className="font-sans" style={{ color: INK }}>
        {/* ============ HERO ============ */}
        <section className="relative overflow-hidden">
          <div
            className="pointer-events-none absolute inset-0 -z-10"
            style={{
              background: `radial-gradient(60% 50% at 80% 0%, ${MINT}55 0%, transparent 65%), radial-gradient(50% 40% at 0% 100%, ${MINT}33 0%, transparent 70%)`,
            }}
          />

          <div className="container-x grid items-center gap-14 pt-12 pb-24 lg:grid-cols-12 lg:gap-10 lg:pt-20 lg:pb-32">
            {/* LEFT */}
            <div className="lg:col-span-6">
              <span
                className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em]"
                style={{ borderColor: LINE, color: MOSS, backgroundColor: PANEL }}
              >
                <Leaf className="h-3.5 w-3.5" />
                {t("lp.badge")}
              </span>

              <h1
                className="mt-7 text-[2.75rem] font-extrabold leading-[1.02] tracking-[-0.035em] md:text-[4.25rem] lg:text-[5.25rem]"
                style={{ color: INK, fontFamily: "var(--font-display)" }}
              >
                {t("lp.hero.1")}
                <br />
                <span style={{ color: FOREST }}>{t("lp.hero.2")}</span>{" "}
                <span className="relative inline-block">
                  {t("lp.hero.3")}
                  <svg
                    className="absolute -bottom-2 left-0 w-full"
                    height="14"
                    viewBox="0 0 300 14"
                    fill="none"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M2 9 C 70 2, 150 12, 298 5"
                      stroke={SAGE}
                      strokeWidth="6"
                      strokeLinecap="round"
                      fill="none"
                    />
                  </svg>
                </span>
              </h1>

              <p
                className="mt-7 max-w-xl text-[16px] font-normal leading-[1.65] md:text-[17px]"
                style={{ color: INK_SOFT }}
              >
                {t("hero.sub")}
              </p>

              <div className="mt-9 flex flex-wrap items-center gap-3">
                <Link to="/auth">
                  <Button
                    size="lg"
                    className="h-12 rounded-2xl px-7 text-[15px] font-semibold shadow-[0_12px_30px_-12px_rgba(27,67,50,0.45)]"
                    style={{ backgroundColor: FOREST, color: FOREST_FG }}
                  >
                    {t("lp.cta.free")}
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </Link>
                <a href="#how">
                  <Button
                    size="lg"
                    variant="outline"
                    className="h-12 rounded-2xl border-2 px-7 text-[15px] font-semibold"
                    style={{ borderColor: LINE, color: INK, backgroundColor: PANEL }}
                  >
                    {t("lp.cta.how")}
                  </Button>
                </a>
              </div>

              {/* Trust micro */}
              <div className="mt-10 flex items-center gap-6 text-[13px] font-medium" style={{ color: INK_SOFT }}>
                <span className="inline-flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4" style={{ color: MOSS }} /> {t("lp.trust.1")}
                </span>
                <span className="inline-flex items-center gap-2">
                  <ScanLine className="h-4 w-4" style={{ color: MOSS }} /> {t("lp.trust.2")}
                </span>
              </div>
            </div>

            {/* RIGHT — overlapping phones */}
            <div className="relative flex min-h-[600px] items-center justify-center lg:col-span-6">
              <div className="relative" style={{ transform: "rotate(-5deg)" }}>
                <PhoneScanner copy={pc} />
              </div>
              <div className="absolute right-0 top-10 hidden md:block" style={{ transform: "rotate(6deg)" }}>
                <PhoneVerdict copy={pc} />
              </div>
            </div>
          </div>
        </section>

        {/* ============ FEATURE 1 ============ */}
        <section id="features" className="relative">
          <div className="container-x grid items-center gap-14 py-24 lg:grid-cols-2 lg:gap-20">
            <div className="relative flex items-center justify-center">
              <div
                className="pointer-events-none absolute inset-0"
                style={{ background: `radial-gradient(55% 55% at 50% 50%, ${MINT}55, transparent 70%)` }}
              />
              <div style={{ transform: "rotate(-3deg)" }}>
                <PhoneAllergy copy={pc} />
              </div>

              {/* Floating allergy chip */}
              <FloatChip
                className="absolute -left-2 top-12 md:left-6"
                icon={AlertTriangle}
                label={pc.allergen}
                value={pc.gluten}
                tone="danger"
              />
              <FloatChip
                className="absolute -right-2 bottom-16 md:right-4"
                icon={Check}
                label={pc.profileMatch}
                value={pc.lactoseFree}
                tone="safe"
              />
            </div>

            <div className="space-y-5">
              <span
                className="text-[11px] font-bold uppercase tracking-[0.18em]"
                style={{ color: MOSS }}
              >
                {t("lp.feat.eyebrow")}
              </span>
              <h2
                className="text-[2.25rem] font-extrabold leading-[1.05] tracking-[-0.03em] md:text-[3rem]"
                style={{ color: INK, fontFamily: "var(--font-display)" }}
              >
                {t("lp.feat.h.1")}
                <br />
                <span style={{ color: FOREST }}>{t("lp.feat.h.2")}</span> {t("lp.feat.h.3")}
              </h2>
              <FeatureBlock
                icon={HeartPulse}
                title={t("lp.feat.1.t")}
                desc={t("lp.feat.1.d")}
                highlighted
              />
              <FeatureBlock
                icon={Camera}
                title={t("lp.feat.2.t")}
                desc={t("lp.feat.2.d")}
              />
              <FeatureBlock
                icon={ScanLine}
                title={t("lp.feat.3.t")}
                desc={t("lp.feat.3.d")}
              />
            </div>
          </div>
        </section>

        {/* ============ DARK MODE SHOWCASE ============ */}
        <section className="relative overflow-hidden">
          <div className="container-x py-24">
            <div
              className="relative overflow-hidden rounded-[2.5rem] p-10 md:p-16"
              style={{ background: LAVENDER_AMBIENT }}
            >
              <div className="grid items-center gap-12 lg:grid-cols-2">
                <div>
                  <span
                    className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em]"
                    style={{ backgroundColor: CHARCOAL, color: ON_DARK }}
                  >
                    <Moon className="h-3 w-3" /> {t("lp.dark.badge")}
                  </span>
                  <h2
                    className="mt-5 text-[2.25rem] font-extrabold leading-[1.05] tracking-[-0.03em] md:text-[3.25rem]"
                    style={{ color: INK, fontFamily: "var(--font-display)" }}
                  >
                    {t("lp.dark.h.1")}
                    <br />
                    <span style={{ color: FOREST }}>{t("lp.dark.h.2")}</span>
                  </h2>
                  <p className="mt-5 max-w-md text-[15px] leading-relaxed" style={{ color: INK_SOFT }}>
                    {t("lp.dark.p")}
                  </p>
                  <div className="mt-7">
                    <Link to="/auth">
                      <Button
                        size="lg"
                        className="h-12 rounded-2xl px-7 text-[15px] font-semibold"
                        style={{ backgroundColor: CHARCOAL, color: ON_DARK }}
                      >
                        {t("lp.dark.cta")}
                      </Button>
                    </Link>
                  </div>
                </div>
                <div className="relative flex items-center justify-center lg:justify-end">
                  <div style={{ transform: "rotate(5deg)" }}>
                    <PhoneDark copy={pc} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============ HOW ============ */}
        <section id="how" className="container-x py-24">
          <div className="mb-12 max-w-2xl">
            <span className="text-[11px] font-bold uppercase tracking-[0.18em]" style={{ color: MOSS }}>
              {t("lp.how.eyebrow")}
            </span>
            <h2
              className="mt-3 text-[2.25rem] font-extrabold tracking-[-0.03em] md:text-[3rem]"
              style={{ fontFamily: "var(--font-display)", color: INK }}
            >
              {t("how.title")}
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="rounded-3xl border p-8 transition-all hover:-translate-y-1 hover:shadow-[0_24px_60px_-30px_rgba(27,67,50,0.25)]"
                style={{ borderColor: LINE, backgroundColor: CARD }}
              >
                <div
                  className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl text-lg font-extrabold"
                  style={{ backgroundColor: FOREST, color: FOREST_FG, fontFamily: "var(--font-display)" }}
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
            style={{ backgroundColor: FOREST, color: FOREST_FG }}
          >
            <div
              className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full"
              style={{ background: `radial-gradient(circle, ${SAGE}88, transparent 70%)` }}
            />
            <div
              className="pointer-events-none absolute -left-16 -bottom-16 h-64 w-64 rounded-full"
              style={{ background: `radial-gradient(circle, ${MINT}55, transparent 70%)` }}
            />
            <div className="relative grid gap-8 md:grid-cols-[1.4fr_1fr] md:items-end">
              <div>
                <h2
                  className="text-[2.25rem] font-extrabold leading-[1.05] tracking-[-0.03em] md:text-[3.5rem]"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {t("lp.final.1")}{" "}
                  <span style={{ color: CTA_ACCENT }}>{t("lp.final.2")}</span>
                </h2>
                <p className="mt-3 max-w-lg text-sm opacity-85">{t("hero.sub")}</p>
              </div>
              <div className="flex flex-wrap gap-3 md:justify-end">
                <Link to="/auth">
                  <Button
                    size="lg"
                    className="h-12 rounded-2xl px-7 text-[15px] font-semibold"
                    style={{ backgroundColor: PANEL, color: FOREST }}
                  >
                    {t("lp.cta.free")}
                    <ChevronRight className="ml-1 h-4 w-4" />
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

/* ---------- Reusable bits ---------- */

function FeatureBlock({
  icon: Icon,
  title,
  desc,
  highlighted = false,
}: {
  icon: any;
  title: string;
  desc: string;
  highlighted?: boolean;
}) {
  return (
    <div
      className="rounded-3xl border p-6 transition-shadow"
      style={{
        borderColor: highlighted ? "color-mix(in oklab, var(--lp-safe-fg) 22%, var(--lp-line))" : LINE,
        backgroundColor: highlighted ? PANEL : CARD,
        boxShadow: highlighted ? "0 24px 60px -30px rgba(27,67,50,0.18)" : "none",
      }}
    >
      <div className="flex items-start gap-4">
        <span
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl"
          style={{ backgroundColor: `${SAGE}22`, color: FOREST }}
        >
          <Icon className="h-5 w-5" />
        </span>
        <div>
          <h3
            className="text-[17px] font-extrabold tracking-[-0.015em] md:text-[18px]"
            style={{ fontFamily: "var(--font-display)", color: INK }}
          >
            {title}
          </h3>
          <p className="mt-1.5 text-[14px] leading-relaxed" style={{ color: INK_SOFT }}>
            {desc}
          </p>
        </div>
      </div>
    </div>
  );
}

function FloatChip({
  className = "",
  icon: Icon,
  label,
  value,
  tone,
}: {
  className?: string;
  icon: any;
  label: string;
  value: string;
  tone: "safe" | "warning" | "danger";
}) {
  const map = {
    safe: { fg: "var(--lp-safe-fg)", bg: "var(--lp-safe-bg)" },
    warning: { fg: "var(--lp-warn-fg)", bg: "var(--lp-warn-bg)" },
    danger: { fg: "var(--lp-danger-fg)", bg: "var(--lp-danger-bg)" },
  } as const;
  const c = map[tone];
  return (
    <div
      className={`z-20 flex items-center gap-2.5 rounded-2xl border py-2 pl-2 pr-3.5 shadow-xl ${className}`}
      style={{ borderColor: LINE, backgroundColor: PANEL }}
    >
      <span
        className="flex h-8 w-8 items-center justify-center rounded-xl"
        style={{ backgroundColor: c.bg, color: c.fg }}
      >
        <Icon className="h-4 w-4" />
      </span>
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

type PhoneCopy = ReturnType<typeof phoneCopy>;

function phoneCopy(lang: "tr" | "en") {
  const tr = {
    // scanner
    scanBarcode: "Barkod tara",
    tabBarcode: "Barkod",
    tabMeal: "Yemek",
    tabLabel: "Etiket",
    tabGallery: "Galeri",
    // verdict
    report: "Analiz Raporu",
    barcodeShort: "Barkod 869…",
    productLine1: "Granola bar",
    productLine2: "fındıklı",
    safe: "Güvenli",
    energy: "Enerji",
    protein: "Protein",
    fiber: "Lif",
    salt: "Tuz",
    profileMatchLabel: "Profil uyumu",
    // allergy
    analysis: "Analiz",
    breadLine1: "Tam buğdaylı",
    breadLine2: "ekmek",
    notSuitable: "Uygun değil",
    glutenContains: "Gluten içerir",
    glutenDetail: "Çölyak profilin ile uyumsuz",
    highSodium: "Yüksek sodyum",
    highSodiumDetail: "100g'da 1.2g tuz",
    lactose: "Laktoz",
    lactoseDetail: "Tespit edilmedi",
    riskScore: "Risk skoru",
    // float chips
    allergen: "Alerjen",
    gluten: "Gluten",
    profileMatch: "Profil uyumlu",
    lactoseFree: "Laktozsuz",
    // dark
    today: "Bugün",
    yesterday: "Dün",
    caloriesLeft: "Kalan kalori",
    carbs: "Karb.",
    fat: "Yağ",
    lastScanned: "Son taranan",
    granola: "Granola bar",
    bread: "Tam buğdaylı ekmek",
  };
  const en = {
    scanBarcode: "Scan barcode",
    tabBarcode: "Barcode",
    tabMeal: "Meal",
    tabLabel: "Label",
    tabGallery: "Gallery",
    report: "Analysis Report",
    barcodeShort: "Barcode 869…",
    productLine1: "Granola bar",
    productLine2: "hazelnut",
    safe: "Safe",
    energy: "Energy",
    protein: "Protein",
    fiber: "Fiber",
    salt: "Salt",
    profileMatchLabel: "Profile match",
    analysis: "Analysis",
    breadLine1: "Whole wheat",
    breadLine2: "bread",
    notSuitable: "Not suitable",
    glutenContains: "Contains gluten",
    glutenDetail: "Incompatible with celiac profile",
    highSodium: "High sodium",
    highSodiumDetail: "1.2g salt per 100g",
    lactose: "Lactose",
    lactoseDetail: "Not detected",
    riskScore: "Risk score",
    allergen: "Allergen",
    gluten: "Gluten",
    profileMatch: "Profile match",
    lactoseFree: "Lactose-free",
    today: "Today",
    yesterday: "Yesterday",
    caloriesLeft: "Calories left",
    carbs: "Carbs",
    fat: "Fat",
    lastScanned: "Last scanned",
    granola: "Granola bar",
    bread: "Whole wheat bread",
  };
  return lang === "en" ? en : tr;
}

const PHONE_FONT = "'Inter', 'Plus Jakarta Sans', system-ui, sans-serif";
const DISPLAY_FONT = "var(--font-display)";

function PhoneFrame({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <div
      className="relative h-[560px] w-[270px] rounded-[2.8rem] p-[6px] shadow-[0_40px_80px_-30px_rgba(15,30,25,0.4)]"
      style={{ background: "linear-gradient(160deg, #2a2a2a, #0a0a0a)", fontFamily: PHONE_FONT, fontFeatureSettings: '"cv11","ss01","tnum"' }}
    >
      <div
        className="relative h-full w-full overflow-hidden rounded-[2.45rem]"
        style={{ backgroundColor: dark ? CHARCOAL : "#fff" }}
      >
        <div className="absolute left-1/2 top-2 z-40 h-6 w-24 -translate-x-1/2 rounded-full bg-black" />
        {children}
      </div>
    </div>
  );
}

function PhoneScanner({ copy }: { copy: PhoneCopy }) {
  return (
    <PhoneFrame dark>
      <div
        className="absolute inset-0 bg-cover bg-center opacity-70"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=600')",
        }}
      />
      <div className="absolute inset-0 bg-black/45" />

      {/* Top bar */}
      <div className="absolute inset-x-0 top-12 z-20 flex items-center justify-between px-4">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-medium tracking-tight text-white backdrop-blur-md">
          <ScanLine className="h-3 w-3" style={{ color: SAGE }} />
          {copy.scanBarcode}
        </div>
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 backdrop-blur-md">
          <Sparkles className="h-3.5 w-3.5 text-white" />
        </div>
      </div>

      {/* Reticle */}
      <div className="absolute inset-x-8 top-[28%] z-20 h-[180px]">
        <div className="relative h-full w-full rounded-3xl border-2 border-white/70">
          <span className="absolute -left-1 -top-1 h-6 w-6 rounded-tl-2xl border-l-[3px] border-t-[3px]" style={{ borderColor: SAGE }} />
          <span className="absolute -right-1 -top-1 h-6 w-6 rounded-tr-2xl border-r-[3px] border-t-[3px]" style={{ borderColor: SAGE }} />
          <span className="absolute -bottom-1 -left-1 h-6 w-6 rounded-bl-2xl border-b-[3px] border-l-[3px]" style={{ borderColor: SAGE }} />
          <span className="absolute -bottom-1 -right-1 h-6 w-6 rounded-br-2xl border-b-[3px] border-r-[3px]" style={{ borderColor: SAGE }} />
          <span
            className="scanner-laser absolute left-3 right-3 top-1/2 h-[2px] rounded-full"
            style={{ backgroundColor: SAGE, boxShadow: `0 0 18px 2px ${SAGE}` }}
          />
        </div>
      </div>

      <div className="absolute left-12 right-12 top-[42%] z-10 flex h-16 items-center justify-between opacity-90">
        {Array.from({ length: 22 }).map((_, i) => (
          <span key={i} className="block h-full bg-white" style={{ width: `${1 + ((i * 7) % 4)}px` }} />
        ))}
      </div>

      {/* Bottom toolbar */}
      <div className="absolute inset-x-4 bottom-20 z-30 flex items-center gap-1 rounded-full border border-white/15 bg-white/10 px-2 py-2 backdrop-blur-xl">
        <span className="rounded-full px-3 py-1 text-[10px] font-medium tracking-tight" style={{ backgroundColor: SAGE, color: CHARCOAL }}>
          {copy.tabBarcode}
        </span>
        <span className="px-3 text-[10px] font-light tracking-tight text-white/75">{copy.tabMeal}</span>
        <span className="px-3 text-[10px] font-light tracking-tight text-white/75">{copy.tabLabel}</span>
        <span className="ml-auto px-3 text-[10px] font-light tracking-tight text-white/75">{copy.tabGallery}</span>
      </div>

      <div className="absolute inset-x-0 bottom-6 z-30 flex justify-center">
        <div className="h-14 w-14 rounded-full border-[3px] border-white" style={{ backgroundColor: SAGE }} />
      </div>
    </PhoneFrame>
  );
}

function PhoneVerdict({ copy }: { copy: PhoneCopy }) {
  return (
    <PhoneFrame>
      <div
        className="absolute inset-x-0 top-0 h-[42%] bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?auto=format&fit=crop&q=80&w=600')",
        }}
      />
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/45 to-transparent" />
      <div className="absolute inset-x-0 top-12 z-20 flex items-center justify-between px-4 text-white">
        <ChevronRight className="h-4 w-4 rotate-180" />
        <div className="text-[12px] font-medium tracking-tight">{copy.report}</div>
        <Sparkles className="h-3.5 w-3.5" />
      </div>

      <div className="absolute inset-x-0 bottom-0 top-[38%] z-30 rounded-t-[1.8rem] p-4" style={{ backgroundColor: PANEL }}>
        <div className="mx-auto mb-3 h-1 w-10 rounded-full" style={{ backgroundColor: LINE }} />

        <div className="mb-3 flex items-center justify-between">
          <div>
            <div className="text-[9px] font-light uppercase tracking-[0.16em]" style={{ color: INK_SOFT }}>
              {copy.barcodeShort}
            </div>
            <div className="text-[15px] font-bold leading-tight tracking-[-0.02em]" style={{ color: INK, fontFamily: DISPLAY_FONT }}>
              {copy.productLine1}
              <br />
              {copy.productLine2}
            </div>
          </div>
          <span
            className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-medium tracking-tight"
            style={{ backgroundColor: "var(--lp-safe-bg)", color: "var(--lp-safe-fg)" }}
          >
            <Check className="h-3 w-3" /> {copy.safe}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <MacroCell icon={Flame} label={copy.energy} value="412 kcal" />
          <MacroCell icon={HeartPulse} label={copy.protein} value="9.2g" />
          <MacroCell icon={Leaf} label={copy.fiber} value="6.1g" />
          <MacroCell icon={ShieldCheck} label={copy.salt} value="0.4g" />
        </div>

        <div className="mt-3 rounded-2xl border p-3" style={{ borderColor: LINE }}>
          <div className="flex items-center justify-between text-[11px]">
            <span className="font-normal tracking-tight" style={{ color: INK }}>
              {copy.profileMatchLabel}
            </span>
            <span className="font-medium tabular-nums" style={{ color: FOREST }}>
              9/10
            </span>
          </div>
          <div className="mt-1.5 h-1.5 rounded-full" style={{ backgroundColor: "var(--lp-track)" }}>
            <div className="h-full rounded-full" style={{ width: "90%", backgroundColor: SAGE }} />
          </div>
        </div>
      </div>
    </PhoneFrame>
  );
}

function MacroCell({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2 rounded-2xl border p-2.5" style={{ borderColor: LINE }}>
      <span
        className="flex h-8 w-8 items-center justify-center rounded-xl"
        style={{ backgroundColor: `${SAGE}22`, color: FOREST }}
      >
        <Icon className="h-4 w-4" />
      </span>
      <div className="leading-tight">
        <div className="text-[9px] font-light uppercase tracking-[0.12em]" style={{ color: INK_SOFT }}>
          {label}
        </div>
        <div className="text-[13px] font-medium tabular-nums tracking-tight" style={{ color: INK }}>
          {value}
        </div>
      </div>
    </div>
  );
}

function PhoneAllergy({ copy }: { copy: PhoneCopy }) {
  return (
    <PhoneFrame>
      <div
        className="absolute inset-x-0 top-0 h-[38%] bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=600')",
        }}
      />
      <div className="absolute inset-x-0 top-12 z-20 flex items-center justify-between px-4 text-white">
        <ChevronRight className="h-4 w-4 rotate-180" />
        <div className="text-[12px] font-medium tracking-tight">{copy.analysis}</div>
        <Sparkles className="h-3.5 w-3.5" />
      </div>

      <div className="absolute inset-x-0 bottom-0 top-[34%] z-30 rounded-t-[1.8rem] p-4" style={{ backgroundColor: PANEL }}>
        <div className="mx-auto mb-3 h-1 w-10 rounded-full" style={{ backgroundColor: LINE }} />
        <div className="mb-3 flex items-start justify-between gap-3">
          <h4
            className="text-[16px] font-bold leading-tight tracking-[-0.02em]"
            style={{ color: INK, fontFamily: DISPLAY_FONT }}
          >
            {copy.breadLine1}
            <br />
            {copy.breadLine2}
          </h4>
          <span
            className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-medium tracking-tight"
            style={{ backgroundColor: "var(--lp-danger-bg)", color: "var(--lp-danger-fg)" }}
          >
            <AlertTriangle className="h-3 w-3" /> {copy.notSuitable}
          </span>
        </div>

        <div className="space-y-2">
          <RiskRow tone="danger" label={copy.glutenContains} detail={copy.glutenDetail} />
          <RiskRow tone="warning" label={copy.highSodium} detail={copy.highSodiumDetail} />
          <RiskRow tone="safe" label={copy.lactose} detail={copy.lactoseDetail} />
        </div>

        <div className="mt-3 rounded-2xl border p-3" style={{ borderColor: LINE }}>
          <div className="flex items-center justify-between text-[11px]">
            <span className="font-normal tracking-tight" style={{ color: INK }}>
              {copy.riskScore}
            </span>
            <span className="font-medium tabular-nums" style={{ color: "var(--lp-danger-fg)" }}>3/10</span>
          </div>
          <div className="mt-1.5 h-1.5 rounded-full" style={{ backgroundColor: "var(--lp-track)" }}>
            <div className="h-full rounded-full" style={{ width: "30%", backgroundColor: "var(--lp-danger-fg)" }} />
          </div>
        </div>
      </div>
    </PhoneFrame>
  );
}

function RiskRow({ tone, label, detail }: { tone: "safe" | "warning" | "danger"; label: string; detail: string }) {
  const map = {
    safe: { bg: "var(--lp-safe-bg)", fg: "var(--lp-safe-fg)", icon: Check },
    warning: { bg: "var(--lp-warn-bg)", fg: "var(--lp-warn-fg)", icon: AlertTriangle },
    danger: { bg: "var(--lp-danger-bg)", fg: "var(--lp-danger-fg)", icon: AlertTriangle },
  } as const;
  const c = map[tone];
  const Icon = c.icon;
  return (
    <div className="flex items-center gap-2.5 rounded-xl border px-2.5 py-2" style={{ borderColor: LINE }}>
      <span className="flex h-7 w-7 items-center justify-center rounded-lg" style={{ backgroundColor: c.bg, color: c.fg }}>
        <Icon className="h-3.5 w-3.5" />
      </span>
      <div className="leading-tight">
        <div className="text-[12px] font-medium tracking-tight" style={{ color: INK }}>{label}</div>
        <div className="text-[10px] font-light tracking-tight" style={{ color: INK_SOFT }}>{detail}</div>
      </div>
    </div>
  );
}

function PhoneDark({ copy }: { copy: PhoneCopy }) {
  return (
    <PhoneFrame dark>
      <div className="absolute inset-0 p-5 pt-12 text-white">
        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-xl" style={{ backgroundColor: `${SAGE}33`, color: SAGE }}>
              <Leaf className="h-3.5 w-3.5" />
            </span>
            <span className="font-bold tracking-[-0.02em]" style={{ fontFamily: DISPLAY_FONT }}>
              Alentra
            </span>
          </div>
          <span className="inline-flex items-center gap-1 rounded-lg bg-white/10 px-2 py-1 text-[10px] font-medium tabular-nums">
            <Flame className="h-3 w-3" style={{ color: SAGE }} /> 15
          </span>
        </div>

        <div className="mt-4 flex items-center gap-3 text-[11px]">
          <span className="border-b-2 pb-1 font-medium tracking-tight" style={{ borderColor: SAGE }}>{copy.today}</span>
          <span className="font-light tracking-tight opacity-50">{copy.yesterday}</span>
        </div>

        <div className="mt-4 rounded-2xl bg-white/[0.06] p-4">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-[2rem] font-bold leading-none tabular-nums tracking-[-0.03em]" style={{ fontFamily: DISPLAY_FONT }}>
                1.250
              </div>
              <div className="mt-1 text-[10px] font-light tracking-tight opacity-70">{copy.caloriesLeft}</div>
            </div>
            <div className="relative h-14 w-14">
              <svg viewBox="0 0 36 36" className="h-full w-full -rotate-90">
                <circle cx="18" cy="18" r="15" stroke="rgba(255,255,255,0.1)" strokeWidth="3" fill="none" />
                <circle cx="18" cy="18" r="15" stroke={SAGE} strokeWidth="3" fill="none" strokeDasharray="62 100" strokeLinecap="round" />
              </svg>
              <Flame className="absolute inset-0 m-auto h-4 w-4" style={{ color: SAGE }} />
            </div>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-3 gap-2">
          {[
            { v: "78g", l: copy.protein, p: 85 },
            { v: "142g", l: copy.carbs, p: 64 },
            { v: "48g", l: copy.fat, p: 52 },
          ].map((m) => (
            <div key={m.l} className="rounded-2xl bg-white/[0.06] p-3">
              <div className="text-[13px] font-medium tabular-nums tracking-tight">{m.v}</div>
              <div className="text-[9px] font-light tracking-tight opacity-70">{m.l}</div>
              <div className="relative mx-auto mt-2 h-10 w-10">
                <svg viewBox="0 0 36 36" className="h-full w-full -rotate-90">
                  <circle cx="18" cy="18" r="15" stroke="rgba(255,255,255,0.1)" strokeWidth="3" fill="none" />
                  <circle cx="18" cy="18" r="15" stroke={SAGE} strokeWidth="3" fill="none" strokeDasharray={`${m.p} 100`} strokeLinecap="round" />
                </svg>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 text-[11px] font-medium tracking-tight">{copy.lastScanned}</div>
        <div className="mt-2 space-y-2">
          {[
            { t: copy.granola, s: copy.safe, c: SAGE },
            { t: copy.bread, s: copy.notSuitable, c: "#F87171" },
          ].map((i) => (
            <div key={i.t} className="flex items-center gap-2 rounded-2xl bg-white/[0.06] p-2">
              <div className="h-9 w-9 rounded-xl" style={{ backgroundColor: `${i.c}33` }} />
              <div className="flex-1 leading-tight">
                <div className="text-[11px] font-medium tracking-tight">{i.t}</div>
                <div className="text-[9px] font-light tracking-tight opacity-60">{i.s}</div>
              </div>
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: i.c }} />
            </div>
          ))}
        </div>
      </div>
    </PhoneFrame>
  );
}

