import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { generateText } from "ai";
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

function removeControlCharacters(value: string) {
  return Array.from(value)
    .filter((char) => {
      const code = char.charCodeAt(0);
      return code === 9 || code === 10 || code === 13 || code >= 32;
    })
    .join("");
}

function extractAnalysis(text: string): z.infer<typeof AnalysisSchema> {
  let cleaned = text
    .replace(/```json\s*/gi, "")
    .replace(/```\s*/g, "")
    .trim();
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start === -1 || end === -1) throw new Error("AI did not return JSON");
  cleaned = removeControlCharacters(cleaned.slice(start, end + 1))
    .replace(/,\s*}/g, "}")
    .replace(/,\s*]/g, "]");

  let obj: unknown;
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

  const lenient = AnalysisSchema.partial()
    .extend({
      status: z.enum(["safe", "warning", "danger"]).catch("warning"),
      title: z.string().catch(""),
      summary: z.string().catch(""),
    })
    .parse(obj);

  return {
    status: lenient.status ?? "warning",
    title: lenient.title ?? "",
    summary: lenient.summary ?? "",
    ingredients: lenient.ingredients ?? [],
    allergens_detected: lenient.allergens_detected ?? [],
    risks: lenient.risks ?? [],
    recommendations: lenient.recommendations ?? [],
    nutrition_estimate: lenient.nutrition_estimate ?? {
      calories: "",
      protein: "",
      carbs: "",
      fat: "",
    },
  };
}

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
    const conditions =
      (hp?.conditions ?? []).join(", ") || (data.language === "tr" ? "yok" : "none");
    const diet =
      (hp?.diet_preferences ?? []).join(", ") ||
      (data.language === "tr" ? "yok" : "none");

    const langInstruction =
      data.language === "tr" ? "TÜM yanıtı Türkçe yaz." : "Write the entire response in English.";

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
Keep arrays short (max ~8 entries each). Be specific, not generic.
Respond ONLY with a single valid JSON object (no markdown, no commentary) matching exactly this shape:
{"status":"safe|warning|danger","title":string,"summary":string,"ingredients":string[],"allergens_detected":string[],"risks":string[],"recommendations":string[],"nutrition_estimate":{"calories":string,"protein":string,"carbs":string,"fat":string}}`;

    const gateway = createLovableAiGatewayProvider(apiKey);
    const model = gateway("google/gemini-3-flash-preview");

    let dataUrl = data.imageBase64;
    if (!dataUrl.startsWith("data:")) dataUrl = `data:image/jpeg;base64,${dataUrl}`;

    let parsed: z.infer<typeof AnalysisSchema>;
    try {
      const result = await generateText({
        model,
        system,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text:
                  data.type === "product"
                    ? "Analyze this product/label. Return only the JSON object."
                    : "Analyze this meal. Return only the JSON object.",
              },
              { type: "image", image: dataUrl },
            ],
          },
        ],
      });

      parsed = extractAnalysis(result.text);
    } catch (error) {
      console.error("Alentra image analysis failed", error);
      parsed = {
        status: "warning",
        title: data.language === "tr" ? "Analiz tamamlanamadı" : "Analysis unavailable",
        summary:
          data.language === "tr"
            ? "AI yanıtı beklenen formatta alınamadı. Ürün etiketini ve içerik listesini dikkatlice kontrol edin."
            : "The AI response could not be read in the expected format. Please review the label and ingredient list carefully.",
        ingredients: [],
        allergens_detected: [],
        risks: [
          data.language === "tr"
            ? "Görsel analizi doğrulanamadı"
            : "Image analysis could not be verified",
        ],
        recommendations: [
          data.language === "tr"
            ? "Şüpheli durumlarda ürünü tüketmeden önce uzman görüşü alın."
            : "When uncertain, consult a qualified professional before consuming.",
        ],
        nutrition_estimate: { calories: "", protein: "", carbs: "", fat: "" },
      };
    }

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
