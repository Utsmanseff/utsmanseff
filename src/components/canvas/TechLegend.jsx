"use client";

const COPY = {
  title: { id: 'Stack', en: 'Stack' },
  clear: { id: 'Semua', en: 'All' },
  hint: {
    id: 'Pilih satu untuk menyorot project yang memakainya',
    en: 'Pick one to highlight the work that uses it',
  },
};

// The stack, back on the site — as a way of reading the map rather than a grid
// of logos. Every row is counted from the projects themselves, so the number
// beside a name is the evidence for it.
export default function TechLegend({ items, active, onPick, locale }) {
  if (items.length === 0) return null;

  return (
    <div className="fixed left-4 bottom-5 z-30 max-w-[46vw]">
      <div className="font-mono text-[10px] uppercase tracking-wider text-ground-mute mb-2">
        {COPY.title[locale]}
      </div>

      <ul className="flex flex-wrap items-center gap-1.5">
        {items.map((t) => {
          const on = active === t.name;
          return (
            <li key={t.name}>
              <button
                type="button"
                aria-pressed={on}
                onClick={() => onPick(on ? null : t.name)}
                className={
                  on
                    ? 'font-mono text-[11px] rounded-sm border px-2 py-1 border-amber text-amber bg-ground/70 backdrop-blur transition-colors duration-500'
                    : 'font-mono text-[11px] rounded-sm border px-2 py-1 border-ground-rule text-ground-mute bg-ground/70 backdrop-blur hover:text-ground-ink hover:border-amber transition-colors duration-500'
                }
              >
                {t.name}
                <span className="ml-1.5 text-ground-mute/80 tabular-nums">{t.count}</span>
              </button>
            </li>
          );
        })}

        {active && (
          <li>
            <button
              type="button"
              onClick={() => onPick(null)}
              className="font-mono text-[11px] rounded-sm px-2 py-1 text-ground-mute underline underline-offset-4 hover:text-ground-ink transition-colors duration-500"
            >
              {COPY.clear[locale]}
            </button>
          </li>
        )}
      </ul>

      <p className="font-mono text-[10px] text-ground-mute/80 mt-2">{COPY.hint[locale]}</p>
    </div>
  );
}
