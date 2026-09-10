import { PencilIcon } from "lucide-react";

function ProfileBanner() {
  return (
    <div className="relative h-[220px] w-full overflow-hidden bg-[linear-gradient(135deg,#1e0a3c_0%,#2e1065_40%,#0c1445_100%)]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(#a855f7 1px, transparent 1px), linear-gradient(90deg, #a855f7 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute rounded-full"
        style={{
          width: 500,
          height: 500,
          top: -200,
          right: "10%",
          background: "radial-gradient(circle, #7c3aed33 0%, transparent 70%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute rounded-full"
        style={{
          width: 300,
          height: 300,
          bottom: -150,
          left: "30%",
          background: "radial-gradient(circle, #a855f722 0%, transparent 70%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-night to-transparent"
      />

      <button
        type="button"
        className="absolute right-4 top-4 flex items-center gap-1.5 rounded-lg border border-white/10 bg-black/45 px-3 py-1.5 text-xs font-medium text-ink-muted transition-colors duration-200 hover:text-white"
      >
        <PencilIcon size={12} /> Edit Banner
      </button>
    </div>
  );
}

export { ProfileBanner };
