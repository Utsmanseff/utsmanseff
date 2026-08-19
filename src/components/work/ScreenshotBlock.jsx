import Image from 'next/image';

// Two projects have no screenshot yet. A stated absence reads as honesty;
// a grey placeholder box reads as a broken page.
const MISSING = {
  id: 'Screenshot menyusul — sistem internal, tangkapan layar masih disensor.',
  en: 'Screenshot to follow — internal system, captures still being redacted.',
};

export default function ScreenshotBlock({ src, alt, locale }) {
  if (!src) {
    return (
      <div className="border border-dashed border-rule rounded p-8 text-center">
        <p className="font-mono text-xs text-mute">{MISSING[locale]}</p>
      </div>
    );
  }
  return (
    <Image
      src={src}
      alt={alt}
      width={1600}
      height={900}
      className="w-full h-auto rounded border border-rule"
      priority
    />
  );
}
