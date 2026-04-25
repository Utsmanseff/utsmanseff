export default function SectionTitle({ eyebrow, children, id }) {
  return (
    <header id={id} className="mb-12 md:mb-16">
      {eyebrow && (
        <p className="font-mono text-xs uppercase tracking-widest text-mute mb-3">
          {eyebrow}
        </p>
      )}
      <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-semibold text-forest dark:text-cream leading-tight">
        {children}
      </h2>
    </header>
  );
}
