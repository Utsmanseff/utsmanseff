'use client';
import { useEffect, useRef, useState } from 'react';

const FadeIn = ({ 
  children, 
  direction = 'up', 
  delay = 0, 
  duration = 0.6,
  distance = 30,
  threshold = 0.1,
  triggerOnce = true,
  className = '',
  easing = 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  scale = false,
  blur = false
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);
  const elementRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && (!triggerOnce || !hasTriggered)) {
          setTimeout(() => {
            setIsVisible(true);
            if (triggerOnce) setHasTriggered(true);
          }, delay * 1000);
        } else if (!triggerOnce && !entry.isIntersecting) {
          setIsVisible(false);
        }
      },
      { threshold }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [delay, threshold, triggerOnce, hasTriggered]);

  const getTransform = () => {
    if (isVisible) {
      return `translate3d(0, 0, 0) ${scale ? 'scale(1)' : ''}`;
    }
    
    let transform = '';
    
    switch (direction) {
      case 'up':
        transform = `translate3d(0, ${distance}px, 0)`;
        break;
      case 'down':
        transform = `translate3d(0, -${distance}px, 0)`;
        break;
      case 'left':
        transform = `translate3d(${distance}px, 0, 0)`;
        break;
      case 'right':
        transform = `translate3d(-${distance}px, 0, 0)`;
        break;
      case 'up-left':
        transform = `translate3d(${distance}px, ${distance}px, 0)`;
        break;
      case 'up-right':
        transform = `translate3d(-${distance}px, ${distance}px, 0)`;
        break;
      case 'down-left':
        transform = `translate3d(${distance}px, -${distance}px, 0)`;
        break;
      case 'down-right':
        transform = `translate3d(-${distance}px, -${distance}px, 0)`;
        break;
      default:
        transform = `translate3d(0, ${distance}px, 0)`;
    }
    
    if (scale) {
      transform += ' scale(0.9)';
    }
    
    return transform;
  };

  const getFilter = () => {
    if (blur && !isVisible) {
      return 'blur(4px)';
    }
    return 'blur(0px)';
  };

  return (
    <div
      ref={elementRef}
      className={`animate-fade-in-up ${className}`}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: getTransform(),
        filter: getFilter(),
        transition: `all ${duration}s ${easing}`,
        willChange: 'transform, opacity, filter'
      }}
    >
      {children}
    </div>
  );
};

export const StaggeredFadeIn = ({ 
  children, 
  staggerDelay = 0.1, 
  className = '',
  ...fadeInProps 
}) => {
  return (
    <div className={className}>
      {Array.isArray(children) ? (
        children.map((child, index) => (
          <FadeIn
            key={index}
            delay={index * staggerDelay}
            {...fadeInProps}
          >
            {child}
          </FadeIn>
        ))
      ) : (
        <FadeIn {...fadeInProps}>
          {children}
        </FadeIn>
      )}
    </div>
  );
};

export default FadeIn;