// Access status is stated plainly. A dead "Live Demo" button costs more
// trust than an honest "internal system" label.
const LABEL = {
  public: { id: 'Publik — bisa dijelajahi', en: 'Public — open to explore' },
  internal: { id: 'Internal — demo atas permintaan', en: 'Internal — demo on request' },
  none: { id: 'Tidak ada URL publik', en: 'No public URL' },
};

// One layer now, so the badge no longer takes a tone: only public earns amber.
const TONE = {
  public: 'border-amber text-amber',
  internal: 'border-rule text-muted',
  none: 'border-dashed border-rule text-muted',
};

export default function AccessBadge({ access, locale }) {
  return (
    <span className={`font-mono text-[10px] uppercase tracking-wide border px-2 py-1 ${TONE[access]}`}>
      {LABEL[access][locale]}
    </span>
  );
}
