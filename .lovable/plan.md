# Büyük Yenileme Planı

Bu çok kapsamlı bir istek — tek seferde 7 büyük değişiklik var. Önce onayını almak ve birkaç kritik noktayı netleştirmek istiyorum, çünkü uygulamanın şu anki kimliği ile bu istek arasında ciddi çelişkiler var.

## Önemli: Uygulamanın kimliği belirsizleşiyor

Şu an proje iki farklı yöne çekiliyor:
- **Mevcut Alentra**: Sağlık/beslenme koçu, barkod ile gıda analizi, diyet odaklı (madde 1, 5, 6 buna uyuyor)
- **Yeni istenenler**: Siber güvenlik / plaka tanıma / tehdit engelleme paneli (madde 3, 4, 5 buna uyuyor)

"Sağlık koçu" ile "plaka tarayan siber güvenlik sistemi" aynı uygulamada mantıksız duruyor. **Hangisi ana kimlik?** Cevap vermeden devam etmem doğru olmaz; aksi halde Frankenstein bir ürün çıkar.

## Yapılacaklar (onayından sonra)

1. **Ultra premium karanlık tema** — `src/styles.css` token'ları derin gece mavisi (#0A0E1A), antrasit yüzeyler, neon yeşil (#39FF14) ve siber mavi (#00E5FF) vurgular. Login ekranı korunur, sadece tema uyumlu hale gelir.

2. **AI Diyet Asistanı paneli** (`/diet`) — Lovable AI Gateway (`google/gemini-3-flash-preview`) ile günlük kalori hesabı, öğün önerileri ve kişisel diyet programı üreten server function. Kullanıcının `health_profiles` verilerini kullanır.

3. **AI Analiz Paneli (Dashboard)** — Login sonrası ana sayfada Recharts ile grafikler, "Bugün Taranan", "Engellenen Tehditler" gibi canlı istatistikler. **NOT: Bu kısım sadece plaka/güvenlik kimliği seçilirse anlamlı.**

4. **Canlı Plaka Simülatörü** — Radar SVG animasyonu, rastgele TR plakaları, AI değerlendirmesi. **NOT: Sadece güvenlik kimliği seçilirse.**

5. **Sohbet düzeltmesi** — Loop'un sebebi muhtemelen sistem prompt'unun aynı kalıpta cevap üretmesi. Sistem prompt'unu zenginleştir, geçmiş mesajları doğru biçimde modele yolla, `temperature`/varyasyon ekle, her cevabın bağlama göre farklı olmasını sağla.

6. **Barkod tarayıcı sıfırlama** — `@zxing/browser` ile gerçek kamera barkod algılama, Open Food Facts API + AI fallback (ürün bulunamazsa AI mantıklı bir simülasyon üretir).

7. **Dinamik dil desteği** — `i18next` + `react-i18next` kurulumu. TR/EN/DE çeviri dosyaları (`src/locales/`). Tüm sabit string'ler `t('key')` ile değiştirilir. Header'a dil seçici eklenir, seçim `localStorage`'a yazılır.

## Senden netleştirmem gerekenler

1. **Uygulamanın ana teması ne?**
   - (A) Sadece sağlık/beslenme (Alentra) → plaka simülatörü ve "tehdit engelleme" kaldırılır
   - (B) Sadece siber güvenlik / plaka tanıma → diyet asistanı ve barkod kaldırılır
   - (C) Gerçekten ikisi birden (tek uygulamada iki ayrı modül) → menüden geçiş

2. **Diller**: TR + EN yeterli mi, yoksa DE/FR/ES de eklensin mi?

3. **Plaka simülatörü gerçek bir veri kaynağı mı kullanacak, yoksa tamamen simülasyon mu?** (Gerçek plaka tanıma API'si entegrasyonu ayrı bir iştir.)

Bu üç soruyu cevapla, ardından planı kesinleştirip tek seferde uygulayayım.
