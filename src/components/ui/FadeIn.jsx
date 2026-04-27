"use client";

import { useInView } from '@/lib/hooks/useInView';

const EASING = 'cubic-bezier(0.16, 1, 0.3, 1)';

export default function FadeIn({
  children,
  delay = 0,
  y = 18,
  duration = 700,
  once = true,
  as: Tag = 'div',
  className = '',
  style,
  ...rest
}) {
  const { ref, inView } = useInView({ threshold: 0.12, rootMargin: '0px 0px -8% 0px', once });
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
