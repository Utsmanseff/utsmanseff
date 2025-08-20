'use client';
import { useState, useEffect, useCallback } from 'react';

const useActiveSection = (sections = [], options = {}) => {
  const {
    offset = -100,
    threshold = 0.3,
    rootMargin = '0px 0px -50px 0px'
  } = options;

  const [activeSection, setActiveSection] = useState(sections[0] || '');
  const [scrollProgress, setScrollProgress] = useState(0);
  const [scrollDirection, setScrollDirection] = useState('down');
  const [lastScrollY, setLastScrollY] = useState(0);

  const scrollToSection = useCallback((sectionId, customOffset = null) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const navHeight = 80; 
      const elementPosition = element.offsetTop - (customOffset || navHeight);
      
      const startPosition = window.scrollY;
      const distance = elementPosition - startPosition;
      const duration = Math.min(Math.abs(distance) / 2, 1000);
      let startTime = null;

      const easeInOutCubic = (t) => {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      };

      const animation = (currentTime) => {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / duration, 1);
        const ease = easeInOutCubic(progress);
        
        window.scrollTo(0, startPosition + distance * ease);
        
        if (progress < 1) {
          requestAnimationFrame(animation);
        }
      };

      requestAnimationFrame(animation);
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrollDirection(currentScrollY > lastScrollY ? 'down' : 'up');
      setLastScrollY(currentScrollY);
    };

    const throttledScrollHandler = throttle(handleScroll, 16); 
    window.addEventListener('scroll', throttledScrollHandler, { passive: true });
    
    return () => window.removeEventListener('scroll', throttledScrollHandler);
  }, [lastScrollY]);

  useEffect(() => {
    const handleScrollProgress = () => {
      const totalScroll = document.documentElement.scrollTop;
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scroll = totalScroll / windowHeight;
      setScrollProgress(Math.min(Math.max(scroll, 0), 1));
    };

    const throttledProgressHandler = throttle(handleScrollProgress, 16);
    window.addEventListener('scroll', throttledProgressHandler, { passive: true });
    
    return () => window.removeEventListener('scroll', throttledProgressHandler);
  }, []);

  useEffect(() => {
    const observerOptions = {
      threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
      rootMargin
    };

    const sectionObserver = new IntersectionObserver((entries) => {
      let mostVisibleSection = null;
      let maxVisibility = 0;

      entries.forEach(entry => {
        const sectionId = entry.target.id;
        const visibility = entry.intersectionRatio;
        
        if (visibility > maxVisibility && visibility >= threshold) {
          maxVisibility = visibility;
          mostVisibleSection = sectionId;
        }
      });

      if (!mostVisibleSection) {
        const scrollY = window.scrollY;
        const windowHeight = window.innerHeight;
        
        sections.forEach(sectionId => {
          const element = document.getElementById(sectionId);
          if (element) {
            const rect = element.getBoundingClientRect();
            const sectionTop = rect.top + scrollY;
            const sectionBottom = sectionTop + rect.height;
            
            const viewportMiddle = scrollY + windowHeight / 2;
            if (viewportMiddle >= sectionTop && viewportMiddle <= sectionBottom) {
              mostVisibleSection = sectionId;
            }
          }
        });
      }

      if (mostVisibleSection && mostVisibleSection !== activeSection) {
        setActiveSection(mostVisibleSection);
      }
    }, observerOptions);

    sections.forEach(sectionId => {
      const element = document.getElementById(sectionId);
      if (element) {
        sectionObserver.observe(element);
      }
    });

    return () => sectionObserver.disconnect();
  }, [sections, threshold, rootMargin, activeSection]);

  const throttle = (func, delay) => {
    let timeoutId;
    let lastExecTime = 0;
    
    return function (...args) {
      const currentTime = Date.now();
      
      if (currentTime - lastExecTime > delay) {
        func.apply(this, args);
        lastExecTime = currentTime;
      } else {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          func.apply(this, args);
          lastExecTime = Date.now();
        }, delay - (currentTime - lastExecTime));
      }
    };
  };

  return {
    activeSection,
    scrollToSection,
    scrollProgress,
    scrollDirection,
    isScrollingDown: scrollDirection === 'down',
    isScrollingUp: scrollDirection === 'up'
  };
};

export default useActiveSection;