import { useEffect, useRef, useState } from "react";
import { Html5Qrcode, Html5QrcodeSupportedFormats } from "html5-qrcode";
import { Loader2, ScanLine, X, Lightbulb, SwitchCamera, Search } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Props = {
  onDetected: (code: string) => void;
  onCancel?: () => void;
  busy?: boolean;
  statusText?: string;
};

export function BarcodeScanner({ onDetected, onCancel, busy, statusText }: Props) {
  const { t } = useI18n();
  const elId = "alentra-scanner-region";
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const handledRef = useRef<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [facing, setFacing] = useState<"environment" | "user">("environment");
  const [torchOn, setTorchOn] = useState(false);
  const [manual, setManual] = useState("");

  useEffect(() => {
    handledRef.current = null;
    let canceled = false;

    const start = async () => {
      setErr(null);
      if (typeof window !== "undefined" && !window.isSecureContext) {
        setErr(t("analyze.barcode.insecure"));
        return;
      }
      if (!navigator.mediaDevices?.getUserMedia) {
        setErr(t("analyze.barcode.nocam"));
        return;
      }
      try {
        const scanner = new Html5Qrcode(elId, {
          verbose: false,
          formatsToSupport: [
            Html5QrcodeSupportedFormats.EAN_13,
            Html5QrcodeSupportedFormats.EAN_8,
            Html5QrcodeSupportedFormats.UPC_A,
            Html5QrcodeSupportedFormats.UPC_E,
            Html5QrcodeSupportedFormats.CODE_128,
            Html5QrcodeSupportedFormats.CODE_39,
            Html5QrcodeSupportedFormats.ITF,
            Html5QrcodeSupportedFormats.QR_CODE,
          ],
        });
        scannerRef.current = scanner;
        if (canceled) return;
        await scanner.start(
          { facingMode: facing },
          {
            fps: 12,
            qrbox: (vw, vh) => {
              const w = Math.max(180, Math.floor(Math.min(vw, vh) * 0.78));
              return { width: w, height: Math.floor(w * 0.62) };
            },
            aspectRatio: 1.4,
          },
          (decoded) => {
            const code = decoded.trim();
            if (!code || handledRef.current === code) return;
            handledRef.current = code;
            try { navigator.vibrate?.(35); } catch {}
            onDetected(code);
          },
          () => {},
        );
      } catch (e: any) {
        const name = String(e?.name ?? e?.message ?? "");
        if (/NotAllowed|Permission|denied/i.test(name)) setErr(t("analyze.barcode.denied"));
        else if (/NotFound|Overconstrained|no camera/i.test(name)) setErr(t("analyze.barcode.nocam"));
        else setErr(t("analyze.barcode.failed"));
      }
    };

    void start();
    return () => {
      canceled = true;
      const s = scannerRef.current;
      scannerRef.current = null;
      if (s) {
        s.stop().catch(() => {}).finally(() => {
          try { s.clear(); } catch {}
        });
      }
    };
  }, [onDetected, facing, t]);

  const toggleTorch = async () => {
    const s = scannerRef.current as any;
    if (!s) return;
    try {
      await s.applyVideoConstraints({ advanced: [{ torch: !torchOn }] });
      setTorchOn((v) => !v);
    } catch {
      setErr(t("analyze.barcode.failed"));
    }
  };

  const submitManual = () => {
    const code = manual.replace(/\s+/g, "");
    if (!/^[0-9A-Za-z]{4,32}$/.test(code)) return;
    onDetected(code);
  };

  return (
    <div className="space-y-4">
      <div className="relative overflow-hidden rounded-3xl border border-border bg-charcoal anim-rise">
        <div id={elId} className="aspect-[4/5] w-full [&_video]:!h-full [&_video]:!w-full [&_video]:object-cover" />

        {/* Overlay reticle */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="relative h-[42%] w-[78%] rounded-3xl border-2 border-white/80 shadow-[0_0_0_9999px_rgba(0,0,0,0.45)]">
            <span className="absolute -left-1 -top-1 h-7 w-7 rounded-tl-2xl border-l-[3px] border-t-[3px] border-sage" />
            <span className="absolute -right-1 -top-1 h-7 w-7 rounded-tr-2xl border-r-[3px] border-t-[3px] border-sage" />
            <span className="absolute -bottom-1 -left-1 h-7 w-7 rounded-bl-2xl border-b-[3px] border-l-[3px] border-sage" />
            <span className="absolute -bottom-1 -right-1 h-7 w-7 rounded-br-2xl border-b-[3px] border-r-[3px] border-sage" />
            {!busy && !err && (
              <span className="scanner-laser absolute left-3 right-3 top-1/2 h-[2px] rounded-full bg-sage shadow-[0_0_18px_2px_var(--sage)]" />
            )}
          </div>
        </div>

        {/* Top bar */}
        <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-2 p-4 text-white">
          <div className="inline-flex items-center gap-2 rounded-full bg-black/40 px-3 py-1.5 text-xs font-medium backdrop-blur-md">
            <ScanLine className="h-3.5 w-3.5 text-sage" />
            {t("analyze.barcode.title")}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTorch}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md transition-colors hover:bg-black/60"
              aria-label={t("analyze.barcode.torch")}
              title={t("analyze.barcode.torch")}
            >
              <Lightbulb className={`h-4 w-4 ${torchOn ? "text-sage" : ""}`} />
            </button>
            <button
              onClick={() => setFacing((f) => (f === "environment" ? "user" : "environment"))}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md transition-colors hover:bg-black/60"
              aria-label={t("analyze.barcode.flip")}
              title={t("analyze.barcode.flip")}
            >
              <SwitchCamera className="h-4 w-4" />
            </button>
            {onCancel && (
              <button
                onClick={onCancel}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md transition-colors hover:bg-black/60"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* Bottom status */}
        <div className="absolute inset-x-0 bottom-0 p-4 text-center text-white">
          {busy ? (
            <div className="inline-flex items-center gap-2 rounded-full bg-black/55 px-4 py-2 text-sm backdrop-blur-md">
              <Loader2 className="h-4 w-4 animate-spin text-sage" />
              {statusText ?? t("analyze.barcode.status")}
            </div>
          ) : (
            <p className="text-xs text-white/80">{t("analyze.barcode.hint")}</p>
          )}
          {err && (
            <p className="mx-auto mt-2 max-w-xs rounded-xl bg-black/60 px-3 py-2 text-xs leading-relaxed text-white backdrop-blur-md">
              {err}
            </p>
          )}
        </div>
      </div>

      {/* Manual entry */}
      <div className="rounded-2xl border border-border bg-surface-muted/50 p-4">
        <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {t("analyze.barcode.manual")}
        </label>
        <div className="flex gap-2">
          <Input
            value={manual}
            inputMode="numeric"
            placeholder={t("analyze.barcode.manual.ph")}
            onChange={(e) => setManual(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                submitManual();
              }
            }}
          />
          <Button
            type="button"
            className="rounded-full press"
            disabled={busy || manual.replace(/\s+/g, "").length < 4}
            onClick={submitManual}
          >
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="mr-1.5 h-4 w-4" />}
            {t("analyze.barcode.submit")}
          </Button>
        </div>
      </div>
    </div>
  );
}
