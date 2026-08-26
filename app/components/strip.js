export default function Strip() {
  const items = ["Previous Year Papers", "Study Materials", "YouTube Links", "Curated by year & subject"];

  const content = items.map((item, i) => (
    <span key={i} className="mx-8 inline-flex items-center gap-8">
      <span className="text-[var(--fg-2)]">{item}</span>
      <span className="h-1 w-1 rounded-full bg-[var(--accent)]" />
    </span>
  ));

  return (
    <div className="relative z-10 w-full overflow-hidden border-y border-[var(--line)] bg-[var(--ink-2)]/60 py-5">
      <div className="relative flex">
        <div className="animate-marquee whitespace-nowrap text-sm uppercase tracking-[0.15em]">
          {content}
          {content}
          {content}
        </div>
        <div className="animate-marquee2 absolute top-0 whitespace-nowrap text-sm uppercase tracking-[0.15em]">
          {content}
          {content}
          {content}
        </div>
      </div>
    </div>
  );
}
