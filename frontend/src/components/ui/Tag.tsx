// src/components/ui/Tag.tsx
import React from 'react';

interface TagProps {
  children: React.ReactNode;
  color?: string; // e.g., 'bg-blue-100 text-blue-800'
  onRemove?: () => void;
  className?: string;
}

const Tag: React.FC<TagProps> = ({ children, color, onRemove, className }) => {
  const defaultColor = "bg-primary-light bg-opacity-20 text-primary-dark";
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color || defaultColor} ${className}`}
    >
      {children}
      {onRemove && (
        <button
          type="button"
          className="flex-shrink-0 ml-1.5 -mr-0.5 p-0.5 rounded-full inline-flex items-center justify-center text-primary-dark hover:bg-primary-light hover:bg-opacity-40 focus:outline-none focus:bg-primary-light focus:text-primary-dark"
          onClick={onRemove}
        >
          <span className="sr-only">Remove tag</span>
          <svg className="h-2 w-2" stroke="currentColor" fill="none" viewBox="0 0 8 8">
            <path strokeLinecap="round" strokeWidth="1.5" d="M1 1l6 6m0-6L1 7" />
          </svg>
        </button>
      )}
    </span>
  );
};

export default Tag;