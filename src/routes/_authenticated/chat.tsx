import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useRef, useState } from "react";
import { Send, Loader2, MessageSquare, Plus, Trash2, Bot, User as UserIcon, Mic, MicOff, Volume2, Square } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { chatWithAlentra } from "@/lib/chat.functions";
import { useI18n, type Lang } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/chat")({
  component: ChatPage,
});

type Msg = { role: "user" | "assistant"; content: string };
type Session = { id: string; title: string; messages: Msg[]; updatedAt: number };

const STORAGE_KEY = "alentra.chat.sessions.v2";
const ACTIVE_KEY = "alentra.chat.active.v2";

const toServerLang = (l: Lang): "tr" | "en" => (l === "tr" ? "tr" : "en");
const voiceLocale = (l: Lang) => (l === "tr" ? "tr-TR" : l === "ar" ? "ar-SA" : "en-US");

function makeSession(lang: Lang): Session {
  const greet =
    lang === "tr"
      ? "Merhaba! Ben Alentra AI. Beslenme, alerji, içerik analizi veya sağlıklı yaşam konusunda ne sormak istersin?"
      : lang === "ar"
      ? "مرحبًا! أنا Alentra AI. اسألني عن التغذية أو الحساسية أو تحليل المكونات."
      : "Hi! I'm Alentra AI. Ask me anything about nutrition, allergies, ingredient analysis or healthy living.";
  return {
    id: `s_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`,
    title: lang === "tr" ? "Yeni Sohbet" : lang === "ar" ? "محادثة جديدة" : "New Chat",
    messages: [{ role: "assistant", content: greet }],
    updatedAt: Date.now(),
  };
}

function ChatPage() {
  const { t, lang } = useI18n();
  const fn = useServerFn(chatWithAlentra);

  const [sessions, setSessions] = useState<Session[]>([]);
  const [activeId, setActiveId] = useState<string>("");
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [listening, setListening] = useState(false);
  const [speakingIdx, setSpeakingIdx] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const recogRef = useRef<any>(null);
  const bootedRef = useRef(false);

  useEffect(() => {
    if (bootedRef.current) return;
    bootedRef.current = true;
    if (typeof window === "undefined") return;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const stored = raw ? (JSON.parse(raw) as Session[]) : [];
      const activeStored = localStorage.getItem(ACTIVE_KEY) ?? "";
      if (stored.length === 0) {
        const s = makeSession(lang);
        setSessions([s]);
        setActiveId(s.id);
      } else {
        setSessions(stored);
        setActiveId(stored.find((s) => s.id === activeStored) ? activeStored : stored[0].id);
      }
    } catch {
      const s = makeSession(lang);
      setSessions([s]);
      setActiveId(s.id);
    }
  }, [lang]);

  useEffect(() => {
    if (sessions.length === 0) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
      if (activeId) localStorage.setItem(ACTIVE_KEY, activeId);
    } catch {}
  }, [sessions, activeId]);

  const active = sessions.find((s) => s.id === activeId);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [active?.messages.length, sending]);

  useEffect(() => {
    inputRef.current?.focus();
  }, [activeId]);

  // Stop any speech when unmounting
  useEffect(() => {
    return () => {
      try { window.speechSynthesis?.cancel(); } catch {}
      try { recogRef.current?.stop?.(); } catch {}
    };
  }, []);

  const updateActive = (updater: (s: Session) => Session) => {
    setSessions((prev) => prev.map((s) => (s.id === activeId ? updater(s) : s)));
  };

  const newSession = () => {
    const s = makeSession(lang);
    setSessions((prev) => [s, ...prev]);
    setActiveId(s.id);
  };

  const deleteSession = (id: string) => {
    setSessions((prev) => {
      const next = prev.filter((s) => s.id !== id);
      if (next.length === 0) {
        const s = makeSession(lang);
        setActiveId(s.id);
        return [s];
      }
      if (id === activeId) setActiveId(next[0].id);
      return next;
    });
  };

  const toggleListening = () => {
    const SR: any = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) {
      toast.error(t("chat.voice.unsupported"));
      return;
    }
    if (listening) {
      try { recogRef.current?.stop?.(); } catch {}
      setListening(false);
      return;
    }
    const rec = new SR();
    rec.lang = voiceLocale(lang);
    rec.interimResults = true;
    rec.continuous = false;
    rec.onresult = (e: any) => {
      let txt = "";
      for (let i = e.resultIndex; i < e.results.length; i++) txt += e.results[i][0].transcript;
      setInput((prev) => (prev ? prev + " " : "") + txt);
    };
    rec.onerror = () => setListening(false);
    rec.onend = () => setListening(false);
    recogRef.current = rec;
    try { rec.start(); setListening(true); } catch { setListening(false); }
  };

  const speak = (idx: number, text: string) => {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      toast.error(t("chat.voice.unsupported"));
      return;
    }
    if (speakingIdx === idx) {
      window.speechSynthesis.cancel();
      setSpeakingIdx(null);
      return;
    }
    window.speechSynthesis.cancel();
    const plain = text.replace(/[#*_`>~\-]/g, "").replace(/\n+/g, ". ").slice(0, 1200);
    const u = new SpeechSynthesisUtterance(plain);
    u.lang = voiceLocale(lang);
    u.rate = 1.02;
    u.pitch = 1;
    u.onend = () => setSpeakingIdx((cur) => (cur === idx ? null : cur));
    u.onerror = () => setSpeakingIdx((cur) => (cur === idx ? null : cur));
    setSpeakingIdx(idx);
    window.speechSynthesis.speak(u);
  };

  const send = async () => {
    const text = input.trim();
    if (!text || !active || sending) return;
    setInput("");
    const userMsg: Msg = { role: "user", content: text };
    const optimistic = [...active.messages, userMsg];
    updateActive((s) => ({
      ...s,
      messages: optimistic,
      title: s.messages.length === 1 ? text.slice(0, 36) : s.title,
      updatedAt: Date.now(),
    }));
    setSending(true);
    try {
      const messagesForAi = optimistic.map((m) => ({ role: m.role, content: m.content }));
      const res = await fn({ data: { messages: messagesForAi, language: toServerLang(lang) } });
      const reply: Msg = { role: "assistant", content: res.reply };
      updateActive((s) => ({ ...s, messages: [...s.messages, reply], updatedAt: Date.now() }));
    } catch (err: any) {
      const msg = String(err?.message ?? "");
      if (msg.includes("429")) toast.error(lang === "tr" ? "Çok hızlı istek. Biraz bekleyin." : "Rate limited. Slow down.");
      else if (msg.includes("402")) toast.error(lang === "tr" ? "Kredi bitmiş. Lütfen plan yükseltin." : "Out of credits. Upgrade your plan.");
      else toast.error(t("common.error"));
    } finally {
      setSending(false);
      inputRef.current?.focus();
    }
  };

  return (
    <div className="container-x py-6">
      <div className="grid gap-5 md:grid-cols-[260px_1fr]">
        <aside className="hidden md:flex flex-col rounded-2xl border border-border bg-surface p-3">
          <Button onClick={newSession} className="rounded-full neon-glow" size="sm">
            <Plus className="mr-1.5 h-4 w-4" />
            {lang === "tr" ? "Yeni Sohbet" : lang === "ar" ? "محادثة جديدة" : "New Chat"}
          </Button>
          <div className="mt-3 flex-1 overflow-y-auto space-y-1">
            {sessions.map((s) => (
              <div
                key={s.id}
                className={cn(
                  "group flex items-center gap-1 rounded-xl px-2 py-1.5 cursor-pointer transition",
                  s.id === activeId ? "bg-secondary" : "hover:bg-surface-muted/60",
                )}
              >
                <button type="button" onClick={() => setActiveId(s.id)} className="flex-1 min-w-0 text-left">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                    <span className="truncate text-xs text-foreground">{s.title}</span>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => deleteSession(s.id)}
                  className="opacity-0 group-hover:opacity-100 transition text-muted-foreground hover:text-destructive"
                  aria-label="Delete"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        </aside>

        <section className="flex flex-col h-[calc(100vh-9rem)] rounded-2xl border border-border bg-surface overflow-hidden cyber-border">
          <header className="flex items-center justify-between border-b border-border px-5 py-3">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-xl bg-[color-mix(in_oklab,var(--color-neon)_18%,transparent)] flex items-center justify-center ring-1 ring-[color-mix(in_oklab,var(--color-neon)_50%,transparent)]">
                <Bot className="h-4 w-4 text-[var(--color-neon)]" />
              </div>
              <div>
                <div className="text-sm font-semibold text-foreground">Alentra AI</div>
                <div className="text-[10px] text-muted-foreground">
                  {lang === "tr" ? "Kişisel sağlık & beslenme koçu" : lang === "ar" ? "مدرب شخصي للصحة والتغذية" : "Personal health & nutrition coach"}
                </div>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={newSession} className="md:hidden">
              <Plus className="h-4 w-4" />
            </Button>
          </header>

          <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-5 space-y-4">
            {active?.messages.map((m, i) => (
              <Bubble
                key={i}
                msg={m}
                onSpeak={m.role === "assistant" ? () => speak(i, m.content) : undefined}
                speaking={speakingIdx === i}
                speakStartLabel={t("chat.voice.speak")}
                speakStopLabel={t("chat.voice.stopSpeak")}
              />
            ))}
            {sending && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                {lang === "tr" ? "Düşünüyor..." : lang === "ar" ? "يفكر..." : "Thinking..."}
              </div>
            )}
          </div>

          <form
            onSubmit={(e) => { e.preventDefault(); void send(); }}
            className="border-t border-border bg-background/40 p-3"
          >
            <div className="flex items-end gap-2 rounded-2xl border border-border bg-surface-muted/40 p-2 focus-within:border-[color-mix(in_oklab,var(--color-neon)_50%,transparent)]">
              <button
                type="button"
                onClick={toggleListening}
                aria-label={listening ? t("chat.voice.stop") : t("chat.voice.start")}
                title={listening ? t("chat.voice.stop") : t("chat.voice.start")}
                className={cn(
                  "shrink-0 rounded-xl p-2 transition-all",
                  listening
                    ? "bg-[var(--color-danger)] text-white animate-pulse shadow-[0_0_16px_-2px_var(--color-danger)]"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                )}
              >
                {listening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              </button>
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    void send();
                  }
                }}
                placeholder={lang === "tr" ? "Bir şey sor..." : lang === "ar" ? "اسأل أي شيء..." : "Ask anything..."}
                rows={1}
                className="flex-1 resize-none bg-transparent px-2 py-1.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none max-h-32"
              />
              <Button type="submit" size="icon" disabled={sending || !input.trim()} className="rounded-xl neon-glow">
                {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </Button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}

function Bubble({
  msg,
  onSpeak,
  speaking,
  speakStartLabel,
  speakStopLabel,
}: {
  msg: Msg;
  onSpeak?: () => void;
  speaking?: boolean;
  speakStartLabel: string;
  speakStopLabel: string;
}) {
  const isUser = msg.role === "user";
  return (
    <div className={cn("flex gap-3", isUser ? "justify-end" : "justify-start")}>
      {!isUser && (
        <div className="h-7 w-7 shrink-0 rounded-lg bg-[color-mix(in_oklab,var(--color-neon)_18%,transparent)] flex items-center justify-center ring-1 ring-[color-mix(in_oklab,var(--color-neon)_40%,transparent)]">
          <Bot className="h-3.5 w-3.5 text-[var(--color-neon)]" />
        </div>
      )}
      <div
        className={cn(
          "max-w-[78%] overflow-hidden break-words rounded-2xl px-4 py-2.5 text-sm leading-relaxed relative group",
          isUser ? "bg-primary text-primary-foreground rounded-br-sm" : "bg-surface-muted/60 text-foreground rounded-bl-sm",
        )}
      >
        {isUser ? (
          msg.content
        ) : (
          <>
            <div className="prose prose-sm dark:prose-invert max-w-none prose-p:my-1.5 prose-ul:my-1.5 prose-headings:my-2">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
            </div>
            {onSpeak && (
              <button
                type="button"
                onClick={onSpeak}
                title={speaking ? speakStopLabel : speakStartLabel}
                aria-label={speaking ? speakStopLabel : speakStartLabel}
                className={cn(
                  "mt-2 inline-flex items-center gap-1.5 rounded-full border border-border/60 px-2.5 py-1 text-[10px] uppercase tracking-wider transition-all",
                  speaking
                    ? "bg-[var(--color-neon)] text-[var(--color-charcoal)] shadow-[0_0_12px_-2px_var(--color-neon)]"
                    : "text-muted-foreground hover:border-[var(--color-neon)] hover:text-[var(--color-neon)]",
                )}
              >
                {speaking ? <Square className="h-3 w-3" /> : <Volume2 className="h-3 w-3" />}
                {speaking ? speakStopLabel : speakStartLabel}
                {speaking && (
                  <span className="ml-1 flex items-end gap-[1px]">
                    <span className="h-2 w-[2px] bg-current animate-pulse" />
                    <span className="h-3 w-[2px] bg-current animate-pulse [animation-delay:120ms]" />
                    <span className="h-1.5 w-[2px] bg-current animate-pulse [animation-delay:240ms]" />
                  </span>
                )}
              </button>
            )}
          </>
        )}
      </div>
      {isUser && (
        <div className="h-7 w-7 shrink-0 rounded-lg bg-secondary flex items-center justify-center">
          <UserIcon className="h-3.5 w-3.5 text-secondary-foreground" />
        </div>
      )}
    </div>
  );
}
