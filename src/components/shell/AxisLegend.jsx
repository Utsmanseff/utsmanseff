"use client";

// Dua baris, masing-masing bertajuk. Tajuknya yang memberi tahu pembaca bahwa
// ia sedang membaca kunci peta — pekerjaan yang sebelumnya dibebankan
// kepadanya sendiri.
//
// Belahannya jujur: tiga hal pertama memang geometri, tiga terakhir memang
// warna. Kata "TEPI" hilang karena ia menunjuk hal yang salah — yang menandai
// akses publik adalah tepi lapis TERATAS, sementara sejak shading.js ada,
// keempat sisi setiap lapis diwarnai menurut sudut kamera.
//
// Krem terpilih belum pernah disebut sama sekali, padahal ia penanda paling
// penting di peta.
const COPY = {
  id: [
    ['BENTUK', 'KE BELAKANG tahun · TINGGI banyak stack · LUAS punya halaman'],
    ['WARNA', 'AMBER publik · KREM terpilih · REDUP tersaring'],
  ],
  en: [
    ['FORM', 'DEPTH year · HEIGHT stack size · AREA has a page'],
    ['COLOUR', 'AMBER public · CREAM selected · DIM filtered'],
  ],
};

// Lives outside the plate field on purpose: inside it, plate labels render
// on top of it.
export default function AxisLegend({ locale }) {
  return (
    <div className="border-t border-rule-soft px-5 py-2 font-mono text-[10px] text-muted-deep">
      {COPY[locale].map(([head, body]) => (
        <div key={head} className="flex gap-4 leading-[1.7]">
          <span className="w-[52px] shrink-0 tracking-[.12em] text-muted">{head}</span>
          <span>{body}</span>
        </div>
      ))}
    </div>
  );
}
