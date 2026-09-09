"use client";

const COPY = {
  title: { id: 'Semua project', en: 'All projects' },
  // Tanpa JavaScript yang dirender PaperFallback, bukan tabel ini: FlatTable
  // komponen cangkang dan tidak pernah muncul di sana. Yang benar tinggal
  // separuhnya — gerak yang dikurangi memang mendarat di sini lebih dulu,
  // lewat `calm ? 'list' : 'map'` di Shell.
  intro: {
    id: 'Daftar datar ini data yang sama dengan peta, tanpa geometrinya. Ini juga yang terbuka lebih dulu kalau gerak dikurangi.',
    en: 'The flat list is the same data as the map, without the geometry. It is also what opens first under reduced motion.',
  },
  foot: {
    id: 'Klik baris untuk memilih. Sebagian punya halaman baca, sebagian ringkasan saja.',
    en: 'Click a row to select it. Some have a reading page, some are summary only.',
  },
  cols: {
    id: ['SISTEM', 'KLIEN', 'TAHUN', 'AKSES', 'STACK'],
    en: ['SYSTEM', 'CLIENT', 'YEAR', 'ACCESS', 'STACK'],
  },
};

export default function FlatTable({ systems, locale, selected, dimmed, onSelect }) {
  return (
    <div data-testid="flat-table" className="overflow-y-auto p-10">
      <h1 className="font-display text-[32px] font-extrabold tracking-[-.03em] text-ink-bright m-0">
        {COPY.title[locale]}
      </h1>
      <p className="text-[14.5px] text-body-soft max-w-[70ch] mt-2 mb-6">{COPY.intro[locale]}</p>

      <table className="w-full border border-rule border-collapse">
        <thead>
          <tr className="bg-surface">
            {COPY.cols[locale].map((c) => (
              <th key={c} className="text-left font-mono text-[10px] tracking-[.12em] text-muted font-medium px-3.5 py-2">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {systems.map((s) => (
            <tr
              key={s.slug}
              className="border-b border-rule-soft transition-opacity duration-700"
              style={{ opacity: dimmed.has(s.slug) ? 0.45 : 1 }}
            >
              <td className="px-3.5 py-2.5">
                <button
                  type="button"
                  aria-pressed={selected === s.slug}
                  onClick={() => onSelect(s.slug)}
                  className={selected === s.slug ? 'text-amber' : 'text-ink'}
                >
                  {s.shortName[locale]}
                </button>
              </td>
              <td className="px-3.5 py-2.5 font-mono text-[12px] text-muted">{s.client}</td>
              <td className="px-3.5 py-2.5 font-mono text-[12px] text-muted">{s.year}</td>
              <td className="px-3.5 py-2.5 font-mono text-[12px] text-muted">{s.access}</td>
              <td className="px-3.5 py-2.5 font-mono text-[12px] text-muted">{s.tech.join(' · ')}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <p className="font-mono text-[11px] text-muted-deep mt-4">{COPY.foot[locale]}</p>
    </div>
  );
}
