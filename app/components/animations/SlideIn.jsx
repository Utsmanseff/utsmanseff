'use client';
import { useEffect, useRef, useState } from 'react';

const SlideIn = ({ 
  children, 
  direction = 'left', 
  delay = 0, 
  duration = 0.8,
  distance = 60,
  threshold = 0.1,
  triggerOnce = true,
  className = '',
  easing = 'cubic-bezier(0.34, 1.56, 0.64, 1)', 
  stagger = false,
  staggerDelay = 0.1,
  perspective = false,
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
    if (isVisible) return 'translate3d(0, 0, 0) scale(1) rotateX(0deg) rotateY(0deg)';
    
    switch (direction) {
      case 'left':
        return `translate3d(-${distance}px, 0, 0) scale(0.9) ${perspective ? 'rotateY(-15deg)' : ''}`;
      case 'right':
        return `translate3d(${distance}px, 0, 0) scale(0.9) ${perspective ? 'rotateY(15deg)' : ''}`;
      case 'up':
        return `translate3d(0, -${distance}px, 0) scale(0.9) ${perspective ? 'rotateX(15deg)' : ''}`;
      case 'down':
        return `translate3d(0, ${distance}px, 0) scale(0.9) ${perspective ? 'rotateX(-15deg)' : ''}`;
      case 'left-up':
        return `translate3d(-${distance}px, -${distance}px, 0) scale(0.85) ${perspective ? 'rotateX(10deg) rotateY(-10deg)' : ''}`;
      case 'right-up':
        return `translate3d(${distance}px, -${distance}px, 0) scale(0.85) ${perspective ? 'rotateX(10deg) rotateY(10deg)' : ''}`;
      case 'left-down':
        return `translate3d(-${distance}px, ${distance}px, 0) scale(0.85) ${perspective ? 'rotateX(-10deg) rotateY(-10deg)' : ''}`;
      case 'right-down':
        return `translate3d(${distance}px, ${distance}px, 0) scale(0.85) ${perspective ? 'rotateX(-10deg) rotateY(10deg)' : ''}`;
      case 'zoom':
        return `translate3d(0, 0, 0) scale(0.5)`;
      case 'flip':
        return `translate3d(0, 0, 0) scale(0.8) rotateY(90deg)`;
      case 'bounce':
        return `translate3d(0, ${distance * 2}px, 0) scale(0.7)`;
      default:
        return `translate3d(-${distance}px, 0, 0) scale(0.9) ${perspective ? 'rotateY(-15deg)' : ''}`;
    }
  };

  const getFilter = () => {
    if (blur && !isVisible) {
      return 'blur(8px)';
    }
    return 'blur(0px)';
  };

  const baseClasses = direction === 'left' ? 'animate-slide-in-left' : 
                    direction === 'right' ? 'animate-slide-in-right' : 
                    'animate-fade-in-up';

  return (
    <div
      ref={elementRef}
      className={`${baseClasses} ${className}`}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: getTransform(),
        filter: getFilter(),
        transition: `all ${duration}s ${easing}`,
        transformStyle: perspective ? 'preserve-3d' : 'flat',
        perspective: perspective ? '1000px' : 'none',
        willChange: 'transform, opacity, filter'
      }}
    >
      {children}
    </div>
  );
};

export const StaggeredSlideIn = ({ 
  children, 
  staggerDelay = 0.1, 
  className = '',
  ...slideInProps 
}) => {
  return (
    <div className={className}>
      {Array.isArray(children) ? (
        children.map((child, index) => (
          <SlideIn
            key={index}
            delay={index * staggerDelay}
            {...slideInProps}
          >
            {child}
          </SlideIn>
        ))
      ) : (
        <SlideIn {...slideInProps}>
          {children}
        </SlideIn>
      )}
    </div>
  );
};

export const TextReveal = ({ 
  text, 
  className = '',
  duration = 0.6,
  staggerDelay = 0.1,
  direction = 'up'
}) => {
  const words = text.split(' ');
  
  return (
    <div className={className}>
      {words.map((word, index) => (
        <SlideIn
          key={index}
          direction={direction}
          delay={index * staggerDelay}
          duration={duration}
          className="inline-block mr-2"
        >
          <span>{word}</span>
        </SlideIn>
      ))}
    </div>
  );
};

export default SlideIn;