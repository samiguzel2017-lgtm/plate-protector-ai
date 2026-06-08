import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { generateText, Output } from "ai";
import { z } from "zod";
import { createLovableAiGatewayProvider } from "./ai-gateway.server";

const InputSchema = z.object({
  age: z.number().min(10).max(100),
  sex: z.enum(["male", "female", "other"]),
  heightCm: z.number().min(120).max(230),
  weightKg: z.number().min(30).max(250),
  activity: z.enum(["sedentary", "light", "moderate", "active", "veryActive"]),
  goal: z.enum(["lose", "maintain", "gain"]),
  language: z.enum(["tr", "en"]).default("tr"),
});

const DietSchema = z.object({
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

const ACTIVITY: Record<string, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  veryActive: 1.9,
};

export const generateDietPlan = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => InputSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) throw new Error("AI gateway not configured");

    const { data: hp } = await supabase
      .from("health_profiles")
      .select("allergies, conditions, diet_preferences")
      .eq("user_id", userId)
      .maybeSingle();

    // Mifflin-St Jeor
    const s = data.sex === "male" ? 5 : data.sex === "female" ? -161 : -78;
    const bmr = Math.round(10 * data.weightKg + 6.25 * data.heightCm - 5 * data.age + s);
    const tdee = Math.round(bmr * ACTIVITY[data.activity]);
    const target = data.goal === "lose" ? tdee - 500 : data.goal === "gain" ? tdee + 350 : tdee;

    const lang = data.language;
    const allergies = (hp?.allergies ?? []).join(", ") || (lang === "tr" ? "yok" : "none");
    const conditions = (hp?.conditions ?? []).join(", ") || (lang === "tr" ? "yok" : "none");
    const diet = (hp?.diet_preferences ?? []).join(", ") || (lang === "tr" ? "yok" : "none");

    const system =
      lang === "tr"
        ? `Sen kıdemli bir diyetisyen ve beslenme koçusun. Türkçe, kısa ve net cevap ver. ASLA tıbbi teşhis koyma.`
        : `You are a senior dietitian and nutrition coach. Reply in English, concise and clear. Never diagnose.`;

    const prompt =
      lang === "tr"
        ? `Kullanıcı için günlük beslenme planı hazırla.
Hedef kalori: ${target} kcal. BMR: ${bmr}, TDEE: ${tdee}.
Profil — Alerjiler: ${allergies}; Hastalıklar: ${conditions}; Diyet: ${diet}.
4 öğün öner (kahvaltı, öğle, atıştırma, akşam). Her öğüne kalori ve 3-5 yiyecek/içecek yaz.
Türkiye mutfağına uygun, pratik ve uygulanabilir olsun. Makroları gram olarak hesapla.
Kısa bir özet (2 cümle) ve 3 ipucu ekle.`
        : `Build a daily meal plan.
Target ${target} kcal. BMR ${bmr}, TDEE ${tdee}.
Profile — Allergies: ${allergies}; Conditions: ${conditions}; Diet: ${diet}.
Suggest 4 meals (breakfast, lunch, snack, dinner) with calorie totals and 3-5 food items each.
Practical, balanced. Include macros in grams, a 2-sentence summary and 3 tips.`;

    const gateway = createLovableAiGatewayProvider(apiKey);
    const model = gateway("google/gemini-3-flash-preview");

    const { experimental_output } = await generateText({
      model,
      system,
      prompt,
      temperature: 0.7,
      experimental_output: Output.object({ schema: DietSchema }),
    });

    // Trust calculated values for energy fields
    return {
      ...experimental_output,
      bmr,
      tdee,
      targetCalories: target,
    };
  });
