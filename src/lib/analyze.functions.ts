import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { generateText, Output } from "ai";
import { z } from "zod";
import { createLovableAiGatewayProvider } from "./ai-gateway.server";

const AnalysisSchema = z.object({
  status: z.enum(["safe", "warning", "danger"]),
  title: z.string(),
  summary: z.string(),
  ingredients: z.array(z.string()),
  allergens_detected: z.array(z.string()),
  risks: z.array(z.string()),
  recommendations: z.array(z.string()),
  nutrition_estimate: z.object({
    calories: z.string(),
    protein: z.string(),
    carbs: z.string(),
    fat: z.string(),
  }),
});

const InputSchema = z.object({
  imageBase64: z.string().min(20),
  imageUrl: z.string().min(1),
  type: z.enum(["product", "meal"]),
  language: z.enum(["tr", "en"]).default("tr"),
});

export const analyzeImage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => InputSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) throw new Error("AI gateway not configured");

    const { data: hp } = await supabase
      .from("health_profiles")
      .select("allergies, conditions, diet_preferences, notes")
      .eq("user_id", userId)
      .maybeSingle();

    const allergies = (hp?.allergies ?? []).join(", ") || (data.language === "tr" ? "yok" : "none");
    const conditions = (hp?.conditions ?? []).join(", ") || (data.language === "tr" ? "yok" : "none");
    const diet = (hp?.diet_preferences ?? []).join(", ") || (data.language === "tr" ? "yok" : "none");

    const langInstruction = data.language === "tr"
      ? "TÜM yanıtı Türkçe yaz."
      : "Write the entire response in English.";

    const system = `You are Alentra AI, a food-safety assistant for a specific user.
${langInstruction}
NEVER provide medical diagnosis or treatment advice. You only inform.
User profile — Allergies: ${allergies}. Conditions: ${conditions}. Dietary preferences: ${diet}.
Task: Examine the photo (a ${data.type === "product" ? "packaged product / ingredient label" : "meal / dish"}).
Identify likely ingredients, allergens and risks RELATIVE TO THE USER'S PROFILE.
Decide status:
- "safe" if no relevant risks for this user.
- "warning" if uncertain, ambiguous, or contains mild concern items.
- "danger" if contains ingredients that conflict with their allergies/conditions/diet.
Provide a brief title for the item.
Estimate nutrition per typical serving as short strings (e.g. "~250 kcal").
Recommendations should be informational (e.g. "Etiketi kontrol edin"), never medical advice.
Keep arrays short (max ~8 entries each). Be specific, not generic.`;

    const gateway = createLovableAiGatewayProvider(apiKey);
    const model = gateway("google/gemini-3-flash-preview");

    let dataUrl = data.imageBase64;
    if (!dataUrl.startsWith("data:")) dataUrl = `data:image/jpeg;base64,${dataUrl}`;

    const result = await generateText({
      model,
      system,
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: data.type === "product" ? "Analyze this product/label." : "Analyze this meal." },
            { type: "image", image: dataUrl },
          ],
        },
      ],
      experimental_output: Output.object({ schema: AnalysisSchema }),
    });

    const parsed = result.experimental_output;

    const { data: inserted, error } = await supabase
      .from("analyses")
      .insert({
        user_id: userId,
        image_url: data.imageUrl,
        type: data.type,
        status: parsed.status,
        title: parsed.title,
        result: parsed,
      })
      .select("id")
      .single();

    if (error) throw new Error(error.message);
    return { id: inserted.id, result: parsed };
  });
