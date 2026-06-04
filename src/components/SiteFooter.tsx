import { AlentraLogo } from "./AlentraLogo";
import { Disclaimer } from "./Disclaimer";
import { useI18n } from "@/lib/i18n";

export function SiteFooter() {
  const { t } = useI18n();
  return (
    <footer className="mt-24 border-t border-border bg-surface-muted/40">
      <div className="container-x py-12">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr]">
          <div className="space-y-4">
            <AlentraLogo />
            <p className="max-w-md text-sm leading-relaxed text-muted-foreground">{t("brand.intro")}</p>
          </div>
          <Disclaimer variant="compact" />
        </div>
        <div className="mt-10 flex flex-col gap-2 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Alentra AI. {t("footer.rights")}</p>
          <p className="font-serif italic">{t("brand.tagline")}</p>
        </div>
      </div>
    </footer>
  );
}
