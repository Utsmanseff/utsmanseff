// Access status is stated plainly. A dead "Live Demo" button costs more
// trust than an honest "internal system" label.
const LABEL = {
  public: { id: 'Publik — bisa dijelajahi', en: 'Public — open to explore' },
  internal: { id: 'Internal — demo atas permintaan', en: 'Internal — demo on request' },
  none: { id: 'Tidak ada URL publik', en: 'No public URL' },
};

export default function AccessBadge({ access, locale, tone = 'paper' }) {
  const border = tone === 'ground' ? 'border-ground-rule text-ground-mute' : 'border-rule text-mute';
  return (
    <span className={`font-mono text-[10px] uppercase tracking-wide border px-2 py-1 rounded-sm ${border}`}>
      {LABEL[access][locale]}
    </span>
  );
}
