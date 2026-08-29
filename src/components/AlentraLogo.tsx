import { cn } from "@/lib/utils";
import logoAsset from "@/assets/alentra-logo.png.asset.json";

export function AlentraLogo({ className, withWordmark = true }: { className?: string; withWordmark?: boolean }) {
  return (
    <div className={cn("inline-flex items-center gap-2.5", className)}>
      <img
        src={logoAsset.url}
        alt="Alentra AI"
        className="h-8 w-8 rounded-lg object-contain"
      />
      {withWordmark && (
        <span className="font-serif text-xl tracking-tight text-foreground">
          Alentra<span className="text-primary">.</span>AI
        </span>
      )}
    </div>
  );
}
