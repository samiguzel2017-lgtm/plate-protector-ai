import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Radar, Play, Square, ShieldAlert, ShieldCheck, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/_authenticated/simulator")({
  component: SimulatorPage,
});

type Event = {
  id: number;
  plate: string;
  status: "ok" | "blocked";
  reason: string;
  ts: number;
};

const LETTERS = "ABCDEFGHJKLMNPRSTUVYZ";
const CITIES = ["34", "06", "35", "16", "07", "01", "55", "27", "10", "20", "61", "44"];

function randomPlate() {
  const city = CITIES[Math.floor(Math.random() * CITIES.length)];
  const letters = Array.from({ length: 1 + Math.floor(Math.random() * 3) }, () =>
    LETTERS[Math.floor(Math.random() * LETTERS.length)],
  ).join("");
  const digits = String(Math.floor(100 + Math.random() * 9899)).padStart(2, "0");
  return `${city} ${letters} ${digits}`;
}

const REASONS_OK = [
  "Beyaz liste eşleşmesi",
  "Geçerli ruhsat kaydı",
  "Düzenli trafik akışı",
  "Plaka veri tabanında temiz",
];
const REASONS_BAD = [
  "Çalıntı plaka şüphesi",
  "Sahte kayıt tespit edildi",
  "Aranan araç eşleşmesi",
  "Kara liste vuruşu",
  "Sigortasız tescil",
];

const REASONS_OK_EN = ["Whitelist match", "Valid registration", "Normal traffic", "Clean database record"];
const REASONS_BAD_EN = ["Stolen plate suspected", "Forged record", "Wanted vehicle match", "Blacklist hit", "Uninsured registration"];

function SimulatorPage() {
  const { t, lang } = useI18n();
  const [running, setRunning] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);
  const [stats, setStats] = useState({ scanned: 0, blocked: 0 });
  const idRef = useRef(0);

  useEffect(() => {
    if (!running) return;
    const interval = setInterval(() => {
      const blocked = Math.random() < 0.28;
      const okList = lang === "tr" ? REASONS_OK : REASONS_OK_EN;
      const badList = lang === "tr" ? REASONS_BAD : REASONS_BAD_EN;
      const ev: Event = {
        id: ++idRef.current,
        plate: randomPlate(),
        status: blocked ? "blocked" : "ok",
        reason: blocked
          ? badList[Math.floor(Math.random() * badList.length)]
          : okList[Math.floor(Math.random() * okList.length)],
        ts: Date.now(),
      };
      setEvents((prev) => [ev, ...prev].slice(0, 30));
      setStats((s) => ({ scanned: s.scanned + 1, blocked: s.blocked + (blocked ? 1 : 0) }));

      // Persist for dashboard
      try {
        const today = new Date().toISOString().slice(0, 10);
        const raw = localStorage.getItem("alentra.security.stats");
        const data = raw ? JSON.parse(raw) : {};
        const day = data[today] ?? { scanned: 0, blocked: 0 };
        data[today] = { scanned: day.scanned + 1, blocked: day.blocked + (blocked ? 1 : 0) };
        localStorage.setItem("alentra.security.stats", JSON.stringify(data));
      } catch {}
    }, 1400);
    return () => clearInterval(interval);
  }, [running, lang]);

  return (
    <div className="container-x py-10 md:py-14">
      <div className="mb-8 flex items-center gap-3">
        <div className="rounded-2xl bg-[color-mix(in_oklab,var(--color-cyber)_18%,transparent)] p-3 ring-1 ring-[color-mix(in_oklab,var(--color-cyber)_45%,transparent)]">
          <Radar className="h-6 w-6 text-[var(--color-cyber)]" />
        </div>
        <div>
          <h1 className="font-serif text-3xl text-foreground">{t("sim.title")}</h1>
          <p className="text-sm text-muted-foreground">{t("sim.sub")}</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        {/* Radar */}
        <div className="relative overflow-hidden rounded-3xl border border-border bg-surface p-6 cyber-border">
          <div className="relative mx-auto aspect-square w-full max-w-md">
            {/* Concentric rings */}
            {[0.95, 0.7, 0.45, 0.2].map((s) => (
              <div
                key={s}
                className="absolute inset-0 rounded-full border border-[color-mix(in_oklab,var(--color-cyber)_35%,transparent)]"
                style={{ transform: `scale(${s})` }}
              />
            ))}
            {/* Cross */}
            <div className="absolute inset-x-0 top-1/2 h-px bg-[color-mix(in_oklab,var(--color-cyber)_25%,transparent)]" />
            <div className="absolute inset-y-0 left-1/2 w-px bg-[color-mix(in_oklab,var(--color-cyber)_25%,transparent)]" />
            {/* Sweep */}
            {running && (
              <>
                <div className="radar-sweep absolute inset-0">
                  <div
                    className="absolute left-1/2 top-1/2 h-1/2 w-1/2 origin-top-left"
                    style={{
                      background:
                        "conic-gradient(from 0deg, color-mix(in oklab, var(--color-neon) 55%, transparent), transparent 35%)",
                    }}
                  />
                </div>
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                  <div className="radar-pulse h-24 w-24 rounded-full bg-[color-mix(in_oklab,var(--color-neon)_25%,transparent)]" />
                </div>
              </>
            )}
            <div className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--color-neon)]" />
          </div>

          <div className="mt-6 flex items-center justify-between gap-3">
            <div className="flex gap-4">
              <StatPill label={t("sim.scanned")} value={stats.scanned} accent="neon" />
              <StatPill label={t("sim.blocked")} value={stats.blocked} accent="danger" />
            </div>
            <Button
              onClick={() => setRunning((r) => !r)}
              className="rounded-full neon-glow"
              variant={running ? "destructive" : "default"}
            >
              {running ? <Square className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
              {running ? t("sim.stop") : t("sim.start")}
            </Button>
          </div>
        </div>

        {/* Live feed */}
        <div className="rounded-3xl border border-border bg-surface p-6">
          <div className="mb-4 flex items-center gap-2">
            <Activity className="h-4 w-4 text-[var(--color-cyber)]" />
            <h2 className="font-serif text-lg text-foreground">{t("sim.feed")}</h2>
          </div>
          <ul className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
            {events.length === 0 && (
              <li className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
                {t("sim.empty")}
              </li>
            )}
            {events.map((e) => (
              <li
                key={e.id}
                className={`flex items-center justify-between gap-3 rounded-xl border p-3 ${
                  e.status === "blocked"
                    ? "border-[color-mix(in_oklab,var(--color-danger)_50%,transparent)] bg-[color-mix(in_oklab,var(--color-danger)_8%,transparent)]"
                    : "border-border bg-surface-muted/40"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  {e.status === "blocked" ? (
                    <ShieldAlert className="h-5 w-5 shrink-0 text-[var(--color-danger)]" />
                  ) : (
                    <ShieldCheck className="h-5 w-5 shrink-0 text-[var(--color-neon)]" />
                  )}
                  <div className="min-w-0">
                    <div className="font-mono text-sm font-semibold text-foreground tracking-wider">{e.plate}</div>
                    <div className="truncate text-xs text-muted-foreground">{e.reason}</div>
                  </div>
                </div>
                <span className="text-[10px] tabular-nums text-muted-foreground">
                  {new Date(e.ts).toLocaleTimeString()}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function StatPill({ label, value, accent }: { label: string; value: number; accent: "neon" | "danger" }) {
  return (
    <div className="rounded-xl border border-border bg-surface-muted/40 px-4 py-2">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div
        className="font-serif text-xl"
        style={{ color: accent === "neon" ? "var(--color-neon)" : "var(--color-danger)" }}
      >
        {value}
      </div>
    </div>
  );
}
