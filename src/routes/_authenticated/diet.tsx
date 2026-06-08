import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Apple, Flame, Dumbbell, Sparkles, Loader2 } from "lucide-react";
import { generateDietPlan } from "@/lib/diet.functions";
import { useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/diet")({
  component: DietPage,
});

function DietPage() {
  const { t, lang } = useI18n();
  const fn = useServerFn(generateDietPlan);

  const [age, setAge] = useState(30);
  const [sex, setSex] = useState<"male" | "female" | "other">("male");
  const [heightCm, setHeightCm] = useState(175);
  const [weightKg, setWeightKg] = useState(75);
  const [activity, setActivity] = useState<"sedentary" | "light" | "moderate" | "active" | "veryActive">("moderate");
  const [goal, setGoal] = useState<"lose" | "maintain" | "gain">("maintain");

  const mut = useMutation({
    mutationFn: () => fn({ data: { age, sex, heightCm, weightKg, activity, goal, language: lang } }),
    onError: (e: any) => toast.error(e?.message ?? t("common.error")),
  });

  const plan = mut.data;

  return (
    <div className="container-x py-10 md:py-14">
      <div className="mb-8 flex items-center gap-3">
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
        <div className="rounded-2xl border border-border bg-surface p-6 cyber-border">
          <h2 className="mb-4 font-serif text-lg text-foreground">{t("diet.form.title")}</h2>
          <div className="grid grid-cols-2 gap-4">
            <Field label={t("diet.age")}><Input type="number" value={age} onChange={(e) => setAge(+e.target.value)} /></Field>
            <Field label={t("diet.sex")}>
              <select value={sex} onChange={(e) => setSex(e.target.value as any)} className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm">
                <option value="male">{t("diet.sex.male")}</option>
                <option value="female">{t("diet.sex.female")}</option>
                <option value="other">{t("diet.sex.other")}</option>
              </select>
            </Field>
            <Field label={t("diet.height")}><Input type="number" value={heightCm} onChange={(e) => setHeightCm(+e.target.value)} /></Field>
            <Field label={t("diet.weight")}><Input type="number" value={weightKg} onChange={(e) => setWeightKg(+e.target.value)} /></Field>
            <Field label={t("diet.activity")}>
              <select value={activity} onChange={(e) => setActivity(e.target.value as any)} className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm">
                <option value="sedentary">{t("diet.act.sedentary")}</option>
                <option value="light">{t("diet.act.light")}</option>
                <option value="moderate">{t("diet.act.moderate")}</option>
                <option value="active">{t("diet.act.active")}</option>
                <option value="veryActive">{t("diet.act.veryActive")}</option>
              </select>
            </Field>
            <Field label={t("diet.goal")}>
              <select value={goal} onChange={(e) => setGoal(e.target.value as any)} className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm">
                <option value="lose">{t("diet.goal.lose")}</option>
                <option value="maintain">{t("diet.goal.maintain")}</option>
                <option value="gain">{t("diet.goal.gain")}</option>
              </select>
            </Field>
          </div>
          <Button
            className="mt-6 w-full rounded-full neon-glow"
            onClick={() => mut.mutate()}
            disabled={mut.isPending}
          >
            {mut.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
            {mut.isPending ? t("diet.generating") : t("diet.generate")}
          </Button>
        </div>

        {/* Result */}
        <div className="space-y-4">
          {!plan && !mut.isPending && (
            <div className="rounded-2xl border border-dashed border-border bg-surface/40 p-10 text-center text-sm text-muted-foreground">
              {t("diet.empty")}
            </div>
          )}

          {plan && (
            <>
              <div className="grid grid-cols-3 gap-3">
                <Stat icon={<Flame className="h-4 w-4" />} label={t("diet.stat.target")} value={`${plan.targetCalories} kcal`} />
                <Stat icon={<Dumbbell className="h-4 w-4" />} label="TDEE" value={`${plan.tdee} kcal`} />
                <Stat icon={<Sparkles className="h-4 w-4" />} label="BMR" value={`${plan.bmr} kcal`} />
              </div>
              <div className="rounded-2xl border border-border bg-surface p-5">
                <p className="text-sm leading-relaxed text-foreground">{plan.summary}</p>
                <div className="mt-4 grid grid-cols-3 gap-3 text-center text-xs">
                  <Macro label={t("result.protein")} value={`${plan.macros.proteinG} g`} />
                  <Macro label={t("result.carbs")} value={`${plan.macros.carbsG} g`} />
                  <Macro label={t("result.fat")} value={`${plan.macros.fatG} g`} />
                </div>
              </div>

              <div className="space-y-3">
                {plan.meals.map((m, i) => (
                  <div key={i} className="rounded-2xl border border-border bg-surface p-5">
                    <div className="mb-2 flex items-center justify-between">
                      <h3 className="font-serif text-lg text-foreground">{m.name}</h3>
                      <span className="rounded-full bg-[color-mix(in_oklab,var(--color-neon)_15%,transparent)] px-3 py-0.5 text-xs font-medium text-[var(--color-neon)]">
                        {m.calories} kcal
                      </span>
                    </div>
                    <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                      {m.items.map((it, j) => (<li key={j}>{it}</li>))}
                    </ul>
                  </div>
                ))}
              </div>

              {plan.tips.length > 0 && (
                <div className="rounded-2xl border border-border bg-surface-muted/50 p-5">
                  <h3 className="mb-2 font-medium text-foreground">{t("diet.tips")}</h3>
                  <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                    {plan.tips.map((tip, i) => (<li key={i}>{tip}</li>))}
                  </ul>
                </div>
              )}
            </>
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

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <div className="mb-1 flex items-center gap-1.5 text-xs text-muted-foreground">{icon}<span>{label}</span></div>
      <div className="font-serif text-xl text-foreground">{value}</div>
    </div>
  );
}

function Macro({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-surface-muted/60 p-3">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-0.5 font-medium text-foreground">{value}</div>
    </div>
  );
}
