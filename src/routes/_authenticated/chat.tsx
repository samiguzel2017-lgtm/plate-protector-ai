import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Send, Sparkles, MessageSquare } from "lucide-react";
import { chatWithAlentra } from "@/lib/chat.functions";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/chat")({
  component: ChatPage,
});

type Msg = { id: string; role: "user" | "assistant"; content: string };

function ChatPage() {
  const { lang } = useI18n();
  const chat = useServerFn(chatWithAlentra);
  const [messages, setMessages] = useState<Msg[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        lang === "tr"
          ? "Selam şef! Ben Alentra AI, kişisel sağlık koçun. Bugün tabağında ne var, ya da kafana ne takıldı? Sor gelsin."
          : "Hi chef! I'm Alentra AI, your personal health coach. What's on your plate today, or what's on your mind? Ask away.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    const userMsg: Msg = { id: crypto.randomUUID(), role: "user", content: text };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const payload = next
        .filter((m) => m.id !== "welcome")
        .map((m) => ({ role: m.role, content: m.content }));
      const res = await chat({ data: { messages: payload, language: lang } });
      setMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), role: "assistant", content: res.reply },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content:
            lang === "tr"
              ? "Üzgünüm, şu an cevap veremedim. Birazdan tekrar dener misin?"
              : "Sorry, I couldn't respond. Please try again in a moment.",
        },
      ]);
      console.error(err);
    } finally {
      setLoading(false);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  };

  return (
    <div className="container-x flex h-[calc(100vh-8rem)] max-w-3xl flex-col py-4 md:py-8">
      <header className="mb-4 flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-full bg-primary/10 text-primary">
          <Sparkles className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-lg font-semibold tracking-tight">Alentra Chat</h1>
          <p className="text-xs text-muted-foreground">
            {lang === "tr" ? "Kişisel sağlık ve beslenme koçun" : "Your personal health & nutrition coach"}
          </p>
        </div>
      </header>

      <div
        ref={scrollRef}
        className="flex-1 space-y-4 overflow-y-auto rounded-2xl border border-border/60 bg-card/40 p-4"
      >
        {messages.length === 1 && (
          <div className="flex items-start justify-center pt-6 text-center">
            <div className="max-w-sm space-y-2">
              <MessageSquare className="mx-auto h-8 w-8 text-muted-foreground/60" />
              <p className="text-sm text-muted-foreground">
                {lang === "tr"
                  ? "Bir soru yaz ve Alentra ile sohbet etmeye başla."
                  : "Type a question to start chatting with Alentra."}
              </p>
            </div>
          </div>
        )}
        {messages.map((m) => (
          <MessageBubble key={m.id} role={m.role} content={m.content} />
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="flex items-center gap-1.5 rounded-2xl rounded-tl-sm bg-secondary px-4 py-3 text-muted-foreground">
              <Dot delay={0} />
              <Dot delay={150} />
              <Dot delay={300} />
            </div>
          </div>
        )}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          void send();
        }}
        className="mt-3 flex items-end gap-2"
      >
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
          rows={1}
          placeholder={lang === "tr" ? "Alentra'ya sor…" : "Ask Alentra…"}
          className="flex-1 resize-none rounded-2xl border border-border bg-background px-4 py-3 text-sm shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          style={{ maxHeight: 140 }}
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-sm transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="Send"
        >
          <Send className="h-5 w-5" />
        </button>
      </form>
    </div>
  );
}

function MessageBubble({ role, content }: { role: "user" | "assistant"; content: string }) {
  const isUser = role === "user";
  return (
    <div className={cn("flex", isUser ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm",
          isUser
            ? "rounded-tr-sm bg-primary text-primary-foreground"
            : "rounded-tl-sm border border-border/60 bg-background text-foreground",
        )}
      >
        {content}
      </div>
    </div>
  );
}

function Dot({ delay }: { delay: number }) {
  return (
    <span
      className="inline-block h-1.5 w-1.5 animate-bounce rounded-full bg-current"
      style={{ animationDelay: `${delay}ms` }}
    />
  );
}
