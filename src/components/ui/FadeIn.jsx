"use client";

import { useInView } from '@/lib/hooks/useInView';

// Apple-ish out-quint easing for natural motion
const EASING = 'cubic-bezier(0.16, 1, 0.3, 1)';

export default function FadeIn({
  children,
  delay = 0,
  y = 24,
  duration = 800,
  className = '',
}) {
  const { ref, inView } = useInView();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : `translateY(${y}px)`,
        transition: `opacity ${duration}ms ${EASING} ${delay}ms, transform ${duration}ms ${EASING} ${delay}ms`,
        willChange: 'opacity, transform',
      }}
    >
      {children}
    </div>
  );
}
