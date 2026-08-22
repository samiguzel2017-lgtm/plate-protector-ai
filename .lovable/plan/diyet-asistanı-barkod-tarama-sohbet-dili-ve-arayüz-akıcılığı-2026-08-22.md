# Diyet asistanı, barkod tarama, sohbet dili ve arayüz akıcılığı

## 1. Diyet asistanı hatası ve yeni özellikler

Hatanın nedeni doğrulandı: `src/lib/diet.functions.ts` hâlâ katı şema zorlamalı üretim (`Output.object`) kullanıyor; model şemayı birebir tutturamadığında "No object generated" hatası fırlıyor. Projede zaten toleranslı bir ayrıştırıcı var (`src/lib/diet-plan.server.ts`) ama hiçbir yerden çağrılmıyor.

Yapılacaklar:
- Diyet fonksiyonunu düz metin üretimine çevirip yanıtı toleranslı ayrıştırıcıdan geçirmek; eksik alanları hesaplanan değerlerle (BMR/TDEE/hedef kalori, makro dağılımı) tamamlamak. Böylece plan her koşulda üretilir.
- Model yanıt vermezse bile kullanıcıya boş ekran değil, hesaplanmış kalori/makro hedefleri ve şablon öğün önerileri gösterilecek.
- Yeni giriş alanları: hedef süre/tempo (yavaş–normal–hızlı), öğün sayısı (3–6), su hedefi, egzersiz sıklığı, sevmediği/kaçındığı besinler, mutfak tercihi. Sağlık profilindeki alerji/hastalık/diyet verileri otomatik dikkate alınmaya devam eder.
- Yeni çıktılar: makro yüzdeleri ve halka/bar görselleştirmesi, öğün başına makro dağılımı, alışveriş listesi, hidrasyon hedefi, "planı kopyala" ve "yeniden üret" aksiyonları.
- Tüm yeni metinler TR/EN sözlüğe eklenir; hata durumunda anlaşılır uyarı gösterilir.

## 2. Barkod tarama

- Kamera tarayıcısında (`src/components/BarcodeScanner.tsx`) güvenilirlik iyileştirmeleri: kamera izni/HTTPS/desteklenmeyen cihaz durumları için ayrı ve anlaşılır hata mesajları, arka/ön kamera geçişi, ışık (torch) düğmesi, tarama kutusunun kadraja göre ölçeklenmesi, aynı barkodu iki kez göndermeme koruması.
- Manuel barkod girişi alanı: kamera çalışmadığında kullanıcı numarayı elle yazıp analiz alabilir.
- Ürün veritabanında bulunamazsa akış artık hata ile bitmiyor: kullanıcıya "fotoğrafla analiz et" seçeneği ve ürün adı/etiket fotoğrafıyla yapay zekâ analizine geçiş sunulur.
- Analiz ekranındaki tarama/analiz durum mesajları TR/EN olarak tamamlanır.

## 3. Sohbet dili

- Sohbet ekranında kalan Arapça dal metinleri temizlenir (dil artık yalnızca TR/EN).
- Her istekte arayüz dili sunucuya gönderilir ve sistem talimatına "geçmiş mesajların dili ne olursa olsun yanıtı SEÇİLİ dilde yaz" kuralı eklenir; böylece İngilizce'ye geçince yanıtlar İngilizce, Türkçe'ye geçince Türkçe olur.
- Dil değiştiğinde aktif sohbetteki karşılama mesajı ve arayüz etiketleri de o dile döner.

## 4. Arayüz mimarisi ve animasyonlar (UI/UX)

- Ortak hareket dili: sayfa/bölüm geçişlerinde yumuşak fade+yukarı kayma, kart ve buton hover/press durumlarında ölçek ve gölge geçişleri, iskelet (skeleton) yükleme durumları, sayaç değerlerinde yumuşak artış animasyonu — hepsi tema token'ları üzerinden.
- Erişilebilirlik: `prefers-reduced-motion` desteği, klavye odak halkaları, dokunma hedeflerinin en az 44px olması.
- Düzen düzeni: diyet, sohbet, analiz ve panel ekranlarında hizalama, boşluk ve tipografi ölçeğinin tek bir ritme oturtulması; taşan/çakışan başlık ve butonların düzeltilmesi.
- Renk finesi: kalan parlak neon vurguların yumuşatılması, açık/koyu temada kontrast kontrolü.

## Teknik notlar

- `src/lib/diet.functions.ts`: `Output.object` kaldırılır, `parseDietPlan` kullanılır; şema `diet-plan.server.ts` içinde genişletilir (opsiyonel alanlar + varsayılanlar). Sunucu fonksiyonu dosyası ince sarmalayıcı olarak kalır, yardımcı mantık `.server.ts` içinde durur.
- `src/routes/_authenticated/diet.tsx`: yeni form alanları, sonuç görselleştirmeleri, hata/boş durumları.
- `src/components/BarcodeScanner.tsx` + `src/lib/barcode.functions.ts` + `src/routes/_authenticated/analyze.tsx`: manuel giriş, kamera kontrolleri, bulunamayan ürün için fotoğraf analizine yönlendirme.
- `src/lib/chat.functions.ts` + `src/routes/_authenticated/chat.tsx`: dil kilidi kuralı, Arapça kalıntılarının temizliği.
- `src/styles.css`: animasyon yardımcıları (`@utility`) ve reduced-motion varyantı; sabit renk yerine token kullanımı sürdürülür.
- `src/lib/i18n.tsx`: tüm yeni metinler için TR/EN anahtarları.
