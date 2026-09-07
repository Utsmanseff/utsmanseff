// The paper twin of AccessBadge. It exists because the dark badge paints its
// public state in #C97B3F, which is 2.8:1 on paper — the on-paper amber is
// #9C5A28. Labels are the short forms, because this sits in a phone row next
// to the system name and the long sentence would wrap.
const LABEL = {
  public: { id: 'PUBLIK', en: 'PUBLIC' },
  internal: { id: 'INTERNAL', en: 'INTERNAL' },
  none: { id: 'TANPA URL', en: 'NO URL' },
};

const TONE = {
  public: 'border-amber-ink text-amber-ink',
  internal: 'border-paper-rule-edge text-paper-muted',
  none: 'border-dashed border-paper-rule-edge text-paper-muted',
};

export default function AccessTick({ access, locale }) {
  return (
    <span className={`font-mono text-[9px] uppercase tracking-wide border px-1.5 py-0.5 whitespace-nowrap ${TONE[access]}`}>
      {LABEL[access][locale]}
    </span>
  );
}
