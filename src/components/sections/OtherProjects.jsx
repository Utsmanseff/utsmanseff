"use client";

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useLocale } from '@/lib/hooks/useLocale';
import { projects } from '@/lib/data/projects';
import SectionTitle from '@/components/ui/SectionTitle';

const EASE = 'cubic-bezier(0.16, 1, 0.3, 1)';

export default function OtherProjects() {
  const { locale, t } = useLocale();
  const [openId, setOpenId] = useState(null);

  return (
    <section
      id="other"
      className="py-16 md:py-20 px-6 border-t border-rule"
    >
      <div className="max-w-6xl mx-auto">
        <SectionTitle>{t('other.title')}</SectionTitle>

        {/* Column header (desktop) */}
        <div className="hidden md:grid grid-cols-12 gap-4 px-3 pb-3 mb-1 border-b border-rule">
          <div className="col-span-1 font-mono text-[10px] uppercase tracking-widest text-mute">
            {locale === 'id' ? 'Tahun' : 'Year'}
          </div>
          <div className="col-span-6 font-mono text-[10px] uppercase tracking-widest text-mute">
            {locale === 'id' ? 'Project' : 'Project'}
          </div>
          <div className="col-span-4 font-mono text-[10px] uppercase tracking-widest text-mute">
            Stack
          </div>
          <div className="col-span-1" />
        </div>

        <ul className="divide-y divide-rule border-b border-rule">
          {projects.other.map((p) => {
            const open = openId === p.id;
            return (
              <li key={p.id} className="group">
                <button
                  type="button"
                  onClick={() => setOpenId(open ? null : p.id)}
                  className="relative w-full text-left grid grid-cols-12 gap-4 items-baseline py-5 px-3 transition-colors duration-200 hover:bg-cream-deep/60 dark:hover:bg-forest/40"
                  aria-expanded={open}
                  aria-controls={`other-panel-${p.id}`}
                >
                  {/* Left amber accent that grows on hover/open */}
                  <span
                    aria-hidden
                    className="absolute left-0 top-0 h-full w-px bg-amber transition-transform duration-300 origin-top"
                    style={{
                      transform: open ? 'scaleY(1)' : 'scaleY(0)',
                      transitionTimingFunction: EASE,
                    }}
                  />
                  <span
                    aria-hidden
                    className="absolute left-0 top-0 h-full w-px bg-amber/50 origin-top scale-y-0 transition-transform duration-300 group-hover:scale-y-100"
                    style={{ transitionTimingFunction: EASE }}
                  />

                  <span className="col-span-2 md:col-span-1 font-mono text-xs md:text-sm text-mute tabular-nums">
                    {p.year}
                  </span>
                  <span className="col-span-7 md:col-span-6">
                    <span className="block font-display text-lg md:text-xl text-forest dark:text-cream leading-tight transition-colors duration-200 group-hover:text-amber">
                      {p.title[locale]}
                    </span>
                    <span className="block text-xs md:text-sm text-mute mt-1">
                      {p.client}
                    </span>
                  </span>
                  <span className="hidden md:flex md:col-span-4 flex-wrap gap-x-2 gap-y-1">
                    {p.tech.map((tech) => (
                      <span
                        key={tech}
                        className="font-mono text-[10px] uppercase tracking-widest text-mute"
                      >
                        {tech}
                      </span>
                    ))}
                  </span>
                  <span className="col-span-3 md:col-span-1 flex justify-end items-baseline">
                    <ChevronDown
                      size={18}
                      className="text-mute group-hover:text-amber transition-all duration-300"
                      style={{
                        transform: open ? 'rotate(180deg)' : 'rotate(0)',
                        transitionTimingFunction: EASE,
                      }}
                    />
                  </span>
                </button>

                {/* Smooth expand: grid-template-rows 0fr -> 1fr */}
                <div
                  id={`other-panel-${p.id}`}
                  role="region"
                  className="grid transition-all duration-500"
                  style={{
                    gridTemplateRows: open ? '1fr' : '0fr',
                    opacity: open ? 1 : 0,
                    transitionTimingFunction: EASE,
                  }}
                >
                  <div className="overflow-hidden">
                    <div className="px-3 pb-6 pt-1 grid grid-cols-12 gap-4">
                      <div className="col-span-12 md:col-span-10 md:col-start-2">
                        <p className="text-forest dark:text-cream leading-relaxed text-sm md:text-base text-justify hyphens-auto mb-4">
                          {p.desc[locale]}
                        </p>
                        <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-2 text-sm text-mute">
                          {(p.features?.[locale] || []).map((f, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="text-amber mt-1 leading-none">›</span>
                              <span>{f}</span>
                            </li>
                          ))}
                        </ul>
                        {/* Mobile: show tech here since hidden in row */}
                        <div className="md:hidden flex flex-wrap gap-x-2 gap-y-1 mt-4">
                          {p.tech.map((tech) => (
                            <span
                              key={tech}
                              className="font-mono text-[10px] uppercase tracking-widest text-mute"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}

          {/* +others summary row */}
          <li className="py-5 px-3 font-mono text-xs uppercase tracking-widest text-mute">
            <span className="text-amber">+</span>{' '}
            {locale === 'id' ? 'dan banyak project lainnya' : 'and many more'}
          </li>

          {/* Coming-soon rows */}
          {projects.soon.map((p) => (
            <li
              key={p.id}
              className="grid grid-cols-12 gap-4 items-baseline py-5 px-3 opacity-60 hover:opacity-90 transition-opacity duration-200"
            >
              <span className="col-span-2 md:col-span-1 font-mono text-[10px] uppercase tracking-widest text-amber">
                {t('other.soon')}
              </span>
              <span className="col-span-7 md:col-span-6 font-display text-lg md:text-xl text-forest dark:text-cream leading-tight">
                {p.title[locale]}
              </span>
              <span className="hidden md:flex md:col-span-4 flex-wrap gap-x-2 gap-y-1">
                {p.tech.map((tech) => (
                  <span
                    key={tech}
                    className="font-mono text-[10px] uppercase tracking-widest text-mute"
                  >
                    {tech}
                  </span>
                ))}
              </span>
              <span className="col-span-3 md:col-span-1 flex justify-end text-mute font-mono text-sm">
                ⋯
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
