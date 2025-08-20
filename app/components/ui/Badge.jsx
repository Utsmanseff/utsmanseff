'use client';
import { forwardRef } from 'react';

const Badge = forwardRef(({ 
  children, 
  variant = 'primary', 
  size = 'md',
  pulse = false,
  className = '',
  icon,
  ...props 
}, ref) => {
  const baseClasses = 'badge';
  
  const variants = {
    primary: 'badge-primary',
    secondary: 'badge-secondary', 
    success: 'badge-success',
    warning: 'badge-warning',
    tech: 'bg-gradient-to-r from-slate-700/60 to-slate-800/60 text-slate-200 border border-slate-600/30 hover:border-blue-400/50 hover:text-blue-300 hover:shadow-md hover:shadow-blue-500/20',
    skill: 'bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-blue-300 border border-blue-500/30 hover:border-blue-400 hover:text-blue-200 hover:bg-gradient-to-r hover:from-blue-600/30 hover:to-purple-600/30',
    experience: 'bg-gradient-to-r from-purple-600/20 to-pink-600/20 text-purple-300 border border-purple-500/30 hover:border-purple-400 hover:text-purple-200'
  };
  
  const sizes = {
    sm: 'px-2 py-1 text-xs rounded-md gap-1',
    md: 'px-3 py-1.5 text-sm rounded-lg gap-1.5', 
    lg: 'px-4 py-2 text-base rounded-lg gap-2'
  };
  
  const pulseAnimation = pulse ? 'animate-pulse-glow' : '';

  return (
    <span
      ref={ref}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${pulseAnimation} ${className} group`}
      {...props}
    >
      {/* Shimmer effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
      
      <span className="flex items-center gap-1.5 relative z-10">
        {icon && (
          <span className="flex-shrink-0 transition-transform duration-300 group-hover:scale-110">
            {icon}
          </span>
        )}
        {children}
      </span>
    </span>
  );
});

Badge.displayName = 'Badge';

export default Badge;