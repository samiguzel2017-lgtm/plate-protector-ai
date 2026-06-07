import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  MessageSquare,
  User,
  Send,
  Crown,
  History,
  QrCode,
} from "lucide-react";

export const Route = createFileRoute("/_authenticated/chat")({
  component: AlentraKusursuzSistem,
});

type ChatMsg = {
  id: number;
  text: string;
  isBot: boolean;
  isWarning?: boolean;
};

type ChatSession = {
  id: string;
  title: string;
  messages: ChatMsg[];
};

const STORAGE_KEY = "alentra.chat.sessions.v1";
const ACTIVE_KEY = "alentra.chat.active.v1";
const CREDITS_KEY = "alentra.chat.credits.v1";

function AlentraKusursuzSistem() {
  const [activeTab, setActiveTab] = useState<"camera" | "chat" | "profile">(
    "chat",
  );
  const [inputMessage, setInputMessage] = useState("");
  const [freeCredits, setFreeCredits] = useState<number>(5);
  const [barcodeResult, setBarcodeResult] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  const [chatHistory, setChatHistory] = useState<ChatSession[]>([
    {
      id: "session-1",
      title: "İlk Karşılama ve Analiz",
      messages: [
        {
          id: 1,
          text: "Merhaba şef! Sağlıklı yaşam yolculuğunuzda Alentra AI olarak yanınızda olmak harika. Bugün tabağınızdaki besinlerin kalori ve makro değerlerini çıkartabilir, alerjilerinize en uygun pratik tarifleri planlayabiliriz. Kendinizi bugün nasıl hissediyorsunuz, nasıl bir sağlık değişimi başlatalım?",
          isBot: true,
        },
      ],
    },
  ]);
  const [activeSessionId, setActiveSessionId] = useState<string>("session-1");

  // Load persisted state
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as ChatSession[];
        if (Array.isArray(parsed) && parsed.length > 0) setChatHistory(parsed);
      }
      const active = localStorage.getItem(ACTIVE_KEY);
      if (active) setActiveSessionId(active);
      const credits = localStorage.getItem(CREDITS_KEY);
      if (credits !== null) setFreeCredits(Number(credits));
    } catch {
      /* ignore */
    }
  }, []);

  // Persist
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(chatHistory));
    } catch {
      /* ignore */
    }
  }, [chatHistory]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem(ACTIVE_KEY, activeSessionId);
  }, [activeSessionId]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem(CREDITS_KEY, String(freeCredits));
  }, [freeCredits]);

  const currentSession =
    chatHistory.find((s) => s.id === activeSessionId) || chatHistory[0];

  const handleScanBarcode = () => {
    setIsScanning(true);
    setBarcodeResult(null);

    setTimeout(() => {
      setIsScanning(false);
      const result = "8690504012345 - Granola Bar (Fındıklı)";
      setBarcodeResult(result);

      const userMsg: ChatMsg = {
        id: Date.now(),
        text: `Barkod başarıyla tarandı: ${result}. Bu ürünün içeriğini ve sağlığıma uygunluğunu analiz eder misin?`,
        isBot: false,
      };
      const botMsg: ChatMsg = {
        id: Date.now() + 1,
        text: "Fındıklı Granola Bar başarıyla analiz edildi şef! İçeriğindeki fındık zengin bir sağlıklı yağ kaynağıdır ancak şeker oranına dikkat etmeliyiz. Alerji profilinize uygundur, güvenle tüketebilirsiniz.",
        isBot: true,
      };
      setChatHistory((prev) =>
        prev.map((session) =>
          session.id === activeSessionId
            ? { ...session, messages: [...session.messages, userMsg, botMsg] }
            : session,
        ),
      );
    }, 1500);
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;
    const userMsg: ChatMsg = {
      id: Date.now(),
      text: inputMessage,
      isBot: false,
    };
    setChatHistory((prev) =>
      prev.map((session) =>
        session.id === activeSessionId
          ? { ...session, messages: [...session.messages, userMsg] }
          : session,
      ),
    );
    setInputMessage("");

    setTimeout(() => {
      let botMsg: ChatMsg;
      if (freeCredits > 0) {
        setFreeCredits((prev) => prev - 1);
        botMsg = {
          id: Date.now() + 1,
          text: "Harika bir konuya değindiniz. Belirttiğiniz hassasiyetleri ve alerjileri filtreleyerek size en uygun beslenme tavsiyesini hazırladım. Günlük ücretsiz hakkınızdan 1 kredi kullanıldı.",
          isBot: true,
        };
      } else {
        botMsg = {
          id: Date.now() + 1,
          text: "Günlük ücretsiz Alentra Chat limitiniz (5 Hak) dolmuştur. Sınırsız sohbet, kesintisiz diyetisyen desteği ve QR analizler için Premium pakete geçebilirsiniz.",
          isBot: true,
          isWarning: true,
        };
      }
      setChatHistory((prev) =>
        prev.map((session) =>
          session.id === activeSessionId
            ? { ...session, messages: [...session.messages, botMsg] }
            : session,
        ),
      );
    }, 800);
  };

  const handleNewSession = () => {
    const newId = `session-${Date.now()}`;
    const newSession: ChatSession = {
      id: newId,
      title: `Sohbet #${chatHistory.length + 1}`,
      messages: [
        {
          id: 1,
          text: "Yeni bir analiz sayfasına hoş geldiniz şef! Sorularınızı bekliyorum.",
          isBot: true,
        },
      ],
    };
    setChatHistory([newSession, ...chatHistory]);
    setActiveSessionId(newId);
  };

  const LogoMark = ({ size = "md" }: { size?: "sm" | "md" }) => (
    <div
      className={
        size === "sm"
          ? "w-8 h-8 bg-emerald-600 text-white font-bold rounded-lg flex items-center justify-center border border-emerald-400 shadow-sm shadow-emerald-500/50 text-sm"
          : "w-9 h-9 bg-emerald-600 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-md shadow-emerald-100"
      }
    >
      A
    </div>
  );

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-slate-50 text-slate-800 font-sans overflow-hidden -mx-4 -my-6">
      <aside className="w-64 bg-slate-900 text-slate-200 hidden md:flex flex-col border-r border-slate-800">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <LogoMark size="sm" />
            <span className="font-bold tracking-wide text-white">
              Alentra Depo
            </span>
          </div>
          <button
            onClick={handleNewSession}
            className="text-xs bg-emerald-700 hover:bg-emerald-600 text-white px-2 py-1 rounded transition font-medium"
          >
            + Yeni
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          <div className="text-[11px] text-slate-500 font-bold px-2 py-1 uppercase tracking-wider flex items-center gap-1">
            <History size={12} /> Sohbet Geçmişi
          </div>
          {chatHistory.map((session) => (
            <button
              key={session.id}
              onClick={() => setActiveSessionId(session.id)}
              className={`w-full text-left text-xs p-2.5 rounded-xl flex justify-between items-center transition ${
                session.id === activeSessionId
                  ? "bg-emerald-600/20 text-emerald-400 font-semibold border border-emerald-500/30"
                  : "hover:bg-slate-800 text-slate-400"
              }`}
            >
              <span className="truncate">{session.title}</span>
              <span className="text-[10px] bg-slate-800 text-slate-500 px-1.5 py-0.5 rounded">
                {session.messages.length}
              </span>
            </button>
          ))}
        </div>
      </aside>

      <div className="flex-1 flex flex-col h-full relative">
        <header className="bg-white border-b border-slate-100 p-4 flex justify-between items-center shadow-sm">
          <div className="flex items-center gap-2">
            <LogoMark />
            <div>
              <h1 className="text-base font-bold text-slate-800">Alentra AI</h1>
              <p className="text-[10px] text-slate-400 font-medium">
                Uzman Sağlık & QR Analiz Sistemi
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-xl text-xs font-bold text-emerald-700">
              Kalan Kredi: {freeCredits} / 5
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 pb-24 bg-slate-50/60">
          {activeTab === "camera" && (
            <div className="max-w-md mx-auto bg-white rounded-3xl p-6 border border-slate-100 shadow-xl text-center mt-6">
              <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-emerald-100">
                <QrCode size={32} />
              </div>
              <h2 className="text-base font-bold text-slate-800 mb-1">
                Kusursuz Barkod & QR Kod Analizi
              </h2>
              <p className="text-xs text-slate-400 mb-6">
                Market ürünlerinin barkodunu gösterin, içerisindeki gizli
                zararlı maddeleri anında yakalayalım.
              </p>

              <div className="w-full h-48 bg-slate-900 rounded-2xl relative overflow-hidden flex flex-col items-center justify-center border-2 border-dashed border-emerald-500 shadow-inner mb-6">
                {isScanning ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/80 text-white text-xs gap-2">
                    <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-emerald-400 font-medium">
                      Barkod taranıyor, veri tabanına bağlanılıyor...
                    </span>
                  </div>
                ) : barcodeResult ? (
                  <div className="p-4 text-center">
                    <span className="inline-block bg-emerald-500/20 text-emerald-400 text-xs px-3 py-1 rounded-full font-bold mb-2">
                      ✓ Başarılı
                    </span>
                    <p className="text-white text-sm font-semibold">
                      {barcodeResult}
                    </p>
                  </div>
                ) : (
                  <div className="text-center text-slate-500 p-4">
                    <p className="text-xs">
                      Kamera hazır. Tarama başlatmak için aşağıdaki butona
                      basın.
                    </p>
                  </div>
                )}
                {isScanning && (
                  <div
                    className="w-full h-0.5 bg-emerald-400 absolute animate-pulse shadow-md shadow-emerald-400"
                    style={{ top: "50%" }}
                  ></div>
                )}
              </div>
              <button
                onClick={handleScanBarcode}
                disabled={isScanning}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl shadow-md shadow-emerald-200 transition text-xs disabled:opacity-60"
              >
                {isScanning ? "Taranıyor..." : "Barkodu / QR Kodu Tara"}
              </button>
            </div>
          )}

          {activeTab === "chat" && (
            <div className="max-w-xl mx-auto bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden mt-2">
              <div className="h-[420px] overflow-y-auto p-4 bg-slate-50/40 space-y-4">
                {currentSession.messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.isBot ? "justify-start" : "justify-end"}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed shadow-sm ${
                        msg.isWarning
                          ? "bg-amber-50 border border-amber-200 text-amber-900 rounded-tl-none"
                          : msg.isBot
                            ? "bg-white text-slate-800 border border-slate-100 rounded-tl-none"
                            : "bg-emerald-600 text-white rounded-tr-none font-medium"
                      }`}
                    >
                      {msg.text}
                      {msg.isWarning && (
                        <button className="mt-3 w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold py-2 rounded-xl flex items-center justify-center gap-1.5 shadow-md text-[11px] hover:opacity-95 transition">
                          PRO Paket'e Geç (25$)
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-3 bg-white border-t border-slate-100 flex gap-2 items-center">
                <input
                  type="text"
                  placeholder="Alerjilerinizi yazın veya yemek tarifi isteyin..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white transition"
                />
                <button
                  onClick={handleSendMessage}
                  className="bg-emerald-600 text-white p-2.5 rounded-xl shadow-md hover:bg-emerald-700 transition"
                >
                  <Send size={14} />
                </button>
              </div>
            </div>
          )}

          {activeTab === "profile" && (
            <div className="max-w-md mx-auto space-y-4 mt-6">
              <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-md flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
                  <User size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-800">
                    Alentra Üyesi
                  </h3>
                  <p className="text-[10px] text-slate-400">
                    Standart Profil (5 Kredi Haklı)
                  </p>
                </div>
              </div>
              <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-5 rounded-2xl text-white shadow-lg border border-slate-700">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-sm">Alentra PRO Planı</h4>
                  <Crown size={18} className="text-amber-400" />
                </div>
                <p className="text-[11px] text-slate-300 mb-4">
                  Sınırsız yapay zeka hafızası, kesintisiz barkod okuma ve
                  reklamsız diyetisyenlik.
                </p>
                <button className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 rounded-xl text-xs shadow transition">
                  Detayları İncele
                </button>
              </div>
            </div>
          )}
        </main>

        <nav className="absolute bottom-0 left-0 right-0 bg-white border-t border-slate-200/80 shadow-2xl px-4 py-2 flex justify-around items-center z-40">
          <button
            onClick={() => setActiveTab("camera")}
            className={`flex flex-col items-center gap-0.5 py-1 transition-all ${
              activeTab === "camera"
                ? "text-emerald-600 scale-105 font-bold"
                : "text-slate-400"
            }`}
          >
            <QrCode size={20} />
            <span className="text-[9px]">Barkod/QR</span>
          </button>
          <button
            onClick={() => setActiveTab("chat")}
            className={`flex flex-col items-center gap-0.5 py-1 transition-all ${
              activeTab === "chat"
                ? "text-emerald-600 scale-105 font-bold"
                : "text-slate-400"
            }`}
          >
            <MessageSquare size={20} />
            <span className="text-[9px]">Alentra Chat</span>
          </button>
          <button
            onClick={() => setActiveTab("profile")}
            className={`flex flex-col items-center gap-0.5 py-1 transition-all ${
              activeTab === "profile"
                ? "text-emerald-600 scale-105 font-bold"
                : "text-slate-400"
            }`}
          >
            <User size={20} />
            <span className="text-[9px]">Profilim</span>
          </button>
        </nav>
      </div>
    </div>
  );
}
