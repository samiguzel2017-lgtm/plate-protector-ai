import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useRef } from "react";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { analyzeImage } from "@/lib/analyze.functions";
import { useI18n } from "@/lib/i18n";
import { Disclaimer } from "@/components/Disclaimer";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Camera, Upload, X, Loader2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/analyze")({
  component: AnalyzePage,
});

function AnalyzePage() {
  const { t, lang } = useI18n();
  const { user } = Route.useRouteContext();
  const navigate = useNavigate();
  const fileRef = useRef<HTMLInputElement>(null);
  const analyzeFn = useServerFn(analyzeImage);

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [type, setType] = useState<"product" | "meal">("product");
  const [loading, setLoading] = useState(false);

  const onPick = (f: File | null) => {
    setFile(f);
    if (f) {
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result as string);
      reader.readAsDataURL(f);
    } else setPreview(null);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0];
    if (f && f.type.startsWith("image/")) onPick(f);
  };

  const fileToBase64 = (f: File) =>
    new Promise<string>((resolve, reject) => {
      const r = new FileReader();
      r.onload = () => resolve(r.result as string);
      r.onerror = reject;
      r.readAsDataURL(f);
    });

  const run = async () => {
    if (!file) return;
    setLoading(true);
    try {
      const ext = file.name.split(".").pop() ?? "jpg";
      const path = `${user.id}/${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage.from("food-images").upload(path, file, { upsert: false, contentType: file.type });
      if (upErr) throw upErr;

      const base64 = await fileToBase64(file);
      const res = await analyzeFn({ data: { imageBase64: base64, imageUrl: path, type, language: lang } });
      navigate({ to: "/analysis/$id", params: { id: res.id } });
    } catch (err: any) {
      toast.error(err?.message ?? t("common.error"));
      setLoading(false);
    }
  };

  return (
    <div className="container-x py-10 md:py-14">
      <div className="mb-8 max-w-2xl">
        <h1 className="font-serif text-4xl text-foreground">{t("analyze.title")}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{t("analyze.sub")}</p>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
        <div className="rounded-2xl border border-border bg-surface p-6">
          <div className="mb-5">
            <Label className="mb-2 block text-sm">{t("analyze.type")}</Label>
            <div className="inline-flex rounded-full border border-border p-0.5">
              {(["product", "meal"] as const).map((tp) => (
                <button key={tp} type="button" onClick={() => setType(tp)} className={`rounded-full px-4 py-1.5 text-sm transition-colors ${type === tp ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>
                  {t(`analyze.type.${tp}`)}
                </button>
              ))}
            </div>
          </div>

          {!preview ? (
            <div
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              className="flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-border bg-surface-muted/40 p-12 text-center"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Upload className="h-6 w-6" />
              </div>
              <p className="text-sm font-medium text-foreground">{t("analyze.dropzone")}</p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="rounded-full" onClick={() => fileRef.current?.click()}>
                  <Upload className="mr-1.5 h-3.5 w-3.5" />{t("analyze.dropzone")}
                </Button>
                <Button variant="ghost" size="sm" className="rounded-full" onClick={() => {
                  if (fileRef.current) { fileRef.current.setAttribute("capture", "environment"); fileRef.current.click(); }
                }}>
                  <Camera className="mr-1.5 h-3.5 w-3.5" />Kamera
                </Button>
              </div>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => onPick(e.target.files?.[0] ?? null)} />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative overflow-hidden rounded-2xl border border-border">
                <img src={preview} alt="preview" className="max-h-[480px] w-full object-contain bg-surface-muted" />
                <button onClick={() => onPick(null)} className="absolute right-3 top-3 rounded-full bg-background/90 p-1.5 text-foreground shadow-sm hover:bg-background">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <Button onClick={run} disabled={loading} size="lg" className="w-full rounded-full">
                {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />{t("analyze.running")}</> : t("analyze.run")}
              </Button>
            </div>
          )}
        </div>

        <div className="space-y-5">
          <Disclaimer />
          <div className="rounded-2xl border border-border bg-surface-muted/60 p-6">
            <h3 className="mb-2 font-serif text-lg text-foreground">{t("dash.tip.t")}</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">{t("dash.tip.d")}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
