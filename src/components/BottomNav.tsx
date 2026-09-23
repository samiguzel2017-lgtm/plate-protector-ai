import { Link, useRouterState } from "@tanstack/react-router";
import { ScanLine, MessageCircle, UserRound, House, Utensils } from "lucide-react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";

export function BottomNav() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const { t } = useI18n();

  const items = [
    { to: "/dashboard", label: t("nav.dashboard"), Icon: House },
    { to: "/diet", label: t("nav.diet"), Icon: Utensils },
    { to: "/analyze", label: t("nav.analyze"), Icon: ScanLine },
    { to: "/chat", label: t("nav.chat"), Icon: MessageCircle },
    { to: "/profile", label: t("nav.profile"), Icon: UserRound },
  ] as const;

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border/70 bg-card/95 backdrop-blur-xl md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <ul className="mx-auto flex max-w-md items-stretch justify-around px-2 pb-2 pt-2">
        {items.map(({ to, label, Icon }) => {
          const active = path === to;
          return (
            <li key={to} className="flex-1">
              <Link
                to={to}
                className={cn(
                   "relative flex min-h-14 flex-col items-center justify-center gap-1 rounded-2xl py-1.5 text-[10px] font-medium transition-all duration-300",
                  active ? "text-primary" : "text-muted-foreground hover:text-foreground",
                )}
              >
                 <Icon className={cn("h-[22px] w-[22px] transition-transform duration-300", active && "-translate-y-0.5")} strokeWidth={active ? 2.3 : 1.8} />
                <span>{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
