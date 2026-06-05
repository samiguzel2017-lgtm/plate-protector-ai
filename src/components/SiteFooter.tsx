import { Link } from "@tanstack/react-router";
import { AlentraLogo } from "./AlentraLogo";
import { useI18n } from "@/lib/i18n";

export function SiteFooter() {
  const { t } = useI18n();
  return (
    <footer className="mt-24 border-t border-border bg-surface-muted/50">
      <div className="container-x py-14">
        <div className="grid gap-10 md:grid-cols-3">
          {/* Brand column */}
          <div className="space-y-4">
            <AlentraLogo />
            <p className="text-sm leading-relaxed text-muted-foreground">
              © {new Date().getFullYear()} Alentra AI. {t("footer.rights")}
            </p>
          </div>

          {/* Legal */}
          <div>
            <h4 className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-foreground/70">
              {t("footer.legal")}
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/" hash="privacy" className="hover:text-foreground">{t("footer.privacy")}</Link></li>
              <li><Link to="/" hash="terms" className="hover:text-foreground">{t("footer.terms")}</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-foreground/70">
              {t("footer.company")}
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/" hash="about" className="hover:text-foreground">{t("footer.about")}</Link></li>
              <li><Link to="/" hash="contact" className="hover:text-foreground">{t("footer.contact")}</Link></li>
            </ul>
          </div>
        </div>

        {/* Micro disclaimer */}
        <div className="mt-12 border-t border-border pt-6">
          <p className="text-[11px] font-light leading-relaxed text-muted-foreground/70">
            <span className="font-medium">{t("disclaimer.title")}:</span>{" "}
            {t("disclaimer.body")}
          </p>
        </div>
      </div>
    </footer>
  );
}
