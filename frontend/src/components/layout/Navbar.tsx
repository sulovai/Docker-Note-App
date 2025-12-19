// src/components/layout/Navbar.tsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../ui/Button';
import { LogOut, NotebookText, UserCircle } from 'lucide-react';

const Navbar: React.FC = () => {
  const { isAuthenticated, user, logoutUserContext } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUserContext();
    navigate('/auth');
  };

  return (
    <nav className="bg-bgCard shadow-md sticky top-0 z-40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to={isAuthenticated ? "/" : "/auth"} className="flex-shrink-0 flex items-center text-primary-DEFAULT hover:text-primary-dark transition-colors">
              <NotebookText size={32} className="mr-2"/>
              <span className="font-bold text-2xl text-textPrimary">NotesApp</span>
            </Link>
          </div>
          <div className="flex items-center">
            {isAuthenticated && user ? (
              <>
                <span className="text-textSecondary mr-4 hidden sm:block">
                  Welcome, <span className="font-medium text-textPrimary">{user.username}</span>
                </span>
                 <Button onClick={handleLogout} variant="ghost" size="sm" className="text-textSecondary hover:text-red-500">
                  <LogOut size={18} className="mr-1" /> Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/auth" state={{ form: 'login' }}>
                  <Button variant="ghost" className="mr-2 text-textPrimary">Login</Button>
                </Link>
                <Link to="/auth" state={{ form: 'signup' }}>
                  <Button variant="primary">Sign Up</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;