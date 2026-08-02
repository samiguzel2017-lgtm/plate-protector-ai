import { Link } from "@tanstack/react-router";
import { AlentraLogo } from "./AlentraLogo";
import { LangSwitch } from "./LangSwitch";
import { ThemeToggle } from "./ThemeToggle";
import { useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  const { t } = useI18n();
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur-md">
      <div className="container-x flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center">
          <AlentraLogo />
        </Link>
        <nav className="hidden items-center gap-7 text-sm text-muted-foreground md:flex">
          <a href="#features" className="hover:text-foreground">{t("nav.features")}</a>
          <a href="#how" className="hover:text-foreground">{t("nav.how")}</a>
        </nav>
        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2.5">
          <LangSwitch />
          <ThemeToggle />
          <Link to="/auth" className="hidden sm:block">
            <Button variant="ghost" size="sm">{t("nav.signin")}</Button>
          </Link>
          <Link to="/auth">
            <Button size="sm" className="rounded-full">
              <span className="hidden sm:inline">{t("nav.getstarted")}</span>
              <span className="sm:hidden">{t("nav.signin")}</span>
            </Button>
          </Link>
        </div>

      </div>
    </header>
  );
}
