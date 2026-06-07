import { Link, useRouterState } from "@tanstack/react-router";
import { Camera, MessageSquare, User, LayoutDashboard } from "lucide-react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";

export function BottomNav() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const { t } = useI18n();

  const items = [
    { to: "/dashboard", label: t("nav.dashboard"), Icon: LayoutDashboard },
    { to: "/analyze", label: t("nav.analyze"), Icon: Camera },
    { to: "/chat", label: "Alentra Chat", Icon: MessageSquare },
    { to: "/profile", label: t("nav.profile"), Icon: User },
  ] as const;

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border/60 bg-background/95 backdrop-blur-md md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <ul className="mx-auto flex max-w-md items-stretch justify-around px-2 py-1.5">
        {items.map(({ to, label, Icon }) => {
          const active = path === to;
          return (
            <li key={to} className="flex-1">
              <Link
                to={to}
                className={cn(
                  "flex flex-col items-center justify-center gap-0.5 rounded-xl py-1.5 text-[10px] font-medium tracking-tight transition-colors",
                  active ? "text-primary" : "text-muted-foreground hover:text-foreground",
                )}
              >
                <Icon
                  className={cn(
                    "h-[22px] w-[22px] transition-transform",
                    active && "scale-110",
                  )}
                  strokeWidth={active ? 2.4 : 2}
                />
                <span>{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
