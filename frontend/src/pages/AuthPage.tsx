// src/pages/AuthPage.tsx
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import LoginForm from '../components/auth/LoginForm';
import SignUpForm from '../components/auth/SignupForm';
import { useAuth } from '../contexts/AuthContext';
import { NotebookText } from 'lucide-react';
import { Link } from 'react-router-dom';

const AuthPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  // Determine initial form based on location state or default to login
  const initialForm = (location.state as { form?: 'login' | 'signup' })?.form || 'login';
  const [showLogin, setShowLogin] = useState(initialForm === 'login');

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      navigate('/'); // Redirect to dashboard if already authenticated
    }
  }, [isAuthenticated, authLoading, navigate]);

  useEffect(() => {
    // Update form display if location state changes (e.g., from Navbar links)
    const currentForm = (location.state as { form?: 'login' | 'signup' })?.form;
    if (currentForm === 'signup') setShowLogin(false);
    else setShowLogin(true);
  }, [location.state]);


  const handleSignUpSuccess = () => {
    // After successful sign-up, switch to the login form
    setShowLogin(true);
    // Optionally, clear location state if it was used to set the form
    navigate('/auth', { replace: true, state: { form: 'login' } });
  };

  if (authLoading) {
      return <div className="min-h-screen flex items-center justify-center"><p>Loading...</p></div>;
  }
  if (isAuthenticated) return null; // Already handled by redirect

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-100 px-4 py-12">
       <div className="mb-8 text-center">
         <Link to="/" className="flex-shrink-0 flex items-center justify-center text-primary-DEFAULT hover:text-primary-dark transition-colors">
            <NotebookText size={48} className="mr-3"/>
            <span className="font-bold text-4xl text-textPrimary">NotesApp</span>
         </Link>
         <p className="mt-2 text-textSecondary">Your digital notebook, always with you.</p>
      </div>
      <div className="w-full max-w-md bg-bgCard p-8 rounded-xl shadow-2xl">
        {showLogin ? (
          <LoginForm onSwitchToSignUp={() => setShowLogin(false)} />
        ) : (
          <SignUpForm onSwitchToLogin={() => setShowLogin(true)} onSignUpSuccess={handleSignUpSuccess} />
        )}
      </div>
      <footer className="mt-12 text-center text-sm text-slate-500">
        © {new Date().getFullYear()} NotesApp. All rights reserved.
      </footer>
    </div>
  );
};

export default AuthPage;