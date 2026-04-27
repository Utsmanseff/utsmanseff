"use client";

import { useInView } from '@/lib/hooks/useInView';

// Soft, decelerating curve — feels like a slow exhale, not a snap.
const EASING = 'cubic-bezier(0.22, 1, 0.36, 1)';

export default function FadeIn({
  children,
  delay = 0,
  y = 6,
  duration = 1100,
  once = true,
  as: Tag = 'div',
  className = '',
  style,
  ...rest
}) {
  const { ref, inView } = useInView({ threshold: 0, rootMargin: '0px 0px -5% 0px', once });
  return (
    <Tag
      ref={ref}
      className={className}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : `translateY(${y}px)`,
        transition: `opacity ${duration}ms ${EASING} ${delay}ms, transform ${duration}ms ${EASING} ${delay}ms`,
        willChange: 'opacity, transform',
        ...style,
      }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
