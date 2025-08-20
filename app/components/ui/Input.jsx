'use client';
import { forwardRef, useState } from 'react';
import { Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';

const Input = forwardRef(({ 
  label,
  type = 'text',
  placeholder = '',
  error = '',
  success = '',
  helper = '',
  required = false,
  disabled = false,
  icon,
  iconPosition = 'left',
  size = 'md',
  variant = 'default',
  className = '',
  showPasswordToggle = false,
  ...props 
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const inputType = type === 'password' && showPassword ? 'text' : type;

  const baseClasses = 'input';
  
  const variants = {
    default: 'form-input',
    filled: 'bg-slate-700 border border-transparent text-white placeholder-slate-400 focus:bg-slate-600 focus:ring-2 focus:ring-blue-500/20',
    outline: 'bg-transparent border-2 border-slate-600 text-white placeholder-slate-400 focus:border-blue-500',
    ghost: 'bg-transparent border border-transparent text-white placeholder-slate-400 hover:bg-slate-800/30 focus:bg-slate-800/50 focus:border-slate-600'
  };

  const sizes = {
    sm: 'px-3 py-2 text-sm rounded-md',
    md: 'px-4 py-3 text-base rounded-lg', 
    lg: 'px-6 py-4 text-lg rounded-xl'
  };

  const getStateClasses = () => {
    if (error) return 'border-red-500 focus:border-red-500 focus:ring-red-500/20';
    if (success) return 'border-green-500 focus:border-green-500 focus:ring-green-500/20';
    return '';
  };

  const getIconSize = () => {
    switch (size) {
      case 'sm': return 16;
      case 'lg': return 24;
      default: return 20;
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* Label */}
      {label && (
        <label className={`form-label ${
          error ? 'text-red-400' : success ? 'text-green-400' : 'text-slate-300'
        }`}>
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </label>
      )}

      {/* Input Container */}
      <div className="relative">
        {/* Left Icon */}
        {icon && iconPosition === 'left' && (
          <div className={`absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none transition-colors duration-300 ${
            error ? 'text-red-400' : success ? 'text-green-400' : isFocused ? 'text-blue-400' : 'text-slate-400'
          }`}>
            {icon}
          </div>
        )}

        {/* Input Field */}
        <input
          ref={ref}
          type={inputType}
          placeholder={placeholder}
          disabled={disabled}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`
            ${baseClasses}
            ${variants[variant]}
            ${sizes[size]}
            ${getStateClasses()}
            ${icon && iconPosition === 'left' ? 'pl-12' : ''}
            ${(icon && iconPosition === 'right') || showPasswordToggle || error || success ? 'pr-12' : ''}
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
            ${isFocused ? 'scale-[1.01] shadow-lg shadow-blue-500/10' : ''}
            transition-all duration-300
          `}
          {...props}
        />

        {/* Right Icons */}
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
          {/* Success Icon */}
          {success && (
            <CheckCircle size={getIconSize()} className="text-green-400 animate-pulse" />
          )}

          {/* Error Icon */}
          {error && (
            <AlertCircle size={getIconSize()} className="text-red-400 animate-pulse" />
          )}

          {/* Password Toggle */}
          {type === 'password' && showPasswordToggle && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-slate-400 hover:text-white transition-colors focus:outline-none focus:text-blue-400 hover:scale-110 transition-transform duration-200"
            >
              {showPassword ? (
                <EyeOff size={getIconSize()} />
              ) : (
                <Eye size={getIconSize()} />
              )}
            </button>
          )}

          {/* Right Icon */}
          {icon && iconPosition === 'right' && !error && !success && (
            <div className={`transition-colors duration-300 ${
              isFocused ? 'text-blue-400' : 'text-slate-400'
            }`}>
              {icon}
            </div>
          )}
        </div>

        {/* Focus Ring Effect */}
        {isFocused && !error && !success && (
          <div className="absolute inset-0 rounded-lg bg-blue-500/5 pointer-events-none animate-pulse" />
        )}
      </div>

      {/* Helper Text, Error, or Success Message */}
      {(helper || error || success) && (
        <div className="mt-2 flex items-start gap-2 animate-fade-in-up">
          {error && (
            <>
              <AlertCircle size={14} className="text-red-400 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-red-400">{error}</p>
            </>
          )}
          {success && !error && (
            <>
              <CheckCircle size={14} className="text-green-400 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-green-400">{success}</p>
            </>
          )}
          {helper && !error && !success && (
            <p className="text-sm text-slate-500">{helper}</p>
          )}
        </div>
      )}
    </div>
  );
});

Input.displayName = 'Input';

// Textarea Component
const Textarea = forwardRef(({ 
  label,
  placeholder = '',
  error = '',
  success = '',
  helper = '',
  required = false,
  disabled = false,
  size = 'md',
  variant = 'default',
  rows = 4,
  resize = true,
  className = '',
  ...props 
}, ref) => {
  const [isFocused, setIsFocused] = useState(false);

  const baseClasses = 'form-textarea';
  
  const variants = {
    default: 'form-input',
    filled: 'bg-slate-700 border border-transparent text-white placeholder-slate-400 focus:bg-slate-600 focus:ring-2 focus:ring-blue-500/20',
    outline: 'bg-transparent border-2 border-slate-600 text-white placeholder-slate-400 focus:border-blue-500',
    ghost: 'bg-transparent border border-transparent text-white placeholder-slate-400 hover:bg-slate-800/30 focus:bg-slate-800/50 focus:border-slate-600'
  };

  const sizes = {
    sm: 'px-3 py-2 text-sm rounded-md',
    md: 'px-4 py-3 text-base rounded-lg',
    lg: 'px-6 py-4 text-lg rounded-xl'
  };

  const getStateClasses = () => {
    if (error) return 'border-red-500 focus:border-red-500 focus:ring-red-500/20';
    if (success) return 'border-green-500 focus:border-green-500 focus:ring-green-500/20';
    return '';
  };

  return (
    <div className={`relative ${className}`}>
      {/* Label */}
      {label && (
        <label className={`form-label ${
          error ? 'text-red-400' : success ? 'text-green-400' : 'text-slate-300'
        }`}>
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </label>
      )}

      {/* Textarea Container */}
      <div className="relative">
        <textarea
          ref={ref}
          placeholder={placeholder}
          disabled={disabled}
          rows={rows}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`
            ${baseClasses}
            ${variants[variant]} 
            ${sizes[size]}
            ${getStateClasses()}
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
            ${isFocused ? 'scale-[1.01] shadow-lg shadow-blue-500/10' : ''}
            ${!resize ? 'resize-none' : 'resize-y'}
            transition-all duration-300
          `}
          {...props}
        />

        {/* Status Icons */}
        {(error || success) && (
          <div className="absolute top-3 right-3">
            {error && <AlertCircle size={16} className="text-red-400 animate-pulse" />}
            {success && !error && <CheckCircle size={16} className="text-green-400 animate-pulse" />}
          </div>
        )}

        {/* Focus Ring Effect */}
        {isFocused && !error && !success && (
          <div className="absolute inset-0 rounded-lg bg-blue-500/5 pointer-events-none animate-pulse" />
        )}
      </div>

      {/* Helper Text, Error, or Success Message */}
      {(helper || error || success) && (
        <div className="mt-2 flex items-start gap-2 animate-fade-in-up">
          {error && (
            <>
              <AlertCircle size={14} className="text-red-400 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-red-400">{error}</p>
            </>
          )}
          {success && !error && (
            <>
              <CheckCircle size={14} className="text-green-400 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-green-400">{success}</p>
            </>
          )}
          {helper && !error && !success && (
            <p className="text-sm text-slate-500">{helper}</p>
          )}
        </div>
      )}
    </div>
  );
});

Textarea.displayName = 'Textarea';

// Export both components
Input.Textarea = Textarea;

export default Input;