export type PreviewVariant = "c" | "d";

interface PreviewSwitcherProps {
  variant: PreviewVariant;
  onChange: (next: PreviewVariant) => void;
}

export function PreviewSwitcher({ variant, onChange }: PreviewSwitcherProps) {
  return (
    <div
      role="region"
      aria-label="Website direction preview switcher"
      className="fixed bottom-5 right-5 z-50 flex items-center gap-1 border border-[rgba(17,17,16,0.16)] bg-[rgba(250,249,246,0.96)] p-1 shadow-[0_8px_28px_rgba(17,17,16,0.14)] backdrop-blur-md"
    >
      <button
        type="button"
        onClick={() => onChange("c")}
        aria-pressed={variant === "c"}
        className={`px-3 py-1.5 text-[12.5px] font-medium tracking-[-0.01em] transition-colors cursor-pointer ${
          variant === "c"
            ? "bg-[var(--sf-ink)] text-[var(--sf-paper)]"
            : "text-[var(--sf-ink-muted)] hover:text-[var(--sf-ink)]"
        }`}
      >
        Path C · Light → Dark
      </button>
      <button
        type="button"
        onClick={() => onChange("d")}
        aria-pressed={variant === "d"}
        className={`px-3 py-1.5 text-[12.5px] font-medium tracking-[-0.01em] transition-colors cursor-pointer ${
          variant === "d"
            ? "bg-[var(--sf-ink)] text-[var(--sf-paper)]"
            : "text-[var(--sf-ink-muted)] hover:text-[var(--sf-ink)]"
        }`}
      >
        Path D · Minimal Editorial
      </button>
    </div>
  );
}
