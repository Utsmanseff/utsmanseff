"use client";

import { useInView } from '@/lib/hooks/useInView';

export default function FadeIn({ children, delay = 0, y = 24, duration = 700, className = '' }) {
  const { ref, inView } = useInView();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : `translateY(${y}px)`,
        transition: `opacity ${duration}ms ease-out ${delay}ms, transform ${duration}ms ease-out ${delay}ms`,
        willChange: inView ? 'auto' : 'opacity, transform',
      }}
    >
      {children}
    </div>
  );
}
