"use client";

import Link from 'next/link';
import AccessBadge from '@/components/work/AccessBadge';
import FadeIn from '@/components/ui/FadeIn';
import { CENTER_NODE } from '@/lib/data/canvas';

const CLUSTERS = [
  { key: 'nirwana', label: { id: 'RSU Nirwana', en: 'RSU Nirwana' } },
  { key: 'gov', label: { id: 'Pemerintahan', en: 'Public sector' } },
  { key: 'edu', label: { id: 'Pendidikan', en: 'Education' } },
];

function Card({ project, locale }) {
  const body = (
    <>
      <div className="font-mono text-[10px] uppercase tracking-wider text-mute">
        {project.client} · {project.year}
      </div>
      <h3 className="font-display text-xl mt-1 mb-2">{project.title[locale]}</h3>
      <p className="text-sm leading-relaxed text-ink/80 mb-3">{project.context[locale]}</p>
      <AccessBadge access={project.access} locale={locale} />
    </>
  );

  return (
    <FadeIn className="border border-rule rounded p-4 bg-paper">
      {project.tier === 'full' ? (
        <Link href={`/kerja/${project.slug}`} className="block">
          {body}
        </Link>
      ) : (
        body
      )}
    </FadeIn>
  );
}

export default function MobileList({ projects, locale }) {
  return (
    <main className="px-5 py-10 max-w-xl mx-auto">
      <h1 className="font-display text-3xl">{CENTER_NODE.name}</h1>
      <p className="text-sm leading-relaxed text-ink/80 mt-3 mb-10">
        {CENTER_NODE.blurb[locale]}
      </p>

      {CLUSTERS.map((c) => {
        const inCluster = projects.filter((p) => p.cluster === c.key);
        if (inCluster.length === 0) return null;
        return (
          <section key={c.key} className="mb-10">
            <h2 className="font-mono text-[11px] uppercase tracking-wider text-mute mb-4">
              {c.label[locale]}
            </h2>
            <div className="flex flex-col gap-4">
              {inCluster.map((p) => (
                <Card key={p.slug} project={p} locale={locale} />
              ))}
            </div>
          </section>
        );
      })}
    </main>
  );
}
