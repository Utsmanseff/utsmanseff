"use client";

import { useRouter } from 'next/navigation';
import { projects } from '@/lib/data/projects';
import { useLocale } from '@/lib/hooks/useLocale';
import { useShellEligible } from '@/lib/hooks/useShellEligible';
import { useMediaQuery } from '@/lib/hooks/useMediaQuery';
import PaperFallback from '@/components/document/PaperFallback';
import Gate from '@/components/shell/Gate';

// The gate is the whole of `/` now. It hands back the address of the door that
// was taken, and the back button brings the visitor here again — which is the
// thing sessionStorage could never do.
export default function Home() {
  const { locale } = useLocale();
  const shell = useShellEligible();
  const calm = useMediaQuery('(prefers-reduced-motion: reduce)');
  const router = useRouter();

  if (!shell) return <PaperFallback />;

  // The gate places itself absolutely; on its own page it needs something the
  // size of the viewport to be absolute inside of.
  return (
    <div className="relative h-[100dvh] overflow-hidden bg-ground">
      <Gate
        systems={projects}
        locale={locale}
        calm={calm}
        onEnter={(href) => router.push(href)}
      />
    </div>
  );
}
