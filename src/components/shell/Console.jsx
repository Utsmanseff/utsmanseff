"use client";

import { useEffect, useRef, useState } from 'react';

const COPY = {
  label: { id: 'Konsol perintah', en: 'Command console' },
  placeholder: {
    id: 'coba: filter client:rsu-nirwana · open hris · stack:livewire · help',
    en: 'try: filter client:rsu-nirwana · open hris · stack:livewire · help',
  },
  hint: {
    id: 'ENTER MENJALANKAN · ESC MENGOSONGKAN FILTER',
    en: 'ENTER RUNS · ESC CLEARS FILTERS',
  },
};

export default function Console({ locale, value, onChange, onRun, onEscape }) {
  const ref = useRef(null);
  // Read once, at mount: a letter carried in from the gate is already sitting in
  // the box, and it is the first letter of a command somebody is still typing.
  const [seeded] = useState(() => value !== '');

  // "/" focuses the console from anywhere, the way it does in the tools this
  // audience already uses.
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === '/' && document.activeElement !== ref.current) {
        e.preventDefault();
        ref.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Only when something was carried in. Focusing an empty console would steal
  // the page from a keyboard visitor who has not asked for it yet.
  useEffect(() => {
    if (seeded) ref.current?.focus();
  }, [seeded]);

  return (
    <div className="h-11 bg-ground-deep border-t border-rule flex items-center gap-3 px-6">
      <span className="text-amber font-mono text-[13px]">$</span>
      <label htmlFor="shell-console" className="sr-only">{COPY.label[locale]}</label>
      <input
        id="shell-console"
        ref={ref}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') onRun(value);
          if (e.key === 'Escape') onEscape();
        }}
        placeholder={COPY.placeholder[locale]}
        className="flex-1 bg-transparent border-0 outline-none font-mono text-[13px] text-ink placeholder:text-muted-deep"
      />
      <span className="font-mono text-[10.5px] text-muted-deep">{COPY.hint[locale]}</span>
    </div>
  );
}
