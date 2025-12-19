// src/pages/NotFoundPage.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import { AlertTriangle } from 'lucide-react';

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 bg-slate-50">
      <AlertTriangle size={64} className="text-yellow-500 mb-6" />
      <h1 className="text-6xl font-bold text-textPrimary mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-textSecondary mb-6">Oops! Page Not Found.</h2>
      <p className="text-slate-600 mb-8 max-w-md">
        The page you are looking for might have been removed, had its name changed,
        or is temporarily unavailable.
      </p>
      <Link to="/">
        <Button variant="primary" size="lg">
          Go to Homepage
        </Button>
      </Link>
    </div>
  );
};

export default NotFoundPage;