import { z } from "zod";

export const DietSchema = z.object({
  bmr: z.number(),
  tdee: z.number(),
  targetCalories: z.number(),
  macros: z.object({
    proteinG: z.number(),
    carbsG: z.number(),
    fatG: z.number(),
  }),
  summary: z.string(),
  meals: z.array(
    z.object({
      name: z.string(),
      calories: z.number(),
      items: z.array(z.string()),
    }),
  ),
  tips: z.array(z.string()),
});

export type DietPlan = z.infer<typeof DietSchema>;

export const ACTIVITY: Record<string, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  veryActive: 1.9,
};

function stripControl(value: string) {
  return Array.from(value)
    .filter((char) => {
      const code = char.charCodeAt(0);
      return code === 9 || code === 10 || code === 13 || code >= 32;
    })
    .join("");
}

function toNumber(value: unknown, fallback = 0) {
  if (typeof value === "number" && Number.isFinite(value)) return Math.round(value);
  if (typeof value === "string") {
    const n = Number(value.replace(/[^\d.,-]/g, "").replace(",", "."));
    if (Number.isFinite(n)) return Math.round(n);
  }
  return fallback;
}

function toStringArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value
      .map((v) => (typeof v === "string" ? v : typeof v === "number" ? String(v) : ""))
      .filter(Boolean)
      .slice(0, 12);
  }
  if (typeof value === "string" && value.trim()) return [value.trim()];
  return [];
}

/** Extracts a diet plan from a raw model response, tolerating markdown/loose JSON. */
export function parseDietPlan(text: string): DietPlan {
  let cleaned = text.replace(/```json\s*/gi, "").replace(/```\s*/g, "").trim();
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start === -1 || end === -1) throw new Error("AI did not return JSON");
  cleaned = stripControl(cleaned.slice(start, end + 1))
    .replace(/,\s*}/g, "}")
    .replace(/,\s*]/g, "]");

  let obj: any;
  try {
    obj = JSON.parse(cleaned);
  } catch {
    let repaired = cleaned;
    let braces = 0;
    let brackets = 0;
    for (const c of repaired) {
      if (c === "{") braces++;
      else if (c === "}") braces--;
      else if (c === "[") brackets++;
      else if (c === "]") brackets--;
    }
    while (brackets-- > 0) repaired += "]";
    while (braces-- > 0) repaired += "}";
    obj = JSON.parse(repaired);
  }

  const macros = obj?.macros ?? {};
  const rawMeals = Array.isArray(obj?.meals) ? obj.meals : [];

  return {
    bmr: toNumber(obj?.bmr),
    tdee: toNumber(obj?.tdee),
    targetCalories: toNumber(obj?.targetCalories),
    macros: {
      proteinG: toNumber(macros.proteinG ?? macros.protein),
      carbsG: toNumber(macros.carbsG ?? macros.carbs),
      fatG: toNumber(macros.fatG ?? macros.fat),
    },
    summary: typeof obj?.summary === "string" ? obj.summary : "",
    meals: rawMeals.slice(0, 8).map((m: any) => ({
      name: typeof m?.name === "string" ? m.name : "",
      calories: toNumber(m?.calories),
      items: toStringArray(m?.items),
    })),
    tips: toStringArray(obj?.tips),
  };
}

/** Fallback macro split when the model omits macros entirely. */
export function fallbackMacros(target: number, weightKg: number) {
  const proteinG = Math.round(Math.min(2.2 * weightKg, (target * 0.3) / 4));
  const fatG = Math.round((target * 0.28) / 9);
  const carbsG = Math.max(0, Math.round((target - proteinG * 4 - fatG * 9) / 4));
  return { proteinG, carbsG, fatG };
}

export function buildDietPrompt(args: {
  lang: "tr" | "en";
  target: number;
  bmr: number;
  tdee: number;
  allergies: string;
  conditions: string;
  diet: string;
}) {
  const { lang, target, bmr, tdee, allergies, conditions, diet } = args;
  const shape =
    'Respond ONLY with a single valid JSON object (no markdown, no commentary) exactly in this shape: {"bmr":number,"tdee":number,"targetCalories":number,"macros":{"proteinG":number,"carbsG":number,"fatG":number},"summary":string,"meals":[{"name":string,"calories":number,"items":string[]}],"tips":string[]}';

  const system =
    lang === "tr"
      ? `Sen kıdemli bir diyetisyen ve beslenme koçusun. TÜM metinleri Türkçe yaz. ASLA tıbbi teşhis koyma.\n${shape}`
      : `You are a senior dietitian and nutrition coach. Write ALL text in English. Never diagnose.\n${shape}`;

  const prompt =
    lang === "tr"
      ? `Kullanıcı için günlük beslenme planı hazırla.
Hedef kalori: ${target} kcal. BMR: ${bmr}, TDEE: ${tdee}.
Profil — Alerjiler: ${allergies}; Hastalıklar: ${conditions}; Diyet: ${diet}.
4 öğün öner (kahvaltı, öğle, atıştırma, akşam). Her öğüne kalori (sayı) ve 3-5 yiyecek/içecek yaz.
Türkiye mutfağına uygun, pratik ve uygulanabilir olsun. Makroları gram olarak sayı halinde hesapla.
2 cümlelik özet ve 3 ipucu ekle. Sadece JSON döndür.`
      : `Build a daily meal plan.
Target ${target} kcal. BMR ${bmr}, TDEE ${tdee}.
Profile — Allergies: ${allergies}; Conditions: ${conditions}; Diet: ${diet}.
Suggest 4 meals (breakfast, lunch, snack, dinner) with numeric calories and 3-5 items each.
Practical and balanced. Macros in grams as numbers.
Add a 2-sentence summary and 3 tips. Return JSON only.`;

  return { system, prompt };
}
