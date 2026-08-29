import { useEffect, useRef, useState } from "react";
import { Html5Qrcode, Html5QrcodeSupportedFormats } from "html5-qrcode";
import { Loader2, ScanLine, X, Lightbulb, SwitchCamera, Search, Camera, ImageUp, ExternalLink } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Props = {
  onDetected: (code: string) => void;
  onCancel?: () => void;
  busy?: boolean;
  statusText?: string;
};

const FORMATS = [
  Html5QrcodeSupportedFormats.EAN_13,
  Html5QrcodeSupportedFormats.EAN_8,
  Html5QrcodeSupportedFormats.UPC_A,
  Html5QrcodeSupportedFormats.UPC_E,
  Html5QrcodeSupportedFormats.CODE_128,
  Html5QrcodeSupportedFormats.CODE_39,
  Html5QrcodeSupportedFormats.ITF,
  Html5QrcodeSupportedFormats.QR_CODE,
];

export function BarcodeScanner({ onDetected, onCancel, busy, statusText }: Props) {
  const { t } = useI18n();
  const elId = "alentra-scanner-region";
  const fileElId = "alentra-scanner-file-region";
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const handledRef = useRef<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const [live, setLive] = useState(false);
  const [starting, setStarting] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [facing, setFacing] = useState<"environment" | "user">("environment");
  const [torchOn, setTorchOn] = useState(false);
  const [manual, setManual] = useState("");
  const [fileBusy, setFileBusy] = useState(false);
  const [embedded, setEmbedded] = useState(false);

  useEffect(() => {
    try {
      setEmbedded(window.self !== window.top);
    } catch {
      setEmbedded(true);
    }
  }, []);

  const stopCamera = async () => {
    const s = scannerRef.current;
    scannerRef.current = null;
    setTorchOn(false);
    if (!s) return;
    try {
      await s.stop();
    } catch {}
    try {
      s.clear();
    } catch {}
  };

  useEffect(() => {
    return () => {
      void stopCamera();
    };
  }, []);

  const startCamera = async (nextFacing = facing) => {
    setErr(null);
    handledRef.current = null;
    if (typeof window !== "undefined" && !window.isSecureContext) {
      setErr(t("analyze.barcode.insecure"));
      return;
    }
    if (!navigator.mediaDevices?.getUserMedia) {
      setErr(t("analyze.barcode.nocam"));
      return;
    }
    setStarting(true);
    await stopCamera();
    try {
      const scanner = new Html5Qrcode(elId, { verbose: false, formatsToSupport: FORMATS });
      scannerRef.current = scanner;
      await scanner.start(
        { facingMode: nextFacing },
        {
          fps: 12,
          qrbox: (vw, vh) => {
            const w = Math.max(180, Math.floor(Math.min(vw, vh) * 0.8));
            return { width: w, height: Math.floor(w * 0.62) };
          },
          aspectRatio: 1.4,
        },
        (decoded) => {
          const code = decoded.trim();
          if (!code || handledRef.current === code) return;
          handledRef.current = code;
          try {
            navigator.vibrate?.(35);
          } catch {}
          onDetected(code);
        },
        () => {},
      );
      setLive(true);
    } catch (e: unknown) {
      const raw = e instanceof Error ? `${e.name} ${e.message}` : String(e);
      await stopCamera();
      setLive(false);
      if (/NotAllowed|Permission|denied|dismissed/i.test(raw)) {
        setErr(embedded ? t("analyze.barcode.embedded") : t("analyze.barcode.denied"));
      } else if (/NotFound|Overconstrained|no camera|Requested device/i.test(raw)) {
        setErr(t("analyze.barcode.nocam"));
      } else {
        setErr(t("analyze.barcode.failed"));
      }
    } finally {
      setStarting(false);
    }
  };

  const flipCamera = async () => {
    const next = facing === "environment" ? "user" : "environment";
    setFacing(next);
    if (live) await startCamera(next);
  };

  const toggleTorch = async () => {
    const s = scannerRef.current as unknown as {
      applyVideoConstraints?: (c: MediaTrackConstraints) => Promise<void>;
    } | null;
    if (!s?.applyVideoConstraints) return;
    try {
      await s.applyVideoConstraints({ advanced: [{ torch: !torchOn }] } as unknown as MediaTrackConstraints);
      setTorchOn((v) => !v);
    } catch {
      setErr(t("analyze.barcode.torchFail"));
    }
  };

  // Decode a barcode from a photo — works even when the camera is unavailable.
  const scanFromImage = async (f: File) => {
    setFileBusy(true);
    setErr(null);
    let picker: Html5Qrcode | null = null;
    try {
      picker = new Html5Qrcode(fileElId, { verbose: false, formatsToSupport: FORMATS });
      const decoded = await picker.scanFile(f, false);
      const code = decoded.trim();
      if (!code) throw new Error("empty");
      try {
        navigator.vibrate?.(35);
      } catch {}
      onDetected(code);
    } catch {
      setErr(t("analyze.barcode.imageFail"));
    } finally {
      try {
        picker?.clear();
      } catch {}
      setFileBusy(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const submitManual = () => {
    const code = manual.replace(/\s+/g, "");
    if (!/^[0-9A-Za-z]{4,32}$/.test(code)) return;
    onDetected(code);
  };

  const manualReady = /^[0-9A-Za-z]{4,32}$/.test(manual.replace(/\s+/g, ""));

  return (
    <div className="space-y-4">
      <div className="anim-rise relative overflow-hidden rounded-3xl border border-border bg-charcoal">
        <div
          id={elId}
          className="aspect-[4/5] w-full [&_video]:!h-full [&_video]:!w-full [&_video]:object-cover"
        />

        {/* Idle / error state — camera starts only on an explicit tap */}
        {!live && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-charcoal px-6 text-center">
            <span className="aura-ring relative inline-flex h-16 w-16 items-center justify-center rounded-2xl border border-white/15 bg-white/5 text-white">
              <ScanLine className="h-7 w-7 text-sage" />
            </span>
            <p className="max-w-xs text-xs leading-relaxed text-white/75">
              {err ?? t("analyze.barcode.idle")}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2">
              <Button
                type="button"
                onClick={() => void startCamera()}
                disabled={starting}
                className="btn-shine press rounded-full"
              >
                {starting ? (
                  <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                ) : (
                  <Camera className="mr-1.5 h-4 w-4" />
                )}
                {t("analyze.barcode.start")}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => fileRef.current?.click()}
                disabled={fileBusy}
                className="press rounded-full border-white/25 bg-white/5 text-white hover:bg-white/10"
              >
                {fileBusy ? (
                  <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                ) : (
                  <ImageUp className="mr-1.5 h-4 w-4" />
                )}
                {t("analyze.barcode.fromPhoto")}
              </Button>
            </div>
            {embedded && (
              <a
                href="/analyze"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-[11px] font-medium text-sage underline-offset-4 hover:underline"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                {t("analyze.barcode.newTab")}
              </a>
            )}
          </div>
        )}

        {/* Overlay reticle */}
        {live && (
          <>
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <div className="relative h-[42%] w-[78%] rounded-3xl border-2 border-white/80 shadow-[0_0_0_9999px_rgba(0,0,0,0.45)]">
                <span className="absolute -left-1 -top-1 h-7 w-7 rounded-tl-2xl border-l-[3px] border-t-[3px] border-sage" />
                <span className="absolute -right-1 -top-1 h-7 w-7 rounded-tr-2xl border-r-[3px] border-t-[3px] border-sage" />
                <span className="absolute -bottom-1 -left-1 h-7 w-7 rounded-bl-2xl border-b-[3px] border-l-[3px] border-sage" />
                <span className="absolute -bottom-1 -right-1 h-7 w-7 rounded-br-2xl border-b-[3px] border-r-[3px] border-sage" />
                {!busy && (
                  <span className="scanner-laser absolute left-3 right-3 top-1/2 h-[2px] rounded-full bg-sage shadow-[0_0_18px_2px_var(--sage)]" />
                )}
              </div>
            </div>

            <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-2 p-4 text-white">
              <div className="inline-flex items-center gap-2 rounded-full bg-black/40 px-3 py-1.5 text-xs font-medium backdrop-blur-md">
                <ScanLine className="h-3.5 w-3.5 text-sage" />
                {t("analyze.barcode.title")}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => void toggleTorch()}
                  className="press inline-flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md transition-colors hover:bg-black/60"
                  aria-label={t("analyze.barcode.torch")}
                  title={t("analyze.barcode.torch")}
                >
                  <Lightbulb className={`h-4 w-4 ${torchOn ? "text-sage" : ""}`} />
                </button>
                <button
                  onClick={() => void flipCamera()}
                  className="press inline-flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md transition-colors hover:bg-black/60"
                  aria-label={t("analyze.barcode.flip")}
                  title={t("analyze.barcode.flip")}
                >
                  <SwitchCamera className="h-4 w-4" />
                </button>
                <button
                  onClick={() => {
                    void stopCamera();
                    setLive(false);
                    onCancel?.();
                  }}
                  className="press inline-flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md transition-colors hover:bg-black/60"
                  aria-label={t("analyze.barcode.stop")}
                  title={t("analyze.barcode.stop")}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="absolute inset-x-0 bottom-0 p-4 text-center text-white">
              {busy ? (
                <div className="inline-flex items-center gap-2 rounded-full bg-black/55 px-4 py-2 text-sm backdrop-blur-md">
                  <Loader2 className="h-4 w-4 animate-spin text-sage" />
                  {statusText ?? t("analyze.barcode.status")}
                </div>
              ) : (
                <p className="text-xs text-white/80">{t("analyze.barcode.hint")}</p>
              )}
            </div>
          </>
        )}
      </div>

      {/* Hidden helpers for file-based decoding */}
      <div id={fileElId} className="hidden" />
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) void scanFromImage(f);
        }}
      />

      {/* Manual entry */}
      <div className="anim-rise rounded-2xl border border-border bg-surface-muted/50 p-4">
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
            className="btn-shine press rounded-full"
            disabled={busy || !manualReady}
            onClick={submitManual}
          >
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="mr-1.5 h-4 w-4" />}
            {t("analyze.barcode.submit")}
          </Button>
        </div>
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={fileBusy}
          className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-medium text-primary underline-offset-4 hover:underline"
        >
          {fileBusy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ImageUp className="h-3.5 w-3.5" />}
          {t("analyze.barcode.fromPhoto")}
        </button>
      </div>
    </div>
  );
}
