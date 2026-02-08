import React from 'react';
import { Loader2 } from 'lucide-react';

// --- Container ---
export const Container: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`max-w-md mx-auto min-h-screen p-6 flex flex-col ${className}`}>
    {children}
  </div>
);

// --- Typography ---
export const Title: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <h1 className={`text-3xl font-bold text-textMain tracking-tight ${className}`}>{children}</h1>
);

export const Subtitle: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <p className={`text-textSec text-sm font-medium ${className}`}>{children}</p>
);

// --- Buttons ---
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  isLoading, 
  className = '', 
  disabled,
  ...props 
}) => {
  const baseStyle = "w-full py-3.5 px-6 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 active:scale-[0.98]";
  
  const variants = {
    primary: "bg-accent text-white shadow-[0_4px_14px_0_rgba(46,204,113,0.39)] hover:bg-accentHover hover:shadow-[0_6px_20px_rgba(46,204,113,0.23)]",
    secondary: "bg-surfaceHighlight text-textMain hover:bg-[#2C3139]",
    outline: "border border-border text-textSec hover:text-textMain hover:border-textMain",
    ghost: "bg-transparent text-textSec hover:text-textMain"
  };

  return (
    <button 
      className={`${baseStyle} ${variants[variant]} ${disabled || isLoading ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? <Loader2 className="animate-spin h-5 w-5" /> : children}
    </button>
  );
};

// --- Card ---
export const Card: React.FC<{ children: React.ReactNode; className?: string; onClick?: () => void }> = ({ children, className = '', onClick }) => (
  <div 
    onClick={onClick}
    className={`bg-surface border border-border rounded-xl p-5 shadow-sm ${className}`}
  >
    {children}
  </div>
);

// --- Input ---
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Input: React.FC<InputProps> = ({ label, className = '', ...props }) => (
  <div className="w-full">
    {label && <label className="block text-xs font-semibold text-textSec uppercase tracking-wider mb-2">{label}</label>}
    <input 
      className={`w-full bg-surface border border-border rounded-lg px-4 py-3 text-textMain placeholder-textSec/50 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors ${className}`}
      {...props}
    />
  </div>
);