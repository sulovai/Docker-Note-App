// src/components/ui/Input.tsx
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input: React.FC<InputProps> = ({ label, name, error, className, ...props }) => {
  return (
    <div className="w-full">
      {label && <label htmlFor={name} className="block text-sm font-medium text-textSecondary mb-1">{label}</label>}
      <input
        id={name}
        name={name}
        className={`block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 
                    focus:outline-none focus:ring-primary-DEFAULT focus:border-primary-DEFAULT sm:text-sm
                    disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none
                    ${error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''} ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
};

export default Input;

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const TextArea: React.FC<TextAreaProps> = ({ label, name, error, className, ...props }) => {
  return (
    <div className="w-full">
      {label && <label htmlFor={name} className="block text-sm font-medium text-textSecondary mb-1">{label}</label>}
      <textarea
        id={name}
        name={name}
        className={`block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 
                    focus:outline-none focus:ring-primary-DEFAULT focus:border-primary-DEFAULT sm:text-sm
                    ${error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''} ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
};