// Kedalaman di peta ini datang dari lapisan, tepi dan sudut — tidak pernah dari
// bayangan. Modul ini memegang bagian sudutnya: cahaya ditetapkan di ruang
// layar, jadi memutar peta mengubah rupa tumpukan, bukan cuma posisinya.
//
// Murni dan tanpa DOM, seperti filters.js dan layout.js. Ia tidak tahu apa itu
// pointer, dan tidak tahu plate mana yang sedang terpilih.

export const EDGE_RAMP = { dark: '#2A3236', bright: '#4C555A' };

// Dasar naik menurut kedalaman lapis; sudut kamera cuma memiringkannya, tidak
// menggantikannya. BASE_LOW + BASE_RANGE + AMP harus tetap <= 1.
const BASE_LOW = 0.18;
const BASE_RANGE = 0.34;
const AMP = 0.42;

// Kiri-atas layar. Derajat, searah dengan rotZ supaya keduanya bisa dijumlahkan.
const LIGHT_DEG = 135;

const NORMALS = {
  top: [0, -1],
  right: [1, 0],
  bottom: [0, 1],
  left: [-1, 0],
};

const channels = (hex) => [
  parseInt(hex.slice(1, 3), 16),
  parseInt(hex.slice(3, 5), 16),
  parseInt(hex.slice(5, 7), 16),
];

const mix = (from, to, t) => {
  const a = channels(from);
  const b = channels(to);
  const hex = a
    .map((v, i) => Math.round(v + (b[i] - v) * t).toString(16).padStart(2, '0'))
    .join('');
  return `#${hex}`;
};

export function edgeTones({ index, layers, rotZ }) {
  // Satu lapis adalah puncak tumpukannya sendiri, bukan dasarnya.
  const depth = layers > 1 ? index / (layers - 1) : 1;
  const base = BASE_LOW + depth * BASE_RANGE;

  // Cahaya dibawa dari ruang layar ke ruang plate dengan diputar -rotZ.
  const angle = ((LIGHT_DEG - rotZ) * Math.PI) / 180;
  const light = [Math.cos(angle), Math.sin(angle)];

  return Object.fromEntries(
    Object.entries(NORMALS).map(([side, n]) => {
      const facing = Math.max(0, n[0] * light[0] + n[1] * light[1]);
      const t = Math.min(1, Math.max(0, base + AMP * facing));
      return [side, mix(EDGE_RAMP.dark, EDGE_RAMP.bright, t)];
    }),
  );
}
