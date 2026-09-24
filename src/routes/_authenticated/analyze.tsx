import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useRef } from "react";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { analyzeImage } from "@/lib/analyze.functions";
import { analyzeBarcode } from "@/lib/barcode.functions";
import { useI18n } from "@/lib/i18n";
import { Disclaimer } from "@/components/Disclaimer";
import { BarcodeScanner } from "@/components/BarcodeScanner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Camera, Upload, X, Loader2, ScanLine } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/analyze")({
  head: () => ({ meta: [
    { title: "Gıda Analizi — Alentra AI" },
    { name: "description", content: "Fotoğraf, ürün etiketi veya barkod ile kişisel gıda analizi yapın." },
    { property: "og:title", content: "Gıda Analizi — Alentra AI" },
    { property: "og:description", content: "Fotoğraf, ürün etiketi veya barkod ile kişisel gıda analizi yapın." },
  ] }),
  component: AnalyzePage,
});

type Mode = "product" | "meal" | "barcode";

function AnalyzePage() {
  const { t, lang } = useI18n();
  const { user } = Route.useRouteContext();
  const navigate = useNavigate();
  const fileRef = useRef<HTMLInputElement>(null);
  const analyzeFn = useServerFn(analyzeImage);
  const barcodeFn = useServerFn(analyzeBarcode);

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [mode, setMode] = useState<Mode>("product");
  const [loading, setLoading] = useState(false);
  const [scanBusy, setScanBusy] = useState(false);

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
      const res = await analyzeFn({
        data: { imageBase64: base64, imageUrl: path, type: mode === "meal" ? "meal" : "product", language: lang },
      });
      navigate({ to: "/analysis/$id", params: { id: res.id } });
    } catch (err: any) {
      toast.error(err?.message ?? t("common.error"));
      setLoading(false);
    }
  };

  const onBarcode = async (code: string) => {
    if (scanBusy) return;
    setScanBusy(true);
    try {
      const res = await barcodeFn({ data: { barcode: code, language: lang } });
      navigate({ to: "/analysis/$id", params: { id: res.id } });
    } catch (err: any) {
      const msg: string = err?.message ?? t("common.error");
      if (/bulunamad|not found/i.test(msg)) {
        toast.error(t("analyze.barcode.notfound"), {
          action: { label: t("analyze.barcode.usePhoto"), onClick: () => setMode("product") },
        });
      } else {
        toast.error(msg);
      }
      setScanBusy(false);
    }
  };

  const tabs: { id: Mode; label: string; icon: any }[] = [
    { id: "product", label: t("analyze.type.product"), icon: Upload },
    { id: "meal", label: t("analyze.type.meal"), icon: Camera },
    { id: "barcode", label: t("analyze.type.barcode"), icon: ScanLine },
  ];

  return (
    <div className="container-x py-7 md:py-12">
      <div className="mb-6 max-w-2xl anim-rise">
        <p className="mb-1 text-sm text-muted-foreground">{t("nav.analyze")}</p>
        <h1 className="max-w-lg text-3xl font-semibold leading-tight text-foreground md:text-4xl">{t("analyze.title")}</h1>
        <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">{t("analyze.sub")}</p>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.45fr_0.75fr]">
        <div className="anim-rise rounded-[28px] border border-card/80 bg-card p-4 shadow-sm md:p-7">
          <div className="mb-6">
            <Label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {t("analyze.type")}
            </Label>
            <div className="grid w-full grid-cols-3 rounded-2xl bg-secondary p-1">
              {tabs.map((tp) => {
                const Icon = tp.icon;
                const active = mode === tp.id;
                return (
                  <button
                    key={tp.id}
                    type="button"
                    onClick={() => { setMode(tp.id); onPick(null); }}
                    className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${
                      active ? "bg-card text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {tp.label}
                  </button>
                );
              })}
            </div>
          </div>

          {mode === "barcode" ? (
            <BarcodeScanner
              onDetected={onBarcode}
              busy={scanBusy}
              statusText={t("analyze.barcode.status")}
            />
          ) : !preview ? (
            <div
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
               className="flex min-h-64 flex-col items-center justify-center gap-4 rounded-[24px] bg-secondary/65 p-8 text-center md:p-12"
            >
               <div className="flex h-16 w-16 items-center justify-center rounded-full bg-card text-primary shadow-sm soft-float">
                <Upload className="h-6 w-6" />
              </div>
              <p className="text-sm font-medium text-foreground">{t("analyze.dropzone")}</p>
              <div className="flex gap-2">
                <Button variant="default" size="sm" className="rounded-full" onClick={() => fileRef.current?.click()}>
                  <Upload className="mr-1.5 h-3.5 w-3.5" />{t("analyze.dropzone")}
                </Button>
                <Button variant="outline" size="sm" className="rounded-full" onClick={() => {
                  if (fileRef.current) { fileRef.current.setAttribute("capture", "environment"); fileRef.current.click(); }
                }}>
                  <Camera className="mr-1.5 h-3.5 w-3.5" />{t("analyze.camera")}
                </Button>
              </div>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => onPick(e.target.files?.[0] ?? null)} />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative overflow-hidden rounded-3xl border border-border">
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
           <div className="rounded-[24px] border border-card/80 bg-card p-6 shadow-sm">
            <h3 className="text-base font-bold tracking-tight text-foreground">{t("dash.tip.t")}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t("dash.tip.d")}</p>
          </div>
          <Disclaimer />
        </div>
      </div>
    </div>
  );
}
