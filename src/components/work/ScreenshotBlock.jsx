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

export default function ScreenshotBlock({ src, alt, locale }) {
  if (!src) {
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
      width={1600}
      height={900}
      className="w-full h-auto border border-rule"
    />
  );
}
