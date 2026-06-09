import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type Lang = "tr" | "en" | "ar";

type Dict = Record<string, string>;

const tr: Dict = {
  "brand.name": "Alentra AI",
  "brand.tagline": "Fotoğrafını Çek, Sağlığını Koru.",
  "brand.intro": "Yapay zekâ destekli kişisel gıda güvenliği ve beslenme asistanı.",

  "nav.features": "Özellikler",
  "nav.how": "Nasıl Çalışır",
  "nav.dashboard": "Panel",
  "nav.profile": "Sağlık Profili",
  "nav.analyze": "Analiz Et",
  "nav.history": "Geçmiş",
  "nav.chat": "Sohbet",
  "nav.diet": "Diyet Asistanı",
  "nav.signin": "Giriş Yap",
  "nav.signup": "Kayıt Ol",
  "nav.signout": "Çıkış Yap",
  "nav.getstarted": "Ücretsiz Başla",

  "cta.start": "Hemen Başla",
  "cta.learn": "Nasıl çalıştığını gör",

  "hero.title": "Alentra AI ile tanışın: Sadece bir fotoğrafla sağlığınızı koruyun.",
  "hero.sub": "Sağlık profilinize göre kişiselleştirilmiş gıda analizi. Etiketi veya yemeği fotoğraflayın; alerjenler, içerikler ve besin değerleri saniyeler içinde ekranınıza gelsin.",
  "hero.social": "Binlerce kullanıcı tarafından tercih edildi ve",

  "feat.title": "Sağlığınızı koruyan dört temel yetenek",
  "feat.profile.t": "Kişisel Sağlık Profili",
  "feat.profile.d": "Alerjileriniz, kronik hastalıklarınız ve beslenme tercihlerinizi tek bir yerde toplayın. Her analiz otomatik olarak size göre çalışır.",
  "feat.scan.t": "Fotoğraf ile Anında Analiz",
  "feat.scan.d": "Ürün etiketi veya yemek fotoğrafını yükleyin. Yapay zekâ içerikleri tanır, alerjenleri ve riskleri belirler.",
  "feat.result.t": "Üç Seviyeli Sonuç",
  "feat.result.d": "Güvenli, Dikkat veya Uygun Değil. Net renk kodlu kararlar ile saniyeler içinde bilinçli seçim yapın.",
  "feat.history.t": "Geçmiş ve İçgörü",
  "feat.history.d": "Tüm analizleriniz güvenle saklanır. Eğilimlerinizi takip edin, doktor görüşmelerinize hazırlıklı gidin.",

  "how.title": "Üç adımda güvenli seçim",
  "how.1.t": "Profilinizi oluşturun",
  "how.1.d": "Alerjilerinizi, hastalıklarınızı ve diyet tercihlerinizi ekleyin.",
  "how.2.t": "Fotoğrafı yükleyin",
  "how.2.d": "Markette, restoranda veya evde — fotoğrafı seçin ve analiz et'e dokunun.",
  "how.3.t": "Sonucu okuyun",
  "how.3.d": "Renk kodlu sonuç ve detaylı içerik raporu birkaç saniyede elinizde.",

  "disclaimer.title": "Yasal Uyarı",
  "disclaimer.body": "Bu uygulama yalnızca bilgilendirme amaçlıdır. Tıbbi teşhis veya tedavi sağlamaz. Alerjiler, kronik hastalıklar ve özel sağlık durumlarında doktor veya diyetisyen tavsiyesi alınmalıdır.",

  "footer.rights": "Tüm hakları saklıdır.",
  "footer.product": "Ürün",
  "footer.legal": "Yasal",
  "footer.company": "Şirket",
  "footer.privacy": "Gizlilik Politikası",
  "footer.terms": "Kullanım Şartları",
  "footer.about": "Hakkımızda",
  "footer.contact": "İletişim",

  "auth.title": "Hesabınıza giriş yapın",
  "auth.title.signup": "Yeni hesap oluşturun",
  "auth.sub": "E-posta ile veya Google hesabınızla devam edin.",
  "auth.email": "E-posta",
  "auth.password": "Şifre",
  "auth.name": "Ad Soyad",
  "auth.signin": "Giriş Yap",
  "auth.signup": "Hesap Oluştur",
  "auth.google": "Google ile devam et",
  "auth.toggle.tosignup": "Hesabınız yok mu? Kayıt olun",
  "auth.toggle.tosignin": "Zaten hesabınız var mı? Giriş yapın",
  "auth.or": "veya",

  "dash.welcome": "Hoş geldiniz",
  "dash.quick.t": "Hızlı Analiz",
  "dash.quick.d": "Bir ürün etiketi veya yemek fotoğrafı yükleyin.",
  "dash.quick.cta": "Analiz başlat",
  "dash.profile.t": "Sağlık Profiliniz",
  "dash.profile.empty": "Henüz sağlık profili tanımlamadınız. Doğru analiz için ekleyin.",
  "dash.profile.edit": "Profili düzenle",
  "dash.recent.t": "Son Analizler",
  "dash.recent.empty": "Henüz analiz yapmadınız.",
  "dash.recent.view": "Tümünü gör",
  "dash.tip.t": "Daha iyi sonuç için ipucu",
  "dash.tip.d": "İçerik etiketini net ve düz çekin; aydınlık ortamda gölgesiz fotoğraflar en doğru sonucu verir.",
  "dash.score.t": "Günlük Sağlık Puanı",
  "dash.water.t": "Akıllı Su Takibi",
  "dash.water.unit": "bardak",

  "prof.title": "Sağlık Profili",
  "prof.sub": "Bilgileriniz yalnızca size aittir. Her analiz otomatik olarak bu profili dikkate alır.",
  "prof.name": "Görünen ad",
  "prof.lang": "Dil tercihi",
  "prof.allergies": "Alerjiler",
  "prof.conditions": "Hastalıklar",
  "prof.diet": "Beslenme tercihleri",
  "prof.notes": "Ek notlar",
  "prof.notes.ph": "Doktor uyarıları, hassasiyetler vs.",
  "prof.add": "Ekle",
  "prof.placeholder": "Yazın ve Enter'a basın",
  "prof.save": "Kaydet",
  "prof.saved": "Profil güncellendi.",

  "analyze.title": "Yeni Analiz",
  "analyze.sub": "Fotoğrafı seçin veya kameradan çekin. Yapay zekâ sizin için değerlendirsin.",
  "analyze.dropzone": "Fotoğraf seçin veya buraya bırakın",
  "analyze.type": "Tür",
  "analyze.type.product": "Ürün / Etiket",
  "analyze.type.meal": "Yemek / Tabak",
  "analyze.run": "Analiz Et",
  "analyze.running": "Analiz ediliyor...",
  "analyze.change": "Fotoğrafı değiştir",
  "analyze.noprofile": "Önce sağlık profilinizi oluşturun.",

  "result.safe": "Güvenli",
  "result.warning": "Dikkat",
  "result.danger": "Uygun Değil",
  "result.summary": "Özet",
  "result.ingredients": "Tespit edilen içerikler",
  "result.allergens": "Alerjen riskleri",
  "result.risks": "Sağlık riskleri",
  "result.nutrition": "Tahmini besin değeri",
  "result.recommendations": "Öneriler",
  "result.calories": "Kalori",
  "result.protein": "Protein",
  "result.carbs": "Karbonhidrat",
  "result.fat": "Yağ",
  "result.none": "Belirgin bir bulgu yok.",
  "result.back": "Panele dön",

  "history.title": "Analiz Geçmişi",
  "history.empty": "Henüz analiz yok.",
  "history.filter.all": "Tümü",

  "common.cancel": "Vazgeç",
  "common.save": "Kaydet",
  "common.loading": "Yükleniyor...",
  "common.error": "Bir hata oluştu.",

  "diet.title": "Yapay Zeka Diyet Asistanı",
  "diet.sub": "Profilinize göre günlük kalori, makro ve öğün planı.",
  "diet.form.title": "Bilgileriniz",
  "diet.age": "Yaş",
  "diet.sex": "Cinsiyet",
  "diet.sex.male": "Erkek",
  "diet.sex.female": "Kadın",
  "diet.sex.other": "Diğer",
  "diet.height": "Boy (cm)",
  "diet.weight": "Kilo (kg)",
  "diet.activity": "Aktivite",
  "diet.act.sedentary": "Hareketsiz",
  "diet.act.light": "Az aktif",
  "diet.act.moderate": "Orta",
  "diet.act.active": "Aktif",
  "diet.act.veryActive": "Çok aktif",
  "diet.goal": "Hedef",
  "diet.goal.lose": "Kilo ver",
  "diet.goal.maintain": "Koru",
  "diet.goal.gain": "Kilo al",
  "diet.generate": "Planı Hazırla",
  "diet.generating": "Hazırlanıyor...",
  "diet.empty": "Bilgilerinizi girin ve yapay zekanın size özel planı oluşturmasını izleyin.",
  "diet.stat.target": "Hedef Kalori",
  "diet.tips": "İpuçları",

  "chat.voice.start": "Sesli mesaj başlat",
  "chat.voice.stop": "Sesli mesajı durdur",
  "chat.voice.speak": "Cevabı sesli oku",
  "chat.voice.stopSpeak": "Sesi durdur",
  "chat.voice.unsupported": "Tarayıcınız sesli girişi desteklemiyor.",
};

const en: Dict = {
  "brand.name": "Alentra AI",
  "brand.tagline": "Snap. Know. Stay Safe.",
  "brand.intro": "AI-powered personal food safety & nutrition assistant.",

  "nav.features": "Features",
  "nav.how": "How it works",
  "nav.dashboard": "Dashboard",
  "nav.profile": "Health Profile",
  "nav.analyze": "Analyze",
  "nav.history": "History",
  "nav.chat": "Chat",
  "nav.diet": "Diet Coach",
  "nav.signin": "Sign In",
  "nav.signup": "Sign Up",
  "nav.signout": "Sign Out",
  "nav.getstarted": "Get Started Free",

  "cta.start": "Get Started",
  "cta.learn": "See how it works",

  "hero.title": "Meet Alentra AI: Protect your health with just a photo.",
  "hero.sub": "Personalized food analysis tailored to your health profile. Snap a label or meal and see allergens, ingredients and nutrition in seconds.",
  "hero.social": "Trusted by thousands of users, rated",

  "feat.title": "Four capabilities that protect your health",
  "feat.profile.t": "Personal Health Profile",
  "feat.profile.d": "Centralize allergies, chronic conditions and diet preferences. Every analysis tailors itself to you automatically.",
  "feat.scan.t": "Instant Photo Analysis",
  "feat.scan.d": "Upload a product label or meal photo. AI identifies ingredients, allergens and risks.",
  "feat.result.t": "Three-Level Verdict",
  "feat.result.d": "Safe, Caution or Not Suitable. Crisp color-coded decisions for confident choices.",
  "feat.history.t": "History & Insight",
  "feat.history.d": "All analyses stored privately. Spot trends, arrive prepared at doctor visits.",

  "how.title": "Three steps to a safer choice",
  "how.1.t": "Build your profile",
  "how.1.d": "Add allergies, conditions and dietary preferences.",
  "how.2.t": "Upload a photo",
  "how.2.d": "Supermarket, restaurant or home — pick a photo and tap analyze.",
  "how.3.t": "Read the result",
  "how.3.d": "Color-coded verdict and detailed report in seconds.",

  "disclaimer.title": "Medical Disclaimer",
  "disclaimer.body": "This application is for informational purposes only. It does not provide medical diagnosis or treatment. For allergies, chronic conditions and special health needs, consult a qualified doctor or dietitian.",

  "footer.rights": "All rights reserved.",
  "footer.product": "Product",
  "footer.legal": "Legal",
  "footer.company": "Company",
  "footer.privacy": "Privacy Policy",
  "footer.terms": "Terms of Service",
  "footer.about": "About Us",
  "footer.contact": "Contact Us",

  "auth.title": "Sign in to your account",
  "auth.title.signup": "Create a new account",
  "auth.sub": "Continue with email or your Google account.",
  "auth.email": "Email",
  "auth.password": "Password",
  "auth.name": "Full name",
  "auth.signin": "Sign In",
  "auth.signup": "Create Account",
  "auth.google": "Continue with Google",
  "auth.toggle.tosignup": "No account? Sign up",
  "auth.toggle.tosignin": "Have an account? Sign in",
  "auth.or": "or",

  "dash.welcome": "Welcome",
  "dash.quick.t": "Quick Analysis",
  "dash.quick.d": "Upload a product label or meal photo.",
  "dash.quick.cta": "Start analysis",
  "dash.profile.t": "Your Health Profile",
  "dash.profile.empty": "No health profile yet. Add it for accurate analyses.",
  "dash.profile.edit": "Edit profile",
  "dash.recent.t": "Recent Analyses",
  "dash.recent.empty": "No analyses yet.",
  "dash.recent.view": "View all",
  "dash.tip.t": "Tip for better results",
  "dash.tip.d": "Shoot the ingredient label straight and in good light — clean shots produce the most accurate analyses.",
  "dash.score.t": "Daily Health Score",
  "dash.water.t": "Smart Water Tracker",
  "dash.water.unit": "glasses",

  "prof.title": "Health Profile",
  "prof.sub": "Your information stays private and powers every analysis.",
  "prof.name": "Display name",
  "prof.lang": "Language",
  "prof.allergies": "Allergies",
  "prof.conditions": "Conditions",
  "prof.diet": "Dietary preferences",
  "prof.notes": "Additional notes",
  "prof.notes.ph": "Doctor warnings, sensitivities, etc.",
  "prof.add": "Add",
  "prof.placeholder": "Type and press Enter",
  "prof.save": "Save",
  "prof.saved": "Profile updated.",

  "analyze.title": "New Analysis",
  "analyze.sub": "Pick a photo or capture one. Let AI assess it for you.",
  "analyze.dropzone": "Choose a photo or drop one here",
  "analyze.type": "Type",
  "analyze.type.product": "Product / Label",
  "analyze.type.meal": "Meal / Dish",
  "analyze.run": "Analyze",
  "analyze.running": "Analyzing...",
  "analyze.change": "Change photo",
  "analyze.noprofile": "Please complete your health profile first.",

  "result.safe": "Safe",
  "result.warning": "Caution",
  "result.danger": "Not Suitable",
  "result.summary": "Summary",
  "result.ingredients": "Detected ingredients",
  "result.allergens": "Allergen risks",
  "result.risks": "Health risks",
  "result.nutrition": "Estimated nutrition",
  "result.recommendations": "Recommendations",
  "result.calories": "Calories",
  "result.protein": "Protein",
  "result.carbs": "Carbs",
  "result.fat": "Fat",
  "result.none": "No significant findings.",
  "result.back": "Back to dashboard",

  "history.title": "Analysis History",
  "history.empty": "No analyses yet.",
  "history.filter.all": "All",

  "common.cancel": "Cancel",
  "common.save": "Save",
  "common.loading": "Loading...",
  "common.error": "Something went wrong.",

  "diet.title": "AI Diet Coach",
  "diet.sub": "Daily calories, macros and meal plan tailored to your profile.",
  "diet.form.title": "Your details",
  "diet.age": "Age",
  "diet.sex": "Sex",
  "diet.sex.male": "Male",
  "diet.sex.female": "Female",
  "diet.sex.other": "Other",
  "diet.height": "Height (cm)",
  "diet.weight": "Weight (kg)",
  "diet.activity": "Activity",
  "diet.act.sedentary": "Sedentary",
  "diet.act.light": "Light",
  "diet.act.moderate": "Moderate",
  "diet.act.active": "Active",
  "diet.act.veryActive": "Very active",
  "diet.goal": "Goal",
  "diet.goal.lose": "Lose weight",
  "diet.goal.maintain": "Maintain",
  "diet.goal.gain": "Gain weight",
  "diet.generate": "Generate plan",
  "diet.generating": "Generating...",
  "diet.empty": "Fill in your details and let the AI build your personal plan.",
  "diet.stat.target": "Target calories",
  "diet.tips": "Tips",

  "chat.voice.start": "Start voice input",
  "chat.voice.stop": "Stop voice input",
  "chat.voice.speak": "Read answer aloud",
  "chat.voice.stopSpeak": "Stop voice",
  "chat.voice.unsupported": "Voice input is not supported in this browser.",
};

const ar: Dict = {
  "brand.name": "Alentra AI",
  "brand.tagline": "صوّر، اعرف، ابقَ آمنًا.",
  "brand.intro": "مساعد ذكي شخصي لسلامة الغذاء والتغذية.",

  "nav.features": "المزايا",
  "nav.how": "كيف يعمل",
  "nav.dashboard": "لوحة التحكم",
  "nav.profile": "الملف الصحي",
  "nav.analyze": "تحليل",
  "nav.history": "السجل",
  "nav.chat": "المحادثة",
  "nav.diet": "مدرب التغذية",
  "nav.signin": "تسجيل الدخول",
  "nav.signup": "إنشاء حساب",
  "nav.signout": "تسجيل الخروج",
  "nav.getstarted": "ابدأ مجانًا",

  "hero.title": "تعرّف على Alentra AI: احمِ صحتك بصورة واحدة.",
  "hero.sub": "تحليل غذائي مخصص حسب ملفك الصحي. صوّر الملصق أو الوجبة وستظهر المسببات للحساسية والمكونات والقيم الغذائية خلال ثوانٍ.",

  "disclaimer.title": "إخلاء مسؤولية طبية",
  "disclaimer.body": "هذا التطبيق لأغراض إعلامية فقط ولا يقدم تشخيصًا أو علاجًا طبيًا. استشر طبيبًا مختصًا في حالات الحساسية والأمراض المزمنة.",

  "dash.welcome": "أهلاً بك",
  "dash.quick.cta": "ابدأ التحليل",
  "dash.recent.t": "آخر التحاليل",
  "dash.recent.empty": "لا توجد تحاليل بعد.",
  "dash.recent.view": "عرض الكل",
  "dash.score.t": "نقاط الصحة اليومية",
  "dash.water.t": "تتبع الماء الذكي",
  "dash.water.unit": "كوب",

  "result.safe": "آمن",
  "result.warning": "تنبيه",
  "result.danger": "غير مناسب",

  "chat.voice.start": "بدء الإدخال الصوتي",
  "chat.voice.stop": "إيقاف الإدخال الصوتي",
  "chat.voice.speak": "اقرأ الإجابة بصوت",
  "chat.voice.stopSpeak": "إيقاف الصوت",
  "chat.voice.unsupported": "المتصفح لا يدعم الإدخال الصوتي.",
};

const dicts: Record<Lang, Dict> = { tr, en, ar };

type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: (key: string) => string };
const I18nContext = createContext<Ctx | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("tr");

  useEffect(() => {
    try {
      const stored = localStorage.getItem("alentra-lang");
      if (stored === "tr" || stored === "en" || stored === "ar") setLangState(stored);
    } catch {}
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  }, [lang]);

  const setLang = (l: Lang) => {
    setLangState(l);
    try { localStorage.setItem("alentra-lang", l); } catch {}
  };

  const value = useMemo<Ctx>(() => ({
    lang,
    setLang,
    t: (key: string) => dicts[lang][key] ?? dicts.en[key] ?? dicts.tr[key] ?? key,
  }), [lang]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
