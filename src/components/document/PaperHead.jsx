"use client";

import { meta } from '@/lib/data/meta';
import { techNames } from '@/lib/data/tech';
import LangSwitcher from '@/components/nav/LangSwitcher';

const COPY = {
  role: { id: 'FULLSTACK DEVELOPER', en: 'FULLSTACK DEVELOPER' },
};

// The gate's words on the paper layer. Stack is a middot paragraph rather than
// framed chips: chips cost about 120px and a 44px touch target each, for the
// same names, and they push the first system under the fold on a 360x640 screen.
export default function PaperHead({ systems, locale }) {
  const years = systems.map((s) => Number(s.year));
  const span = `${Math.min(...years)}–${Math.max(...years)}`;

  return (
    <header>
      <div className="flex items-center justify-between font-mono text-[10.5px] text-paper-muted">
        <span>UTSMAN</span>
        <LangSwitcher />
      </div>

      <h1 className="font-display font-extrabold text-[30px] leading-none tracking-[-.03em] text-paper-ink mt-3.5 mb-0">
        {meta.name}
      </h1>

      <p className="font-mono text-[10px] tracking-[.09em] text-paper-muted mt-2 mb-0 leading-[1.6]">
        {COPY.role[locale]}
        <br />
        {meta.location[locale].toUpperCase()} · {span}
      </p>

      <p
        data-testid="paper-stack"
        className="font-mono text-[10px] text-paper-ink-soft mt-2.5 mb-0 leading-[1.7]"
      >
        {techNames(systems).join(' · ')}
      </p>
    </header>
  );
}
