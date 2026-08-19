import Link from 'next/link';

const COPY = {
  prev: { id: 'Sebelumnya', en: 'Previous' },
  next: { id: 'Berikutnya', en: 'Next' },
};

export default function WorkFooterNav({ prev, next, locale }) {
  return (
    <nav className="flex justify-between gap-6 border-t border-rule pt-8 mt-16">
      <div>
        {prev && (
          <Link href={`/kerja/${prev.slug}`} className="group block">
            <span className="font-mono text-[10px] uppercase tracking-wider text-mute">
              {COPY.prev[locale]}
            </span>
            <span className="block font-display text-lg group-hover:text-amber-ink transition-colors duration-500">
              {prev.shortName[locale]}
            </span>
          </Link>
        )}
      </div>
      <div className="text-right">
        {next && (
          <Link href={`/kerja/${next.slug}`} className="group block">
            <span className="font-mono text-[10px] uppercase tracking-wider text-mute">
              {COPY.next[locale]}
            </span>
            <span className="block font-display text-lg group-hover:text-amber-ink transition-colors duration-500">
              {next.shortName[locale]}
            </span>
          </Link>
        )}
      </div>
    </nav>
  );
}
