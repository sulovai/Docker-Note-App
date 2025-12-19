// src/components/ui/Modal.tsx
import React from 'react';
import type { ReactNode } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, size = 'md' }) => {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
  };

  return (
    // THE OVERLAY
    <div className="fixed inset-0 bg-white bg-opacity-50 backdrop-blur-sm flex justify-center items-center p-4 z-50">
      {/* THE MODAL CONTENT BOX */}
      <div className={`bg-bgCard rounded-lg shadow-xl w-full ${sizeClasses[size]} p-6 relative transform transition-all`}>
        <div className="flex justify-between items-center mb-4">
          {/* MODAL TITLE */}
          <h3 className="text-xl font-semibold text-textPrimary">{title}</h3>
          <button
            onClick={onClose}
            className="text-textSecondary hover:text-textPrimary p-1 rounded-full hover:bg-slate-200"
            aria-label="Close modal"
          >
            <X size={24} />
          </button>
        </div>
        {/* MODAL BODY (CHILDREN) */}
        <div>{children}</div>
      </div>
    </div>
  );
};

export default Modal;