"use client";

/**
 * Subtle, premium backdrop for dark pages.
 * A near-black canvas with one restrained warm glow, a soft vignette
 * and fine film grain. Deliberately quiet — no colored gradients.
 */
export default function AuroraBackground() {
  return (
    <div
      aria-hidden="true"
      className="grain fixed inset-0 -z-10 overflow-hidden"
      style={{ background: "var(--ink)" }}
    >
      {/* single restrained top glow */}
      <div className="absolute inset-x-0 top-0 h-[70vh] bg-[radial-gradient(60%_100%_at_50%_0%,rgba(201,168,106,0.10),transparent_70%)]" />

      {/* soft vignette to focus the centre */}
      <div className="absolute inset-0 bg-[radial-gradient(120%_120%_at_50%_30%,transparent_55%,rgba(0,0,0,0.55)_100%)]" />
    </div>
  );
}
