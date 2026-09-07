// Access status is stated plainly. A dead "Live Demo" button costs more
// trust than an honest "internal system" label.
const LABEL = {
  public: { id: 'Publik — bisa dijelajahi', en: 'Public — open to explore' },
  internal: { id: 'Internal — demo atas permintaan', en: 'Internal — demo on request' },
  none: { id: 'Tidak ada URL publik', en: 'No public URL' },
};

// Short forms for a narrow row, where the sentence would wrap. The paper
// document's AccessTick carries the same strings on its own layer.
const LABEL_SHORT = {
  public: { id: 'PUBLIK', en: 'PUBLIC' },
  internal: { id: 'INTERNAL', en: 'INTERNAL' },
  none: { id: 'TANPA URL', en: 'NO URL' },
};

// One layer now, so the badge no longer takes a tone: only public earns amber.
const TONE = {
  public: 'border-amber text-amber',
  internal: 'border-rule text-muted',
  none: 'border-dashed border-rule text-muted',
};

export default function AccessBadge({ access, locale, short = false }) {
  const label = short ? LABEL_SHORT[access][locale] : LABEL[access][locale];
  return (
    <span
      className={`font-mono uppercase tracking-wide border whitespace-nowrap ${TONE[access]} ${
        short ? 'text-[9px] px-1.5 py-0.5' : 'text-[10px] px-2 py-1'
      }`}
    >
      {label}
    </span>
  );
}
