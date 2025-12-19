// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/layout/Navbar';
import ProtectedRoute from './components/layout/ProtectedRoute';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import NoteDetailPage from './pages/NoteDetailPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              {/* Public Routes */}
              <Route path="/auth" element={<AuthPage />} />
              
              {/* Protected Routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/" element={<DashboardPage />} />
                <Route path="/note/:noteId" element={<NoteDetailPage />} />
                {/* Add other protected routes here */}
              </Route>

              {/* Fallback for logged-in users trying to access /auth */}
              <Route path="/auth-redirect" element={<Navigate to="/" replace />} /> 
              {/* Not found page */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
          <footer className="bg-slate-800 text-slate-300 text-center p-4 text-sm">
            © {new Date().getFullYear()} NotesApp - Built with FastAPI & React
          </footer>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;