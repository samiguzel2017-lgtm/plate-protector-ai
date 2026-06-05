import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const InputSchema = z.object({
  barcode: z.string().min(4).max(32).regex(/^[0-9A-Za-z]+$/),
  language: z.enum(["tr", "en"]).default("tr"),
});

type Status = "safe" | "warning" | "danger";

function norm(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

export const analyzeBarcode = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => InputSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const tr = data.language === "tr";

    // 1. Fetch user health profile
    const { data: hp } = await supabase
      .from("health_profiles")
      .select("allergies, conditions, diet_preferences")
      .eq("user_id", userId)
      .maybeSingle();

    const allergies = (hp?.allergies ?? []).map(norm);
    const conditions = (hp?.conditions ?? []).map(norm);
    const diets = (hp?.diet_preferences ?? []).map(norm);

    // 2. Fetch Open Food Facts
    const res = await fetch(
      `https://world.openfoodfacts.org/api/v2/product/${encodeURIComponent(data.barcode)}.json`,
      { headers: { "User-Agent": "Alentra-AI/1.0" } },
    );
    const json: any = res.ok ? await res.json() : null;
    const product = json?.product ?? null;

    if (!product || json?.status === 0) {
      throw new Error(
        tr
          ? `Barkod bulunamadı: ${data.barcode}. Lütfen fotoğrafla analiz deneyin.`
          : `Product not found: ${data.barcode}. Try photo analysis instead.`,
      );
    }

    const title: string =
      product.product_name ||
      product.product_name_tr ||
      product.product_name_en ||
      (tr ? "Ürün" : "Product");

    const brand: string = product.brands ?? "";

    const ingredientsList: string[] = Array.isArray(product.ingredients)
      ? product.ingredients.map((i: any) => i.text).filter(Boolean)
      : (product.ingredients_text ?? "")
          .split(/[,;]+/)
          .map((s: string) => s.trim())
          .filter(Boolean);

    const allergensTags: string[] = (product.allergens_tags ?? []).map((t: string) =>
      t.replace(/^[a-z]{2}:/, "").replace(/-/g, " "),
    );
    const tracesTags: string[] = (product.traces_tags ?? []).map((t: string) =>
      t.replace(/^[a-z]{2}:/, "").replace(/-/g, " "),
    );

    // 3. Risk classification
    const ingredientsNorm = ingredientsList.map(norm).join(" ");
    const allergensNorm = allergensTags.map(norm).join(" ");
    const tracesNorm = tracesTags.map(norm).join(" ");
    const haystack = `${ingredientsNorm} ${allergensNorm}`;

    const matchedAllergies = allergies.filter((a) => a && haystack.includes(a));
    const matchedDietConflicts = diets.filter((d) => d && ingredientsNorm.includes(d));
    const tracesMatch = allergies.filter((a) => a && tracesNorm.includes(a));

    let status: Status = "safe";
    const risks: string[] = [];

    if (matchedAllergies.length > 0 || matchedDietConflicts.length > 0) {
      status = "danger";
      if (matchedAllergies.length)
        risks.push(
          tr
            ? `Profilinizdeki alerjenler tespit edildi: ${matchedAllergies.join(", ")}`
            : `Allergens from your profile detected: ${matchedAllergies.join(", ")}`,
        );
      if (matchedDietConflicts.length)
        risks.push(
          tr
            ? `Beslenme tercihinizle çelişiyor: ${matchedDietConflicts.join(", ")}`
            : `Conflicts with your diet preferences: ${matchedDietConflicts.join(", ")}`,
        );
    } else if (tracesMatch.length > 0 || (product.nutriscore_grade ?? "").match(/[de]/i)) {
      status = "warning";
      if (tracesMatch.length)
        risks.push(
          tr
            ? `İz miktarda alerjen riski: ${tracesMatch.join(", ")}`
            : `Trace allergen risk: ${tracesMatch.join(", ")}`,
        );
      if ((product.nutriscore_grade ?? "").match(/[de]/i))
        risks.push(
          tr
            ? `Düşük Nutri-Score (${(product.nutriscore_grade as string).toUpperCase()})`
            : `Low Nutri-Score (${(product.nutriscore_grade as string).toUpperCase()})`,
        );
    }

    if (conditions.length > 0) {
      // Soft warnings for sugar / sodium relative to common conditions
      const sugar = Number(product.nutriments?.sugars_100g ?? 0);
      const salt = Number(product.nutriments?.salt_100g ?? 0);
      const sat = Number(product.nutriments?.["saturated-fat_100g"] ?? 0);
      if (conditions.some((c) => c.includes("diyabet") || c.includes("diabet")) && sugar > 12.5) {
        if (status === "safe") status = "warning";
        risks.push(
          tr
            ? `Yüksek şeker (100g'da ${sugar.toFixed(1)}g) — diyabet için dikkat`
            : `High sugar (${sugar.toFixed(1)}g/100g) — caution for diabetes`,
        );
      }
      if (
        conditions.some((c) => c.includes("hiperta") || c.includes("hypert") || c.includes("tansiyon")) &&
        salt > 1.25
      ) {
        if (status === "safe") status = "warning";
        risks.push(
          tr
            ? `Yüksek tuz (100g'da ${salt.toFixed(2)}g) — tansiyon için dikkat`
            : `High salt (${salt.toFixed(2)}g/100g) — caution for hypertension`,
        );
      }
      if (
        conditions.some((c) => c.includes("kolesterol") || c.includes("cholest") || c.includes("kalp"))
        && sat > 5
      ) {
        if (status === "safe") status = "warning";
        risks.push(
          tr
            ? `Yüksek doymuş yağ (100g'da ${sat.toFixed(1)}g)`
            : `High saturated fat (${sat.toFixed(1)}g/100g)`,
        );
      }
    }

    const summary =
      status === "safe"
        ? tr
          ? `${title} — profiline göre belirgin bir risk bulunamadı.`
          : `${title} — no notable risk found for your profile.`
        : status === "warning"
          ? tr
            ? `${title} — dikkat edilmesi gereken noktalar var.`
            : `${title} — some points to watch.`
          : tr
            ? `${title} — bu ürün profilinle uyumsuz görünüyor.`
            : `${title} — this product appears unsuitable for your profile.`;

    const n = product.nutriments ?? {};
    const result = {
      status,
      title: brand ? `${title} · ${brand}` : title,
      summary,
      ingredients: ingredientsList.slice(0, 20),
      allergens_detected: Array.from(new Set([...allergensTags, ...tracesTags])).slice(0, 12),
      risks,
      recommendations: [
        tr
          ? "Etiketteki bilgileri her zaman kontrol edin; üretici formülünü değiştirebilir."
          : "Always double-check the label; manufacturers may change formulations.",
      ],
      nutrition_estimate: {
        calories: n["energy-kcal_100g"] ? `${Math.round(n["energy-kcal_100g"])} kcal/100g` : "",
        protein: n.proteins_100g != null ? `${n.proteins_100g}g/100g` : "",
        carbs: n.carbohydrates_100g != null ? `${n.carbohydrates_100g}g/100g` : "",
        fat: n.fat_100g != null ? `${n.fat_100g}g/100g` : "",
      },
      source: "openfoodfacts",
      barcode: data.barcode,
      image_url: product.image_url ?? product.image_front_url ?? null,
    };

    const { data: inserted, error } = await supabase
      .from("analyses")
      .insert({
        user_id: userId,
        image_url: result.image_url ?? `barcode:${data.barcode}`,
        type: "product",
        status,
        title: result.title,
        result,
      })
      .select("id")
      .single();

    if (error) throw new Error(error.message);
    return { id: inserted.id };
  });
