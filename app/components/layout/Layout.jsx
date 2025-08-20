'use client';
import { useState, useEffect } from 'react';
import Navigation from './Navigation';
import Footer from './Footer';

const Layout = ({ children }) => {
  const [activeSection, setActiveSection] = useState('home');
  const [isLoading, setIsLoading] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'about', 'skills', 'projects', 'experience', 'contact'];
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;

      const totalHeight = document.documentElement.scrollHeight - windowHeight;
      const progress = Math.min(100, (scrollY / totalHeight) * 100);
      setScrollProgress(progress);

      sections.forEach(section => {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          const sectionStart = offsetTop - windowHeight / 3;
          const sectionEnd = offsetTop + offsetHeight - windowHeight / 3;
          
          if (scrollY >= sectionStart && scrollY < sectionEnd) {
            setActiveSection(section);
          }
        }
      });
    };

    let ticking = false;
    const throttledScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', throttledScroll, { passive: true });
    
    handleScroll();

    return () => window.removeEventListener('scroll', throttledScroll);
  }, []);

  const handleNavigate = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-slate-900 flex items-center justify-center z-50">
        <div className="text-center">
          {/* Logo */}
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 animate-pulse">
            <span className="text-white font-bold text-2xl">U</span>
          </div>
          
          {/* Loading Animation */}
          <div className="flex items-center gap-1 mb-4 justify-center">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
          
          <p className="text-slate-400 text-sm">Loading portfolio...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 relative">
      {/* Navigation */}
      <Navigation 
        activeSection={activeSection} 
        onNavigate={handleNavigate}
      />

      {/* Main Content */}
      <main className="relative">
        {children}
      </main>

      {/* Footer */}
      <Footer />

      {/* Scroll Progress Indicator */}
      <div className="fixed top-0 left-0 right-0 z-40 pointer-events-none">
        <div 
          className="h-1 bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>
    </div>
  );
};

export default Layout;