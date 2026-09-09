import Image from 'next/image';

// Two projects have no screenshot yet. A stated absence reads as honesty;
// a grey placeholder box reads as a broken page.
//
// Tidak menyebut "sistem internal": kalimat ini juga tampil di PSB, yang
// access-nya 'none' dan bukan sistem internal.
const MISSING = {
  id: 'Screenshot menyusul. Tangkapan layarnya masih disensor.',
  en: 'Screenshot to follow. Captures are still being redacted.',
};

// Ukurannya datang dari berkasnya, bukan dari angka mati. Dulu di sini ada
// 1600x900 untuk semua gambar, dan tidak satu pun screenshot berasio itu:
// yang lanskap 2.10-2.43, dan HRIS potret 0.49. Akibatnya setiap halaman baca
// merentang gambarnya — object-fit bawaan `fill` tidak pernah mengeluh.
export default function ScreenshotBlock({ src, size, alt, locale }) {
  if (!src || !size) {
    return (
      <div className="border border-dashed border-plate-edge-2 p-8 text-center">
        <p className="font-mono text-xs text-muted">{MISSING[locale]}</p>
      </div>
    );
  }
  return (
    <Image
      src={src}
      alt={alt}
      width={size[0]}
      height={size[1]}
      // Jangan pernah membesarkan gambar melampaui pikselnya sendiri. Tidak
      // mengikat untuk screenshot lanskap (1652-1901px, jauh lebih lebar dari
      // kolom 728px); yang dijaga screenshot ponsel HRIS yang cuma 355px, dan
      // tanpa batas ini direntang dua kali lipat setinggi 1489px.
      style={{ maxWidth: size[0] }}
      className="w-full h-auto border border-rule mx-auto"
    />
  );
}
