import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useI18n } from "@/lib/i18n";
import { Disclaimer } from "@/components/Disclaimer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { X, Plus } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/profile")({
  component: ProfilePage,
});

const ALLERGY_PRESETS = ["Gluten", "Laktoz", "Süt", "Fıstık", "Kuruyemiş", "Yumurta", "Soya", "Balık", "Deniz Ürünleri", "Susam"];
const CONDITION_PRESETS = ["Diyabet", "Hipertansiyon", "Çölyak", "Böbrek", "Karaciğer", "Reflü", "Yüksek Kolesterol"];
const DIET_PRESETS = ["Vegan", "Vejetaryen", "Keto", "Düşük Karbonhidrat", "Şekersiz", "Helal"];

function ProfilePage() {
  const { t } = useI18n();
  const { user } = Route.useRouteContext();
  const qc = useQueryClient();

  const q = useQuery({
    queryKey: ["profile-edit", user.id],
    staleTime: 30_000,
    queryFn: async () => {
      const [{ data: p, error: e1 }, { data: hp, error: e2 }] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", user.id).maybeSingle(),
        supabase.from("health_profiles").select("*").eq("user_id", user.id).maybeSingle(),
      ]);
      if (e1) throw e1;
      if (e2) throw e2;
      return { profile: p, health: hp };
    },
  });

  const [name, setName] = useState("");
  const [allergies, setAllergies] = useState<string[]>([]);
  const [conditions, setConditions] = useState<string[]>([]);
  const [diet, setDiet] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
  const hydrated = useRef(false);

  useEffect(() => {
    if (!q.data || hydrated.current) return;
    hydrated.current = true;
    setName(q.data.profile?.display_name ?? "");
    setAllergies(q.data.health?.allergies ?? []);
    setConditions(q.data.health?.conditions ?? []);
    setDiet(q.data.health?.diet_preferences ?? []);
    setNotes(q.data.health?.notes ?? "");
  }, [q.data]);

  const save = useMutation({
    mutationFn: async () => {
      const { error: e1 } = await supabase
        .from("profiles")
        .upsert({ id: user.id, display_name: name.trim() }, { onConflict: "id" });
      if (e1) throw e1;
      const { error: e2 } = await supabase
        .from("health_profiles")
        .upsert(
          { user_id: user.id, allergies, conditions, diet_preferences: diet, notes },
          { onConflict: "user_id" },
        );
      if (e2) throw e2;
    },
    onSuccess: async () => {
      toast.success(t("prof.saved"));
      await qc.invalidateQueries({ queryKey: ["profile-edit", user.id] });
      qc.invalidateQueries({ queryKey: ["dash-profile"] });
    },
    onError: (e: any) => toast.error(e?.message ?? t("common.error")),
  });


  return (
    <div className="container-x anim-rise py-10 md:py-14">
      <div className="mb-8 max-w-2xl">
        <h1 className="font-serif text-4xl text-foreground">{t("prof.title")}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{t("prof.sub")}</p>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
        <div className="space-y-5">
          <div className="rounded-2xl border border-border bg-surface p-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="dname">{t("prof.name")}</Label>
                <Input id="dname" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
            </div>
          </div>

          <TagSection label={t("prof.allergies")} values={allergies} setValues={setAllergies} presets={ALLERGY_PRESETS} t={t} />
          <TagSection label={t("prof.conditions")} values={conditions} setValues={setConditions} presets={CONDITION_PRESETS} t={t} />
          <TagSection label={t("prof.diet")} values={diet} setValues={setDiet} presets={DIET_PRESETS} t={t} />

          <div className="rounded-2xl border border-border bg-surface p-6">
            <Label htmlFor="notes" className="mb-2 block">{t("prof.notes")}</Label>
            <Textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder={t("prof.notes.ph")} rows={4} />
          </div>

          <div className="flex justify-end">
            <Button onClick={() => save.mutate()} disabled={save.isPending} className="rounded-full">
              {save.isPending ? t("common.loading") : t("prof.save")}
            </Button>
          </div>
        </div>

        <div className="space-y-5">
          <Disclaimer />
        </div>
      </div>
    </div>
  );
}

function TagSection({ label, values, setValues, presets, t }: { label: string; values: string[]; setValues: (v: string[]) => void; presets: string[]; t: (k: string) => string }) {
  const [input, setInput] = useState("");
  const add = (v: string) => {
    const trimmed = v.trim();
    if (!trimmed || values.includes(trimmed)) return;
    setValues([...values, trimmed]);
    setInput("");
  };
  const remove = (v: string) => setValues(values.filter((x) => x !== v));
  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") { e.preventDefault(); add(input); }
  };
  return (
    <div className="rounded-2xl border border-border bg-surface p-6">
      <Label className="mb-3 block font-serif text-base">{label}</Label>
      <div className="mb-3 flex flex-wrap gap-1.5">
        {values.map((v) => (
          <span key={v} className="inline-flex items-center gap-1 rounded-full bg-primary px-2.5 py-1 text-xs text-primary-foreground">
            {v}
            <button type="button" onClick={() => remove(v)} className="rounded-full hover:bg-primary-foreground/20"><X className="h-3 w-3" /></button>
          </span>
        ))}
        {values.length === 0 && <span className="text-xs text-muted-foreground">—</span>}
      </div>
      <div className="flex gap-2">
        <Input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={onKey} placeholder={t("prof.placeholder")} />
        <Button type="button" variant="outline" onClick={() => add(input)} size="sm" className="rounded-full"><Plus className="h-4 w-4" /></Button>
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {presets.filter((p) => !values.includes(p)).map((p) => (
          <button key={p} type="button" onClick={() => add(p)} className="rounded-full border border-border bg-surface-muted/50 px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:border-primary hover:text-foreground">
            + {p}
          </button>
        ))}
      </div>
    </div>
  );
}
