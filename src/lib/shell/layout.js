// The authoring box. Everything below is expressed inside it; the single
// scale factor from fitScale() is applied once, by MapScene.
// 940, bukan 900: baris terpanjang (2025, empat sistem) berujung di 875, dan
// label tahunnya berdiri sesudah itu. Ini satu-satunya angka yang perlu naik
// kalau nanti ada baris yang lebih panjang lagi.
export const SCENE = { width: 940, height: 620 };

export const ROW_Y = { 2024: 10, 2025: 225, 2026: 440 };
export const PLATE = {
  full: { width: 165, height: 115 },
  brief: { width: 100, height: 74 },
};
const GAP = 80;
const LAYER_STEP = 7;

// Rows are laid out left to right, each plate advancing the cursor by its own
// width. Multiplying an index by a fixed stride put a small plate inside the
// big one before it.
export function platePositions(systems) {
  const cursor = { 2024: 40, 2025: 40, 2026: 40 };
  return systems.map((s) => {
    const size = s.tier === 'full' ? PLATE.full : PLATE.brief;
    const x = cursor[s.year];
    cursor[s.year] = x + size.width + GAP;
    const layers = Math.max(1, (s.tech ?? []).length);
    return {
      slug: s.slug,
      year: s.year,
      x,
      // Small plates sit down the row a little so their labels clear the rule.
      y: ROW_Y[s.year] + (s.tier === 'full' ? 0 : 20),
      width: size.width,
      height: size.height,
      layers,
      topZ: (layers - 1) * LAYER_STEP,
      layerStep: LAYER_STEP,
    };
  });
}

// Ujung tiap baris, dihitung dari posisi yang sama dengan platePositions.
// Garis tahun dan labelnya berdiri di atas nilai ini, jadi keduanya berhenti
// bergantung pada lebar mati yang kebetulan cukup — dan berhenti patah tiap
// kali ada sistem yang bertambah.
//
// Tahun tanpa sistem tidak muncul di hasilnya sama sekali: tidak ada garis
// yang perlu digambar untuk baris kosong.
export function rowExtents(systems) {
  const ends = {};
  for (const p of platePositions(systems)) {
    ends[p.year] = Math.max(ends[p.year] ?? 0, p.x + p.width);
  }
  return ends;
}

// The 170px horizontal reserve is for labels that project outside the plate
// field. A fixed offset instead of a measurement breaks at 1440x800.
export function fitScale(pane) {
  const k = Math.min(
    (pane.width - 170) / SCENE.width,
    (pane.height - 30) / SCENE.height,
    1,
  );
  return Number.isFinite(k) ? Math.max(0.4, k) : 0.4;
}
