"use client";

const COPY = {
  id: ['KEDALAMAN tahun · TINGGI stack', 'LUAS punya halaman · TEPI publik', 'REDUP tersaring, tetap ada'],
  en: ['DEPTH year · HEIGHT stack', 'AREA has page · EDGE public', 'DIM filtered out, still present'],
};

// Lives outside the plate field on purpose: inside it, plate labels render
// on top of it.
export default function AxisLegend({ locale }) {
  return (
    <div className="border-t border-rule-soft px-5 py-2.5 flex gap-[26px] font-mono text-[10px] text-muted-deep">
      {COPY[locale].map((line) => <span key={line}>{line}</span>)}
    </div>
  );
}
