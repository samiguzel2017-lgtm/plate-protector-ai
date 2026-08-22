import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Apple, Flame, Dumbbell, Sparkles, Loader2, Droplets, Copy, RotateCcw, ShoppingBasket, Clock } from "lucide-react";
import { generateDietPlan } from "@/lib/diet.functions";
import { useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/diet")({
  component: DietPage,
});

const selectClass =
  "h-10 w-full rounded-md border border-input bg-background px-3 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

function DietPage() {
  const { t, lang } = useI18n();
  const fn = useServerFn(generateDietPlan);

  const [age, setAge] = useState(30);
  const [sex, setSex] = useState<"male" | "female" | "other">("male");
  const [heightCm, setHeightCm] = useState(175);
  const [weightKg, setWeightKg] = useState(75);
  const [activity, setActivity] = useState<"sedentary" | "light" | "moderate" | "active" | "veryActive">("moderate");
  const [goal, setGoal] = useState<"lose" | "maintain" | "gain">("maintain");
  const [pace, setPace] = useState<"slow" | "normal" | "fast">("normal");
  const [mealsCount, setMealsCount] = useState(4);
  const [cuisine, setCuisine] = useState("");
  const [avoid, setAvoid] = useState("");

  const mut = useMutation({
    mutationFn: () =>
      fn({
        data: { age, sex, heightCm, weightKg, activity, goal, pace, mealsCount, cuisine, avoid, language: lang },
      }),
    onError: (e: any) => toast.error(e?.message ?? t("common.error")),
  });

  const plan = mut.data;

  const macroTotal = plan ? plan.macros.proteinG * 4 + plan.macros.carbsG * 4 + plan.macros.fatG * 9 || 1 : 1;
  const pct = (kcal: number) => Math.round((kcal / macroTotal) * 100);

  const copyPlan = async () => {
    if (!plan) return;
    const text = [
      `${t("diet.title")} — ${plan.targetCalories} kcal`,
      plan.summary,
      "",
      ...plan.meals.map((m) => `${m.time} ${m.name} (${m.calories} kcal)\n- ${m.items.join("\n- ")}`),
      "",
      `${t("diet.shopping")}: ${plan.shoppingList.join(", ")}`,
    ].join("\n");
    try {
      await navigator.clipboard.writeText(text);
      toast.success(t("diet.copied"));
    } catch {
      toast.error(t("common.error"));
    }
  };

  return (
    <div className="container-x py-10 md:py-14">
      <div className="mb-8 flex items-center gap-3 anim-rise">
        <div className="rounded-2xl bg-[color-mix(in_oklab,var(--color-neon)_18%,transparent)] p-3 ring-1 ring-[color-mix(in_oklab,var(--color-neon)_45%,transparent)]">
          <Apple className="h-6 w-6 text-[var(--color-neon)]" />
        </div>
        <div>
          <h1 className="font-serif text-3xl text-foreground">{t("diet.title")}</h1>
          <p className="text-sm text-muted-foreground">{t("diet.sub")}</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
        {/* Form */}
        <div className="anim-rise rounded-2xl border border-border bg-surface p-6 cyber-border">
          <h2 className="mb-4 font-serif text-lg text-foreground">{t("diet.form.title")}</h2>
          <div className="grid grid-cols-2 gap-4">
            <Field label={t("diet.age")}><Input type="number" value={age} onChange={(e) => setAge(+e.target.value)} /></Field>
            <Field label={t("diet.sex")}>
              <select value={sex} onChange={(e) => setSex(e.target.value as any)} className={selectClass}>
                <option value="male">{t("diet.sex.male")}</option>
                <option value="female">{t("diet.sex.female")}</option>
                <option value="other">{t("diet.sex.other")}</option>
              </select>
            </Field>
            <Field label={t("diet.height")}><Input type="number" value={heightCm} onChange={(e) => setHeightCm(+e.target.value)} /></Field>
            <Field label={t("diet.weight")}><Input type="number" value={weightKg} onChange={(e) => setWeightKg(+e.target.value)} /></Field>
            <Field label={t("diet.activity")}>
              <select value={activity} onChange={(e) => setActivity(e.target.value as any)} className={selectClass}>
                <option value="sedentary">{t("diet.act.sedentary")}</option>
                <option value="light">{t("diet.act.light")}</option>
                <option value="moderate">{t("diet.act.moderate")}</option>
                <option value="active">{t("diet.act.active")}</option>
                <option value="veryActive">{t("diet.act.veryActive")}</option>
              </select>
            </Field>
            <Field label={t("diet.goal")}>
              <select value={goal} onChange={(e) => setGoal(e.target.value as any)} className={selectClass}>
                <option value="lose">{t("diet.goal.lose")}</option>
                <option value="maintain">{t("diet.goal.maintain")}</option>
                <option value="gain">{t("diet.goal.gain")}</option>
              </select>
            </Field>
            <Field label={t("diet.pace")}>
              <select value={pace} onChange={(e) => setPace(e.target.value as any)} className={selectClass}>
                <option value="slow">{t("diet.pace.slow")}</option>
                <option value="normal">{t("diet.pace.normal")}</option>
                <option value="fast">{t("diet.pace.fast")}</option>
              </select>
            </Field>
            <Field label={t("diet.meals")}>
              <select value={mealsCount} onChange={(e) => setMealsCount(+e.target.value)} className={selectClass}>
                {[3, 4, 5, 6].map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </Field>
            <div className="col-span-2">
              <Field label={t("diet.cuisine")}>
                <Input value={cuisine} onChange={(e) => setCuisine(e.target.value)} placeholder={t("diet.cuisine.ph")} />
              </Field>
            </div>
            <div className="col-span-2">
              <Field label={t("diet.avoid")}>
                <Input value={avoid} onChange={(e) => setAvoid(e.target.value)} placeholder={t("diet.avoid.ph")} />
              </Field>
            </div>
          </div>
          <Button
            className="mt-6 w-full rounded-full neon-glow press"
            onClick={() => mut.mutate()}
            disabled={mut.isPending}
          >
            {mut.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
            {mut.isPending ? t("diet.generating") : plan ? t("diet.regenerate") : t("diet.generate")}
          </Button>
          <p className="mt-3 text-[11px] leading-relaxed text-muted-foreground">{t("diet.note")}</p>
        </div>

        {/* Result */}
        <div className="space-y-4">
          {!plan && !mut.isPending && (
            <div className="anim-rise rounded-2xl border border-dashed border-border bg-surface/40 p-10 text-center text-sm text-muted-foreground">
              {t("diet.empty")}
            </div>
          )}

          {mut.isPending && (
            <div className="space-y-4">
              <div className="grid grid-cols-4 gap-3">
                {[0, 1, 2, 3].map((i) => <div key={i} className="skeleton h-20 rounded-2xl" />)}
              </div>
              <div className="skeleton h-28 rounded-2xl" />
              <div className="skeleton h-40 rounded-2xl" />
            </div>
          )}

          {plan && !mut.isPending && (
            <div className="space-y-4 anim-rise">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <Stat icon={<Flame className="h-4 w-4" />} label={t("diet.stat.target")} value={`${plan.targetCalories}`} unit="kcal" />
                <Stat icon={<Dumbbell className="h-4 w-4" />} label="TDEE" value={`${plan.tdee}`} unit="kcal" />
                <Stat icon={<Sparkles className="h-4 w-4" />} label="BMR" value={`${plan.bmr}`} unit="kcal" />
                <Stat icon={<Droplets className="h-4 w-4" />} label={t("diet.water")} value={`${(plan.hydrationMl / 1000).toFixed(1)}`} unit="L" />
              </div>

              <div className="rounded-2xl border border-border bg-surface p-5">
                <p className="text-sm leading-relaxed text-foreground">{plan.summary}</p>

                <div className="mt-5 space-y-3">
                  <MacroBar label={t("result.protein")} grams={plan.macros.proteinG} percent={pct(plan.macros.proteinG * 4)} tone="var(--color-neon)" />
                  <MacroBar label={t("result.carbs")} grams={plan.macros.carbsG} percent={pct(plan.macros.carbsG * 4)} tone="var(--warning)" />
                  <MacroBar label={t("result.fat")} grams={plan.macros.fatG} percent={pct(plan.macros.fatG * 9)} tone="var(--primary)" />
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" className="rounded-full press" onClick={copyPlan}>
                    <Copy className="mr-1.5 h-3.5 w-3.5" />{t("diet.copy")}
                  </Button>
                  <Button variant="outline" size="sm" className="rounded-full press" onClick={() => mut.mutate()}>
                    <RotateCcw className="mr-1.5 h-3.5 w-3.5" />{t("diet.regenerate")}
                  </Button>
                </div>
              </div>

              <div className="space-y-3">
                {plan.meals.map((m, i) => (
                  <div
                    key={i}
                    className="anim-rise card-hover rounded-2xl border border-border bg-surface p-5"
                    style={{ animationDelay: `${i * 70}ms` }}
                  >
                    <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                      <h3 className="flex items-center gap-2 font-serif text-lg text-foreground">
                        {m.name}
                        {m.time && (
                          <span className="inline-flex items-center gap-1 text-xs font-normal text-muted-foreground">
                            <Clock className="h-3 w-3" />{m.time}
                          </span>
                        )}
                      </h3>
                      <span className="rounded-full bg-[color-mix(in_oklab,var(--color-neon)_15%,transparent)] px-3 py-0.5 text-xs font-medium text-[var(--color-neon)]">
                        {m.calories} kcal
                      </span>
                    </div>
                    <div className="mb-3 flex flex-wrap gap-1.5 text-[11px] text-muted-foreground">
                      <span className="rounded-full border border-border px-2 py-0.5">{t("result.protein")} {m.proteinG}g</span>
                      <span className="rounded-full border border-border px-2 py-0.5">{t("result.carbs")} {m.carbsG}g</span>
                      <span className="rounded-full border border-border px-2 py-0.5">{t("result.fat")} {m.fatG}g</span>
                    </div>
                    <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                      {m.items.map((it, j) => (<li key={j}>{it}</li>))}
                    </ul>
                  </div>
                ))}
              </div>

              {plan.shoppingList.length > 0 && (
                <div className="rounded-2xl border border-border bg-surface p-5">
                  <h3 className="mb-3 flex items-center gap-2 font-medium text-foreground">
                    <ShoppingBasket className="h-4 w-4 text-[var(--color-neon)]" />{t("diet.shopping")}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {plan.shoppingList.map((s, i) => (
                      <span key={i} className="rounded-full border border-border bg-surface-muted/60 px-3 py-1 text-xs text-foreground">{s}</span>
                    ))}
                  </div>
                </div>
              )}

              {plan.tips.length > 0 && (
                <div className="rounded-2xl border border-border bg-surface-muted/50 p-5">
                  <h3 className="mb-2 font-medium text-foreground">{t("diet.tips")}</h3>
                  <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                    {plan.tips.map((tip, i) => (<li key={i}>{tip}</li>))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs">{label}</Label>
      {children}
    </div>
  );
}

function Stat({ icon, label, value, unit }: { icon: React.ReactNode; label: string; value: string; unit?: string }) {
  return (
    <div className="card-hover rounded-2xl border border-border bg-surface p-4">
      <div className="mb-1 flex items-center gap-1.5 text-xs text-muted-foreground">{icon}<span className="truncate">{label}</span></div>
      <div className="font-serif text-xl text-foreground">
        {value}
        {unit && <span className="ml-1 text-xs font-normal text-muted-foreground">{unit}</span>}
      </div>
    </div>
  );
}

function MacroBar({ label, grams, percent, tone }: { label: string; grams: number; percent: number; tone: string }) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium text-foreground">{grams} g · {percent}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-surface-muted">
        <div
          className="h-full rounded-full bar-grow"
          style={{ width: `${Math.min(percent, 100)}%`, background: tone }}
        />
      </div>
    </div>
  );
}
