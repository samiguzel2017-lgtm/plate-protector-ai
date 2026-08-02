import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { AlentraLogo } from "./AlentraLogo";
import { LangSwitch } from "./LangSwitch";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import { supabase } from "@/integrations/supabase/client";
import { LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

export function AppHeader() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const path = useRouterState({ select: (s) => s.location.pathname });

  const items = [
    { to: "/dashboard", label: t("nav.dashboard") },
    { to: "/diet", label: t("nav.diet") },
    { to: "/analyze", label: t("nav.analyze") },
    { to: "/chat", label: t("nav.chat") },
    { to: "/history", label: t("nav.history") },
    { to: "/profile", label: t("nav.profile") },
  ];

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/" });
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur-md">
      <div className="container-x flex h-16 items-center gap-3">
        <Link to="/dashboard" className="flex shrink-0 items-center">
          <AlentraLogo />
        </Link>
        <nav className="mx-auto hidden items-center gap-1 md:flex">
          {items.map((i) => {
            const active = path === i.to;
            return (
              <Link
                key={i.to}
                to={i.to}
                className={cn(
                  "rounded-full px-3.5 py-1.5 text-sm transition-colors",
                  active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                )}
              >
                {i.label}
              </Link>
            );
          })}
        </nav>
        <div className="ml-auto flex shrink-0 items-center gap-1.5">
          <LangSwitch />
          <ThemeToggle />
          <Button variant="ghost" size="icon" onClick={signOut} aria-label={t("nav.signout")} className="h-8 w-8 lg:hidden">
            <LogOut className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={signOut} className="hidden gap-1.5 lg:inline-flex">
            <LogOut className="h-4 w-4" />
            {t("nav.signout")}
          </Button>
        </div>
      </div>
    </header>
  );
}

