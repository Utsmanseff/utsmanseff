"use client";

import { useMediaQuery } from '@/lib/hooks/useMediaQuery';

// Perjalanan satu klaim, khusus halaman IDRG. Bukan slot umum: tidak ada medan
// data baru, dan delapan halaman baca lain tidak menyentuh berkas ini sama
// sekali.
//
// Yang paling mudah salah di gambar ini adalah SatuSehat. Datanya menyebut
// hasil coding diagnosa dikirim "melalui service tersendiri" — service itu
// BUKAN layanan ini. Karena itu ia berdiri di luar batas, dan tidak ada satu
// pun panah yang berangkat dari dalam batas langsung ke SatuSehat. Ada test
// yang menjaganya.

const COPY = {
  boundary: { id: 'LAYANAN INI', en: 'THIS SERVICE' },
  branch: { id: 'hasil coding diagnosa', en: 'diagnosis coding' },
  title: {
    id: 'Alur klaim: dari SIMRS, melalui coding dan grouping IDRG, pemetaan ke grouper INA-CBG, dan antrian pengiriman di dalam layanan ini, sampai ke BPJS. Hasil coding diagnosanya dikirim ke SatuSehat melalui service tersendiri.',
    en: 'Claim flow: from the SIMRS, through IDRG coding and grouping, mapping into the INA-CBG grouper, and a submission queue inside this service, out to BPJS. Its diagnosis coding is sent to SatuSehat through a separate service.',
  },
};

// Satu daftar simpul, dipakai dua tata letak. `kind` menentukan tepinya:
// 'external' bergaris putus-putus, sama seperti lencana TANPA URL.
const NODES = {
  simrs: { kind: 'external', id: ['SIMRS'], en: ['SIMRS'] },
  idrg: { kind: 'inside', id: ['Coding & grouping', 'IDRG'], en: ['IDRG coding', '& grouping'] },
  inacbg: { kind: 'inside', id: ['Pemetaan ke', 'grouper INA-CBG'], en: ['Mapped into the', 'INA-CBG grouper'] },
  queue: { kind: 'inside', id: ['Antrian kirim', 'penanganan gagal'], en: ['Submission queue', 'failure handling'] },
  bpjs: { kind: 'external', id: ['BPJS'], en: ['BPJS'] },
  relay: { kind: 'external', id: ['Service tersendiri'], en: ['A separate service'] },
  satusehat: { kind: 'external', id: ['SatuSehat'], en: ['SatuSehat'] },
};

// Mendatar: satu baris lima simpul, cabang menggantung di bawah simpul IDRG.
//
// viewBox 728 bukan angka bulat yang kebetulan: itu lebar kolom halaman baca,
// jadi skalanya 1:1 dan teks 11px benar-benar terbaca 11px. Melebarkan viewBox
// akan mengecilkan hurufnya tanpa terlihat di test mana pun.
const ACROSS = {
  viewBox: '0 0 728 226',
  box: { w: 126, h: 56 },
  // `relay` berdiri sendirian di barisnya, jadi ia boleh lebih lebar — labelnya
  // yang terpanjang dan tidak boleh dipendekkan: kalimat datanya menyebut
  // "melalui service tersendiri", dan itu justru intinya.
  wider: { relay: 160 },
  at: {
    simrs: [17, 40], idrg: [159, 40], inacbg: [301, 40], queue: [443, 40], bpjs: [585, 40],
    relay: [159, 154], satusehat: [345, 154],
  },
  boundary: { x: 146, y: 16, w: 436, h: 104 },
  boundaryLabel: [152, 12],
  edges: [
    ['simrs', 'idrg', 'h'], ['idrg', 'inacbg', 'h'], ['inacbg', 'queue', 'h'], ['queue', 'bpjs', 'h'],
    ['idrg', 'relay', 'v'], ['relay', 'satusehat', 'h'],
  ],
  branchLabel: [225, 140],
};

// Menumpuk: kolom utama turun ke bawah, cabang membelok ke kanan dari IDRG.
const STACKED = {
  viewBox: '0 0 350 420',
  box: { w: 150, h: 52 },
  wider: {},
  at: {
    simrs: [16, 10], idrg: [16, 96], inacbg: [16, 182], queue: [16, 268], bpjs: [16, 354],
    relay: [192, 96], satusehat: [192, 182],
  },
  boundary: { x: 4, y: 84, w: 174, h: 248 },
  boundaryLabel: [8, 80],
  edges: [
    ['simrs', 'idrg', 'v'], ['idrg', 'inacbg', 'v'], ['inacbg', 'queue', 'v'], ['queue', 'bpjs', 'v'],
    ['idrg', 'relay', 'h'], ['relay', 'satusehat', 'v'],
  ],
  branchLabel: [184, 88],
};

function Node({ node, at, box, locale }) {
  const [x, y] = at;
  const lines = node[locale];
  const dashed = node.kind === 'external';
  return (
    <g data-node={node.kind}>
      <rect
        x={x} y={y} width={box.w} height={box.h}
        fill="var(--color-surface)"
        stroke={dashed ? 'var(--color-muted-deep)' : 'var(--color-rule)'}
        strokeDasharray={dashed ? '4 3' : undefined}
      />
      <text
        x={x + box.w / 2}
        y={y + box.h / 2 - (lines.length - 1) * 7 + 4}
        textAnchor="middle"
        fill={dashed ? 'var(--color-muted)' : 'var(--color-ink)'}
        fontSize="11"
        fontFamily="var(--font-mono, monospace)"
      >
        {lines.map((line, i) => (
          <tspan key={line} x={x + box.w / 2} dy={i === 0 ? 0 : 14}>{line}</tspan>
        ))}
      </text>
    </g>
  );
}

// Panah antar simpul. 'h' berangkat dari tepi kanan ke tepi kiri, 'v' dari
// tepi bawah ke tepi atas — satu belokan tidak pernah diperlukan karena tiap
// pasangan sudah sebaris atau sekolom.
function Edge({ from, to, dir, at, box, wider }) {
  const [fx, fy] = at[from];
  const [tx, ty] = at[to];
  const fw = wider[from] || box.w;
  const tw = wider[to] || box.w;
  const d = dir === 'h'
    ? `M ${fx + fw} ${fy + box.h / 2} L ${tx - 7} ${ty + box.h / 2}`
    : `M ${fx + fw / 2} ${fy + box.h} L ${tx + tw / 2} ${ty - 7}`;
  return <path d={d} stroke="var(--color-muted-deep)" strokeWidth="1" fill="none" markerEnd="url(#idrg-arrow)" />;
}

export default function IdrgFlow({ locale }) {
  const wide = useMediaQuery('(min-width: 640px)');
  const L = wide ? ACROSS : STACKED;

  return (
    <svg
      role="img"
      viewBox={L.viewBox}
      className="w-full h-auto"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>{COPY.title[locale]}</title>
      <defs>
        <marker id="idrg-arrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto">
          <path d="M 0 0 L 8 4 L 0 8 z" fill="var(--color-muted-deep)" />
        </marker>
      </defs>

      {/* Batas layanan. Satu-satunya yang amber, karena satu-satunya yang
          harus ditangkap lebih dulu: apa yang dikerjakan sendiri, apa tidak. */}
      <rect
        x={L.boundary.x} y={L.boundary.y} width={L.boundary.w} height={L.boundary.h}
        fill="none" stroke="var(--color-amber)" strokeWidth="1" strokeDasharray="3 4"
      />
      <text
        x={L.boundaryLabel[0]} y={L.boundaryLabel[1]}
        fill="var(--color-amber)" fontSize="9" letterSpacing="1.2"
        fontFamily="var(--font-mono, monospace)"
      >
        {COPY.boundary[locale]}
      </text>

      {L.edges.map(([from, to, dir]) => (
        <Edge key={`${from}-${to}`} from={from} to={to} dir={dir} at={L.at} box={L.box} wider={L.wider} />
      ))}

      <text
        x={L.branchLabel[0]} y={L.branchLabel[1]}
        fill="var(--color-muted)" fontSize="9"
        fontFamily="var(--font-mono, monospace)"
      >
        {COPY.branch[locale]}
      </text>

      {Object.entries(NODES).map(([id, node]) => (
        <Node
          key={id}
          node={node}
          at={L.at[id]}
          box={L.wider[id] ? { ...L.box, w: L.wider[id] } : L.box}
          locale={locale}
        />
      ))}
    </svg>
  );
}
