## Alentra AI — MVP Planı (güncellendi)

Yapay zekâ destekli kişisel gıda güvenliği analiz platformu. İlk sürümde: kullanıcı girişi, sağlık profili, fotoğraf yükleme, Gemini Vision ile analiz, üç seviyeli sonuç ve geçmiş.

### Tasarım & Tonalite (kullanıcı isteklerine göre)
- **Kurumsal sağlık teknolojisi estetiği**: Sade, profesyonel, modern. Apple/Linear seviyesinde sadelik + medikal yazılım ciddiyeti.
- **Emoji yok**: Sonuç durumları dahil hiçbir yerde emoji kullanılmayacak. Bunun yerine ince çizgili Lucide ikonları + renk kodlu rozetler (Yeşil/Sarı/Kırmızı) + metin etiketleri ("Güvenli" / "Dikkat" / "Uygun Değil").
- **Dolu ama dengeli düzen**: Geniş boş alanlar yok; bilgi yoğunluğu yüksek ama nefes alan, simetrik grid yapısı. Her sayfa ekranı anlamlı içerik bloklarıyla doldurulacak (özet kartları, ikincil bilgi panelleri, son aktiviteler vb.).
- **Yasal disclaimer**: Şu metin landing hero altı, fotoğraf yükleme ekranı ve her analiz sonuç sayfasında görünür şekilde gösterilecek:
  > "Bu uygulama yalnızca bilgilendirme amaçlıdır; kesinlikle tıbbi bir teşhis, tedavi veya doktor tavsiyesi yerine geçmez. Sağlık durumunuzla ilgili her türlü karar için lütfen mutlaka uzman bir doktora başvurunuz."
  Ayrıca footer'da her sayfada kalıcı olarak.
- **Renkler** (`src/styles.css` içinde oklch token'lar): Lacivert `#1F3A5F` primary, Yeşil `#2ECC71` safe, Sarı `#F1C40F` warning, Kırmızı `#E74C3C` danger.
- **Tipografi**: Inter (UI) + serif aksanlı başlık (örn. Instrument Serif) — güven veren editorial his.
- **Logo**: Kalkan + yaprak + AI devre konseptli SVG (lacivert/yeşil).

### Kapsam (bu sürüm)
- Landing sayfası (hero, özellikler, nasıl çalışır, disclaimer, footer)
- Email/şifre + Google ile giriş
- Sağlık profili (alerjiler, hastalıklar, beslenme tercihleri — preset listeler + serbest giriş)
- Fotoğraf yükleme & AI analiz (ürün etiketi veya yemek)
- Üç seviyeli sonuç raporu (içerikler, alerjenler, riskler, besin değeri tahmini)
- Geçmiş analizler listesi + detay
- TR/EN dil değiştirici (varsayılan TR, LocalStorage'da kalıcı, tüm UI çevirili)

### Kapsam dışı (sonraki sürüm)
Aile/çocuk profilleri, abonelik paketleri (Stripe), gelişmiş raporlar, OCR-only mod.

---

### Rotalar
- `/` — Landing
- `/auth` — Giriş / Kayıt
- `/_authenticated/dashboard` — Özet: profil snapshot, hızlı analiz CTA, son 5 analiz, ipucu kartı, disclaimer
- `/_authenticated/profile` — Sağlık profili düzenleme
- `/_authenticated/analyze` — Fotoğraf yükle + analiz et (disclaimer banner)
- `/_authenticated/history` — Tüm geçmiş, filtre (Güvenli/Dikkat/Uygun Değil)
- `/_authenticated/analysis/$id` — Detaylı rapor (disclaimer banner)

### Veritabanı (Lovable Cloud)
- `profiles` — user_id, display_name, language ('tr'|'en'), created_at
- `health_profiles` — user_id, allergies (text[]), conditions (text[]), diet_preferences (text[]), notes
- `analyses` — id, user_id, image_url, type ('product'|'meal'), status ('safe'|'warning'|'danger'), result (jsonb: ingredients, allergens_detected, risks, nutrition_estimate, summary, recommendations), created_at
- Storage bucket: `food-images` (private, user-scoped RLS)
- Tüm tablolarda RLS + `auth.uid()` policy + GRANT statements
- Yeni kullanıcıda profile + boş health_profile auto-create trigger

### Backend
- `analyzeImage` server fn (`requireSupabaseAuth`): kullanıcı sağlık profilini alır, Lovable AI Gateway → `google/gemini-3-flash-preview` (vision) çağırır, yapılandırılmış JSON (Zod ile) döner, `analyses` tablosuna kaydeder.
- Sistem promptu: profili dikkate al, seçili dile yanıt ver, üç seviyeli risk değerlendir, hiçbir yerde tıbbi teşhis koyma, sadece bilgilendirme yap.

### Entegrasyonlar
- Lovable Cloud (auth + DB + storage)
- Lovable AI Gateway (Gemini 3 Flash vision)
- Google OAuth (`supabase--configure_social_auth`)

### i18n
- `src/lib/i18n.ts` — TR/EN sözlükler, basit `t()` hook, dil context'i, LocalStorage persistance, header'da dil değiştirici. Disclaimer metni iki dilde.

### Uygulama sırası
1. Lovable Cloud etkinleştir, AI key, Google OAuth
2. Tasarım token'ları (oklch), tipografi, logo SVG, i18n altyapısı
3. Landing + footer (disclaimer dahil)
4. Auth sayfası + `_authenticated` layout
5. DB migration (tablolar + RLS + trigger + storage bucket)
6. Profil sayfası
7. `analyzeImage` server fn + analyze sayfası
8. Sonuç detay + history + dashboard
9. Polish, simetri/yoğunluk kontrolü, emoji denetimi, disclaimer denetimi