import { useI18n, type Lang } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function LangSwitch({ className }: { className?: string }) {
  const { lang, setLang } = useI18n();
  return (
    <div className={cn("inline-flex shrink-0 items-center rounded-full border border-border bg-surface p-0.5 text-[10px] font-medium sm:text-xs", className)}>
      {(["tr", "en"] as const).map((l: Lang) => (
        <button
          key={l}
          type="button"
          onClick={() => setLang(l)}
          className={cn(
            "rounded-full px-1.5 py-1 uppercase tracking-wider transition-colors sm:px-2.5",
            lang === l ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground",
          )}
          aria-pressed={lang === l}
        >
          {l}
        </button>
      ))}
    </div>
  );
}
