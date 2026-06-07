import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { generateText } from "ai";
import { z } from "zod";
import { createLovableAiGatewayProvider } from "./ai-gateway.server";

const MessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().min(1).max(4000),
});

const InputSchema = z.object({
  messages: z.array(MessageSchema).min(1).max(40),
  language: z.enum(["tr", "en"]).default("tr"),
});

export const chatWithAlentra = createServerFn({ method: "POST" })
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

    const lang = data.language;
    const allergies = (hp?.allergies ?? []).join(", ") || (lang === "tr" ? "yok" : "none");
    const conditions = (hp?.conditions ?? []).join(", ") || (lang === "tr" ? "yok" : "none");
    const diet = (hp?.diet_preferences ?? []).join(", ") || (lang === "tr" ? "yok" : "none");

    const system =
      lang === "tr"
        ? `Sen Alentra AI'sın — kullanıcının kişisel sağlık ve beslenme koçusun. Samimi, kısa ve net konuş.
ASLA tıbbi teşhis veya tedavi tavsiyesi verme; yalnızca bilgilendir.
Kullanıcı profili — Alerjiler: ${allergies}. Hastalıklar: ${conditions}. Diyet: ${diet}.
Cevapları kısa tut (en fazla 4-6 cümle). Gerekirse maddeleme kullan.`
        : `You are Alentra AI — the user's personal nutrition and health coach. Be friendly, concise and clear.
NEVER provide medical diagnosis or treatment advice; only inform.
User profile — Allergies: ${allergies}. Conditions: ${conditions}. Diet: ${diet}.
Keep answers short (max 4-6 sentences). Use bullet points when helpful.`;

    const gateway = createLovableAiGatewayProvider(apiKey);
    const model = gateway("google/gemini-3-flash-preview");

    const result = await generateText({
      model,
      system,
      messages: data.messages.map((m) => ({ role: m.role, content: m.content })),
    });

    return { reply: result.text };
  });
