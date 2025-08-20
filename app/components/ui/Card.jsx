'use client';
import { forwardRef } from 'react';

const Card = forwardRef(({ 
  children, 
  variant = 'default', 
  hover = true,
  glow = false,
  className = '',
  ...props 
}, ref) => {
  const baseClasses = 'card';
  
  const variants = {
    default: 'card',
    glass: 'glass backdrop-blur-md rounded-xl shadow-2xl',
    solid: 'bg-slate-800 border border-slate-700 rounded-xl shadow-xl',
    gradient: 'card-gradient',
    highlight: 'bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-blue-500/30 rounded-xl shadow-2xl',
    project: 'project-card',
    skill: 'skills-category',
    experience: 'experience-content-box',
    contact: 'contact-form'
  };
  
  const hoverEffects = hover ? 'hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-1' : '';
  const glowEffect = glow ? 'animate-pulse-glow' : '';

  return (
    <div
      ref={ref}
      className={`${baseClasses} ${variants[variant]} ${hoverEffects} ${glowEffect} ${className} group`}
      {...props}
    >
      {/* Animated border gradient for highlight variant */}
      {variant === 'highlight' && (
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-sm" />
      )}
      
      {/* Top border gradient for project cards */}
      {variant === 'project' && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-t-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      )}
      
      {/* Inner glow effect */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/5 to-transparent opacity-50 pointer-events-none" />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
});

Card.displayName = 'Card';

// Sub-components
const CardHeader = ({ children, className = '' }) => (
  <div className={`card-header ${className}`}>
    {children}
  </div>
);

const CardContent = ({ children, className = '' }) => (
  <div className={`p-6 pt-3 ${className}`}>
    {children}
  </div>
);

const CardFooter = ({ children, className = '' }) => (
  <div className={`p-6 pt-3 border-t border-slate-700/50 ${className}`}>
    {children}
  </div>
);

const CardTitle = ({ children, className = '' }) => (
  <h3 className={`card-title ${className}`}>
    {children}
  </h3>
);

const CardDescription = ({ children, className = '' }) => (
  <p className={`card-description ${className}`}>
    {children}
  </p>
);

Card.Header = CardHeader;
Card.Content = CardContent;
Card.Footer = CardFooter;
Card.Title = CardTitle;
Card.Description = CardDescription;

export default Card;