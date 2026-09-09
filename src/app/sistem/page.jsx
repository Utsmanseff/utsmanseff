"use client";

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { projects } from '@/lib/data/projects';
import { useLocale } from '@/lib/hooks/useLocale';
import { useShellEligible } from '@/lib/hooks/useShellEligible';
import { useMediaQuery } from '@/lib/hooks/useMediaQuery';
import PaperFallback from '@/components/document/PaperFallback';
import Shell from '@/components/shell/Shell';

function SistemInner() {
  const { locale } = useLocale();
  const shell = useShellEligible();
  const calm = useMediaQuery('(prefers-reduced-motion: reduce)');
  const router = useRouter();
  const params = useSearchParams();

  const view = params.get('tampilan') === 'datar' ? 'list' : 'map';
  const [seed] = useState(() => params.get('ketik') ?? '');

  // Titik pulang yang ditulis pintu waktu halaman baca dibuka. Dibaca sekali
  // saat mount; sesudah itu pilihan dan view adalah state lokal, seperti biasa —
  // URL mengikuti, bukan memimpin.
  //
  // Keberadaan parameternya diperiksa terpisah dari nilainya: Number('') itu 0,
  // jadi `?sudut=` kosong akan membuka peta lurus menghadap depan.
  const picked = params.get('pilih');
  const rawAngle = params.get('sudut');
  const parsedAngle = Number(rawAngle);
  const angle = rawAngle !== null && rawAngle !== '' && Number.isFinite(parsedAngle)
    ? parsedAngle
    : null;

  // The carried letter is spent the moment it is read. Left in the URL it would
  // be typed again on every reload, and it would travel in a shared link.
  useEffect(() => {
    if (!params.get('ketik')) return;
    const next = new URLSearchParams(params);
    next.delete('ketik');
    const query = next.toString();
    router.replace(query ? `/sistem?${query}` : '/sistem', { scroll: false });
  }, [params, router]);

  if (!shell) return <PaperFallback />;

  return (
    <Shell
      systems={projects}
      locale={locale}
      view={view}
      calm={calm}
      seed={seed}
      picked={picked}
      angle={angle}
    />
  );
}

// useSearchParams reads something only the browser knows. Without this boundary
// the whole route is forced to render dynamically on every request.
export default function Sistem() {
  return (
    <Suspense fallback={null}>
      <SistemInner />
    </Suspense>
  );
}
