import { z } from "zod";

export const MealSchema = z.object({
  name: z.string(),
  time: z.string(),
  calories: z.number(),
  proteinG: z.number(),
  carbsG: z.number(),
  fatG: z.number(),
  items: z.array(z.string()),
});

export const DietSchema = z.object({
  bmr: z.number(),
  tdee: z.number(),
  targetCalories: z.number(),
  hydrationMl: z.number(),
  macros: z.object({
    proteinG: z.number(),
    carbsG: z.number(),
    fatG: z.number(),
  }),
  summary: z.string(),
  meals: z.array(MealSchema),
  tips: z.array(z.string()),
  shoppingList: z.array(z.string()),
});

export type DietPlan = z.infer<typeof DietSchema>;
export type Meal = z.infer<typeof MealSchema>;

export const ACTIVITY: Record<string, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  veryActive: 1.9,
};

export const PACE: Record<string, number> = {
  slow: 0.5,
  normal: 1,
  fast: 1.5,
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

function toStringArray(value: unknown, max = 14): string[] {
  if (Array.isArray(value)) {
    return value
      .map((v) => {
        if (typeof v === "string") return v.trim();
        if (typeof v === "number") return String(v);
        if (v && typeof v === "object") {
          const o = v as Record<string, unknown>;
          const name = typeof o.name === "string" ? o.name : typeof o.item === "string" ? o.item : "";
          const qty = typeof o.quantity === "string" ? o.quantity : typeof o.amount === "string" ? o.amount : "";
          return [name, qty].filter(Boolean).join(" — ");
        }
        return "";
      })
      .filter(Boolean)
      .slice(0, max);
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
    hydrationMl: toNumber(obj?.hydrationMl ?? obj?.waterMl),
    macros: {
      proteinG: toNumber(macros.proteinG ?? macros.protein),
      carbsG: toNumber(macros.carbsG ?? macros.carbs),
      fatG: toNumber(macros.fatG ?? macros.fat),
    },
    summary: typeof obj?.summary === "string" ? obj.summary : "",
    meals: rawMeals.slice(0, 8).map((m: any) => ({
      name: typeof m?.name === "string" ? m.name : "",
      time: typeof m?.time === "string" ? m.time : "",
      calories: toNumber(m?.calories),
      proteinG: toNumber(m?.proteinG ?? m?.protein),
      carbsG: toNumber(m?.carbsG ?? m?.carbs),
      fatG: toNumber(m?.fatG ?? m?.fat),
      items: toStringArray(m?.items),
    })),
    tips: toStringArray(obj?.tips, 8),
    shoppingList: toStringArray(obj?.shoppingList ?? obj?.shopping_list, 24),
  };
}

/** Fallback macro split when the model omits macros entirely. */
export function fallbackMacros(target: number, weightKg: number) {
  const proteinG = Math.round(Math.min(2.2 * weightKg, (target * 0.3) / 4));
  const fatG = Math.round((target * 0.28) / 9);
  const carbsG = Math.max(0, Math.round((target - proteinG * 4 - fatG * 9) / 4));
  return { proteinG, carbsG, fatG };
}

const MEAL_NAMES = {
  tr: ["Kahvaltı", "Ara Öğün", "Öğle Yemeği", "İkindi", "Akşam Yemeği", "Gece Ara Öğünü"],
  en: ["Breakfast", "Morning snack", "Lunch", "Afternoon snack", "Dinner", "Evening snack"],
};

const MEAL_TIMES = ["08:00", "10:30", "13:00", "16:00", "19:30", "21:30"];

const MEAL_ITEMS = {
  tr: [
    ["Yulaf ezmesi", "Yoğurt", "Mevsim meyvesi"],
    ["Bir avuç badem", "Yeşil çay"],
    ["Izgara tavuk / mercimek", "Bulgur pilavı", "Mevsim salata"],
    ["Meyve", "Ayran"],
    ["Fırında balık veya sebze yemeği", "Zeytinyağlı salata", "Tam tahıllı ekmek"],
    ["Kefir", "Ceviz"],
  ],
  en: [
    ["Oatmeal", "Plain yoghurt", "Seasonal fruit"],
    ["Handful of almonds", "Green tea"],
    ["Grilled chicken / lentils", "Whole grain side", "Large salad"],
    ["Fruit", "Buttermilk"],
    ["Baked fish or vegetable stew", "Olive oil salad", "Whole grain bread"],
    ["Kefir", "Walnuts"],
  ],
};

/** Deterministic plan used when the model output is unusable. */
export function buildFallbackPlan(args: {
  lang: "tr" | "en";
  bmr: number;
  tdee: number;
  target: number;
  weightKg: number;
  mealsCount: number;
  hydrationMl: number;
}): DietPlan {
  const { lang, bmr, tdee, target, weightKg, mealsCount, hydrationMl } = args;
  const macros = fallbackMacros(target, weightKg);
  const count = Math.min(Math.max(mealsCount, 3), 6);
  const indexes = count <= 3 ? [0, 2, 4] : count === 4 ? [0, 2, 3, 4] : count === 5 ? [0, 1, 2, 3, 4] : [0, 1, 2, 3, 4, 5];
  const share = 1 / indexes.length;

  return {
    bmr,
    tdee,
    targetCalories: target,
    hydrationMl,
    macros,
    summary:
      lang === "tr"
        ? `Günlük hedefiniz ${target} kcal olarak hesaplandı. Aşağıdaki dağılım, hedefinize ulaşmak için dengeli bir başlangıç şablonudur.`
        : `Your daily target is ${target} kcal. The split below is a balanced starting template for your goal.`,
    meals: indexes.map((idx) => ({
      name: MEAL_NAMES[lang][idx]!,
      time: MEAL_TIMES[idx]!,
      calories: Math.round(target * share),
      proteinG: Math.round(macros.proteinG * share),
      carbsG: Math.round(macros.carbsG * share),
      fatG: Math.round(macros.fatG * share),
      items: MEAL_ITEMS[lang][idx]!,
    })),
    tips:
      lang === "tr"
        ? [
            "Her öğünde bir protein kaynağı bulundurun.",
            `Gün içinde yaklaşık ${Math.round(hydrationMl / 100) / 10} L su içmeyi hedefleyin.`,
            "Haftada en az 150 dakika orta şiddette hareket edin.",
          ]
        : [
            "Include a protein source in every meal.",
            `Aim for roughly ${Math.round(hydrationMl / 100) / 10} L of water per day.`,
            "Target at least 150 minutes of moderate activity per week.",
          ],
    shoppingList: Array.from(new Set(indexes.flatMap((idx) => MEAL_ITEMS[lang][idx]!))),
  };
}

/** Fills in missing/zero fields so the UI always has a complete plan. */
export function normalizeDietPlan(
  plan: DietPlan,
  base: { lang: "tr" | "en"; bmr: number; tdee: number; target: number; weightKg: number; mealsCount: number; hydrationMl: number },
): DietPlan {
  const fb = buildFallbackPlan(base);
  const macros =
    plan.macros.proteinG > 0 && plan.macros.carbsG > 0 && plan.macros.fatG > 0 ? plan.macros : fb.macros;
  const meals = plan.meals.filter((m) => m.name && m.items.length > 0);
  const totalCals = meals.reduce((s, m) => s + m.calories, 0) || base.target;

  return {
    bmr: base.bmr,
    tdee: base.tdee,
    targetCalories: base.target,
    hydrationMl: plan.hydrationMl > 500 ? plan.hydrationMl : base.hydrationMl,
    macros,
    summary: plan.summary || fb.summary,
    meals: (meals.length > 0 ? meals : fb.meals).map((m, i) => {
      const share = m.calories > 0 ? m.calories / totalCals : 1 / (meals.length || fb.meals.length);
      return {
        ...m,
        time: m.time || MEAL_TIMES[Math.min(i, MEAL_TIMES.length - 1)]!,
        calories: m.calories > 0 ? m.calories : Math.round(base.target * share),
        proteinG: m.proteinG > 0 ? m.proteinG : Math.round(macros.proteinG * share),
        carbsG: m.carbsG > 0 ? m.carbsG : Math.round(macros.carbsG * share),
        fatG: m.fatG > 0 ? m.fatG : Math.round(macros.fatG * share),
      };
    }),
    tips: plan.tips.length > 0 ? plan.tips : fb.tips,
    shoppingList:
      plan.shoppingList.length > 0
        ? plan.shoppingList
        : Array.from(new Set((meals.length > 0 ? meals : fb.meals).flatMap((m) => m.items))).slice(0, 24),
  };
}

export function buildDietPrompt(args: {
  lang: "tr" | "en";
  target: number;
  bmr: number;
  tdee: number;
  allergies: string;
  conditions: string;
  diet: string;
  mealsCount: number;
  pace: string;
  goal: string;
  cuisine: string;
  avoid: string;
  hydrationMl: number;
}) {
  const {
    lang, target, bmr, tdee, allergies, conditions, diet,
    mealsCount, pace, goal, cuisine, avoid, hydrationMl,
  } = args;

  const shape =
    'Respond ONLY with a single valid JSON object (no markdown, no commentary) exactly in this shape: {"bmr":number,"tdee":number,"targetCalories":number,"hydrationMl":number,"macros":{"proteinG":number,"carbsG":number,"fatG":number},"summary":string,"meals":[{"name":string,"time":string,"calories":number,"proteinG":number,"carbsG":number,"fatG":number,"items":string[]}],"tips":string[],"shoppingList":string[]}';

  const system =
    lang === "tr"
      ? `Sen kıdemli bir diyetisyen ve beslenme koçusun. TÜM metinleri Türkçe yaz. ASLA tıbbi teşhis koyma.\n${shape}`
      : `You are a senior dietitian and nutrition coach. Write ALL text in English. Never diagnose.\n${shape}`;

  const prompt =
    lang === "tr"
      ? `Kullanıcı için günlük beslenme planı hazırla.
Hedef kalori: ${target} kcal. BMR: ${bmr}, TDEE: ${tdee}. Hedef: ${goal}. Tempo: ${pace}.
Profil — Alerjiler: ${allergies}; Hastalıklar: ${conditions}; Diyet: ${diet}.
Kaçınılan besinler: ${avoid}. Mutfak tercihi: ${cuisine}. Su hedefi: ${hydrationMl} ml.
Tam ${mealsCount} öğün öner. Her öğün için isim, saat (HH:MM), kalori ve protein/karbonhidrat/yağ gramajı ver, 3-5 yiyecek/içecek yaz.
Öğün kalorileri toplamı hedefe yakın olsun. Pratik, uygulanabilir ve mutfak tercihine uygun olsun.
2-3 cümlelik özet, 4 ipucu ve 10-16 kalemlik alışveriş listesi ekle. Sadece JSON döndür.`
      : `Build a daily meal plan.
Target ${target} kcal. BMR ${bmr}, TDEE ${tdee}. Goal: ${goal}. Pace: ${pace}.
Profile — Allergies: ${allergies}; Conditions: ${conditions}; Diet: ${diet}.
Foods to avoid: ${avoid}. Cuisine preference: ${cuisine}. Water target: ${hydrationMl} ml.
Suggest exactly ${mealsCount} meals. For each give a name, time (HH:MM), calories, protein/carb/fat grams and 3-5 items.
Meal calories should sum close to the target. Keep it practical and aligned with the cuisine preference.
Add a 2-3 sentence summary, 4 tips and a 10-16 item shopping list. Return JSON only.`;

  return { system, prompt };
}
