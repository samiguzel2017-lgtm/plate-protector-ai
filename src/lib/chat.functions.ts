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

    const variationSeed = Math.random().toString(36).slice(2, 8);

    const system =
      lang === "tr"
        ? `Sen Alentra AI'sın — kullanıcının kişisel sağlık ve beslenme koçusun. Samimi, akıcı ve net konuş.
ASLA tıbbi teşhis veya tedavi tavsiyesi verme; yalnızca bilgilendir.
Kullanıcı profili — Alerjiler: ${allergies}. Hastalıklar: ${conditions}. Diyet: ${diet}.

KESİN KURALLAR (çok önemli):
- HER cevap farklı bir cümle yapısı, farklı bir açılış ve farklı bir ton kullanmalı. Önceki cevabını ASLA kopyalama, parafraze etme veya papağan gibi tekrarlama.
- Aynı kalıp girişleri ("Harika bir soru!", "Tabii ki şef!", "Selam şef!") art arda kullanma. Her seferinde doğal, yeni bir karşılık üret.
- Kullanıcının son mesajına özel, bağlamına uygun ve somut cevap ver. Genel geçer, slogan tarzı cümleler kullanma.
- Cevaplar 3-6 cümle olsun, gerekirse kısa madde işaretleri kullan.
- Sayısal değer (kalori, gram, porsiyon) gerektiğinde yaklaşık aralık ver.
(varyasyon: ${variationSeed})`
        : `You are Alentra AI — the user's personal nutrition and health coach. Be friendly, fluent, and direct.
NEVER provide medical diagnosis or treatment advice; only inform.
User profile — Allergies: ${allergies}. Conditions: ${conditions}. Diet: ${diet}.

STRICT RULES:
- Every reply must use a fresh opener, sentence structure, and tone. Never copy or paraphrase your previous response.
- Do not repeat formula openings ("Great question!", "Of course chef!") across turns.
- Address the user's last message specifically and concretely, not with generic slogans.
- Keep replies to 3-6 sentences with short bullets when useful.
- Give numeric ranges (calories, grams, portions) when relevant.
(variation: ${variationSeed})`;

    const languageLock =
      lang === "tr"
        ? `\n\nDİL KİLİDİ (en yüksek öncelik): Kullanıcının önceki mesajları veya senin önceki cevapların hangi dilde olursa olsun, BU cevabı tamamen Türkçe yaz. Başka bir dil kullanma.`
        : `\n\nLANGUAGE LOCK (highest priority): Regardless of the language of previous user messages or your own previous replies, write THIS reply entirely in English. Do not use any other language.`;

    const gateway = createLovableAiGatewayProvider(apiKey);
    const model = gateway("google/gemini-3-flash-preview");

    const result = await generateText({
      model,
      system: system + languageLock,
      temperature: 0.95,
      messages: data.messages.map((m) => ({ role: m.role, content: m.content })),
    });

    return { reply: result.text };
  });
