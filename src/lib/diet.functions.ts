import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { generateText } from "ai";
import { z } from "zod";
import { createLovableAiGatewayProvider } from "./ai-gateway.server";
import {
  ACTIVITY,
  PACE,
  buildDietPrompt,
  buildFallbackPlan,
  normalizeDietPlan,
  parseDietPlan,
} from "./diet-plan.server";

const InputSchema = z.object({
  age: z.number().min(10).max(100),
  sex: z.enum(["male", "female", "other"]),
  heightCm: z.number().min(120).max(230),
  weightKg: z.number().min(30).max(250),
  activity: z.enum(["sedentary", "light", "moderate", "active", "veryActive"]),
  goal: z.enum(["lose", "maintain", "gain"]),
  pace: z.enum(["slow", "normal", "fast"]).default("normal"),
  mealsCount: z.number().min(3).max(6).default(4),
  cuisine: z.string().max(60).default(""),
  avoid: z.string().max(300).default(""),
  language: z.enum(["tr", "en"]).default("tr"),
});

export const generateDietPlan = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => InputSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const apiKey = process.env.LOVABLE_API_KEY;
    const lang = data.language;

    const { data: hp } = await supabase
      .from("health_profiles")
      .select("allergies, conditions, diet_preferences")
      .eq("user_id", userId)
      .maybeSingle();

    // Mifflin-St Jeor
    const s = data.sex === "male" ? 5 : data.sex === "female" ? -161 : -78;
    const bmr = Math.round(10 * data.weightKg + 6.25 * data.heightCm - 5 * data.age + s);
    const tdee = Math.round(bmr * (ACTIVITY[data.activity] ?? 1.55));
    const delta = Math.round(400 * (PACE[data.pace] ?? 1));
    const rawTarget =
      data.goal === "lose" ? tdee - delta : data.goal === "gain" ? tdee + Math.round(delta * 0.8) : tdee;
    const target = Math.max(1200, rawTarget);
    const hydrationMl = Math.round((data.weightKg * 33) / 50) * 50;

    const base = {
      lang,
      bmr,
      tdee,
      target,
      weightKg: data.weightKg,
      mealsCount: data.mealsCount,
      hydrationMl,
    };

    if (!apiKey) return buildFallbackPlan(base);

    const none = lang === "tr" ? "yok" : "none";
    const allergies = (hp?.allergies ?? []).join(", ") || none;
    const conditions = (hp?.conditions ?? []).join(", ") || none;
    const diet = (hp?.diet_preferences ?? []).join(", ") || none;

    const { system, prompt } = buildDietPrompt({
      lang,
      target,
      bmr,
      tdee,
      allergies,
      conditions,
      diet,
      mealsCount: data.mealsCount,
      pace: data.pace,
      goal: data.goal,
      cuisine: data.cuisine || (lang === "tr" ? "Türk mutfağı" : "mixed / mediterranean"),
      avoid: data.avoid || none,
      hydrationMl,
    });

    try {
      const gateway = createLovableAiGatewayProvider(apiKey);
      const result = await generateText({
        model: gateway("google/gemini-3-flash-preview"),
        system,
        prompt,
        temperature: 0.7,
      });
      return normalizeDietPlan(parseDietPlan(result.text), base);
    } catch (error) {
      console.error("Alentra diet plan generation failed", error);
      return buildFallbackPlan(base);
    }
  });
