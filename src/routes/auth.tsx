import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { useI18n } from "@/lib/i18n";
import { AlentraLogo } from "@/components/AlentraLogo";
import { LangSwitch } from "@/components/LangSwitch";
import { Disclaimer } from "@/components/Disclaimer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Giriş — Alentra AI" }] }),
  component: AuthPage,
});

function AuthPage() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) navigate({ to: "/dashboard", replace: true });
    });
  }, [navigate]);

  const handleEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: name }, emailRedirectTo: `${window.location.origin}/dashboard` },
        });
        if (error) throw error;
        toast.success(t("prof.saved"));
        navigate({ to: "/dashboard" });
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate({ to: "/dashboard" });
      }
    } catch (err: any) {
      toast.error(err?.message ?? t("common.error"));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setLoading(true);
    try {
      const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin + "/dashboard" });
      if (result.error) throw result.error;
      if (result.redirected) return;
      navigate({ to: "/dashboard" });
    } catch (err: any) {
      toast.error(err?.message ?? t("common.error"));
      setLoading(false);
    }
  };

  return (
    <div className="dark ultra-dark grid min-h-screen bg-background text-foreground lg:grid-cols-[1fr_1.05fr]">
      {/* Left brand panel */}
      <div className="relative hidden flex-col justify-between overflow-hidden bg-primary p-10 text-primary-foreground lg:flex">
        <Link to="/"><AlentraLogo className="[&_span]:text-primary-foreground" /></Link>
        <div className="space-y-5">
          <h2 className="font-serif text-4xl leading-tight">{t("hero.title")}</h2>
          <p className="max-w-md text-sm opacity-80">{t("hero.sub")}</p>
        </div>
        <p className="font-serif italic opacity-70">{t("brand.tagline")}</p>
        <div className="absolute -right-32 -bottom-32 h-80 w-80 rounded-full bg-[oklch(0.5_0.12_230)] opacity-40 blur-3xl" />
      </div>

      {/* Right form */}
      <div className="flex flex-col bg-background">
        <div className="flex items-center justify-between p-5">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> {t("brand.name")}
          </Link>
          <LangSwitch />
        </div>
        <div className="flex flex-1 items-center justify-center px-5 pb-10">
          <div className="w-full max-w-sm space-y-6">
            <div>
              <h1 className="font-serif text-3xl text-foreground">
                {mode === "signin" ? t("auth.title") : t("auth.title.signup")}
              </h1>
              <p className="mt-1.5 text-sm text-muted-foreground">{t("auth.sub")}</p>
            </div>

            <Button variant="outline" className="w-full rounded-full" onClick={handleGoogle} disabled={loading}>
              <svg viewBox="0 0 24 24" className="mr-2 h-4 w-4" aria-hidden="true">
                <path fill="#EA4335" d="M12 11v3.4h5.5c-.2 1.4-1.6 4-5.5 4-3.3 0-6-2.7-6-6.1S8.7 6.2 12 6.2c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.7 3.6 14.6 2.7 12 2.7 6.9 2.7 2.8 6.8 2.8 12s4.1 9.3 9.2 9.3c5.3 0 8.8-3.7 8.8-9 0-.6-.1-1-.1-1.4H12z" />
              </svg>
              {t("auth.google")}
            </Button>

            <div className="flex items-center gap-3 text-xs uppercase tracking-wider text-muted-foreground">
              <span className="h-px flex-1 bg-border" />{t("auth.or")}<span className="h-px flex-1 bg-border" />
            </div>

            <form className="space-y-4" onSubmit={handleEmail}>
              {mode === "signup" && (
                <div className="space-y-1.5">
                  <Label htmlFor="name">{t("auth.name")}</Label>
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
              )}
              <div className="space-y-1.5">
                <Label htmlFor="email">{t("auth.email")}</Label>
                <Input id="email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="password">{t("auth.password")}</Label>
                <Input id="password" type="password" autoComplete={mode === "signin" ? "current-password" : "new-password"} value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
              </div>
              <Button type="submit" className="w-full rounded-full" disabled={loading}>
                {mode === "signin" ? t("auth.signin") : t("auth.signup")}
              </Button>
            </form>

            <button type="button" onClick={() => setMode(mode === "signin" ? "signup" : "signin")} className="block w-full text-center text-sm text-muted-foreground hover:text-foreground">
              {mode === "signin" ? t("auth.toggle.tosignup") : t("auth.toggle.tosignin")}
            </button>

            <Disclaimer variant="inline" />
          </div>
        </div>
      </div>
    </div>
  );
}
