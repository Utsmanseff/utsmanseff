'use client';
import { useState, useEffect, useRef } from 'react';

const AnimatedCounter = ({
  end = 0,
  start = 0,
  duration = 2000,
  suffix = '',
  prefix = '',
  separator = '',
  decimals = 0,
  className = '',
  trigger = true,
  ease = 'easeOut',
  gradient = false,
  glow = false
}) => {
  const [count, setCount] = useState(start);
  const elementRef = useRef(null);
  const frameRef = useRef();

  const easingFunctions = {
    linear: t => t,
    easeIn: t => t * t,
    easeOut: t => 1 - Math.pow(1 - t, 3),
    easeInOut: t => t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
    bounce: t => {
      const n1 = 7.5625;
      const d1 = 2.75;
      if (t < 1 / d1) return n1 * t * t;
      else if (t < 2 / d1) return n1 * (t -= 1.5 / d1) * t + 0.75;
      else if (t < 2.5 / d1) return n1 * (t -= 2.25 / d1) * t + 0.9375;
      else return n1 * (t -= 2.625 / d1) * t + 0.984375;
    }
  };

  useEffect(() => {
    const targetEnd = Number(end) || 0;
    
    let isMounted = true;
    let observer;

    const startAnimation = () => {
      const startTime = Date.now();
      const range = targetEnd - start;

      const animate = () => {
        if (!isMounted) return;

        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = easingFunctions[ease] ? easingFunctions[ease](progress) : easingFunctions.easeOut(progress);
        const current = start + (range * easedProgress);

        setCount(current);

        if (progress < 1) {
          frameRef.current = requestAnimationFrame(animate);
        } else {
          setCount(targetEnd);
        }
      };
      
      frameRef.current = requestAnimationFrame(animate);
    };

    if (trigger) {
      observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            startAnimation();
            observer.disconnect();
          }
        },
        { threshold: 0.1 }
      );

      if (elementRef.current) {
        observer.observe(elementRef.current);
      }
    } else {
      startAnimation();
    }
    
    return () => {
      isMounted = false;
      if (observer) {
        observer.disconnect();
      }
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [end, start, duration, ease, trigger]);

  const formatNumber = (num) => {
    const validNum = Number(num) || 0;
    const fixed = validNum.toFixed(decimals);
    if (separator === ',') {
      return fixed.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
    return fixed;
  };

  const baseClasses = 'inline-block tabular-nums font-bold transition-all duration-300';
  const gradientClasses = gradient ? 'text-gradient bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent' : '';
  const glowClasses = glow ? 'animate-pulse-glow' : '';

  return (
    <span 
      ref={elementRef} 
      className={`${baseClasses} ${gradientClasses} ${glowClasses} ${className}`}
    >
      {prefix}
      <span className="relative inline-block">
        {formatNumber(count)}
      </span>
      {suffix}
    </span>
  );
};

export default AnimatedCounter;