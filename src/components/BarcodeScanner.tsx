import { useEffect, useRef, useState } from "react";
import { Html5Qrcode, Html5QrcodeSupportedFormats } from "html5-qrcode";
import { Loader2, ScanLine, X } from "lucide-react";

type Props = {
  onDetected: (code: string) => void;
  onCancel?: () => void;
  busy?: boolean;
  statusText?: string;
};

export function BarcodeScanner({ onDetected, onCancel, busy, statusText }: Props) {
  const elId = "alentra-scanner-region";
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const handledRef = useRef(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    handledRef.current = false;
    let canceled = false;
    const start = async () => {
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
          { facingMode: "environment" },
          { fps: 12, qrbox: { width: 260, height: 160 }, aspectRatio: 1.4 },
          (decoded) => {
            if (handledRef.current) return;
            handledRef.current = true;
            // Haptic feedback
            try { navigator.vibrate?.(35); } catch {}
            onDetected(decoded);
          },
          () => {},
        );
      } catch (e: any) {
        setErr(e?.message ?? "Camera unavailable");
      }
    };
    start();
    return () => {
      canceled = true;
      const s = scannerRef.current;
      if (s) {
        s.stop().catch(() => {}).finally(() => {
          try { s.clear(); } catch {}
        });
      }
    };
  }, [onDetected]);

  return (
    <div className="relative overflow-hidden rounded-3xl border border-border bg-charcoal">
      <div id={elId} className="aspect-[4/5] w-full [&_video]:!h-full [&_video]:!w-full [&_video]:object-cover" />

      {/* Overlay reticle */}
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

      {/* Top bar */}
      <div className="absolute inset-x-0 top-0 flex items-center justify-between p-4 text-white">
        <div className="inline-flex items-center gap-2 rounded-full bg-black/40 px-3 py-1.5 text-xs font-medium backdrop-blur-md">
          <ScanLine className="h-3.5 w-3.5 text-sage" />
          Barkod & QR Tarayıcı
        </div>
        {onCancel && (
          <button
            onClick={onCancel}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md hover:bg-black/60"
            aria-label="Kapat"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Bottom status */}
      <div className="absolute inset-x-0 bottom-0 p-4 text-center text-white">
        {busy ? (
          <div className="inline-flex items-center gap-2 rounded-full bg-black/55 px-4 py-2 text-sm backdrop-blur-md">
            <Loader2 className="h-4 w-4 animate-spin text-sage" />
            {statusText ?? "Ürün getiriliyor..."}
          </div>
        ) : (
          <p className="text-xs text-white/80">
            Barkodu çerçevenin içine hizalayın — otomatik okunur.
          </p>
        )}
        {err && <p className="mt-2 text-xs text-danger">{err}</p>}
      </div>
    </div>
  );
}
