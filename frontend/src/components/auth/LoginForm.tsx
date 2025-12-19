// src/components/auth/LoginForm.tsx
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { loginUser } from '../../services/api';
import Input from '../ui/Input';
import Button from '../ui/Button';
import Alert from '../ui/Alert';
import { useNavigate } from 'react-router-dom';

interface LoginFormProps {
  onSwitchToSignUp: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSwitchToSignUp }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { loginUserContext } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    if (!username || !password) {
      setError("Username and password are required.");
      setIsLoading(false);
      return;
    }
    try {
      const data = await loginUser({ username, password });
      loginUserContext(data.user);
      navigate('/'); // Navigate to dashboard
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-2xl font-bold text-center text-textPrimary">Login to Your Account</h2>
      {error && <Alert type="error" message={error} onClose={() => setError(null)} />}
      <Input
        label="Username"
        name="username"
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
        placeholder="Enter your username"
      />
      <Input
        label="Password"
        name="password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        placeholder="Enter your password"
      />
      <Button type="submit" className="w-full" isLoading={isLoading}>
        Login
      </Button>
      <p className="text-sm text-center text-textSecondary">
        Don't have an account?{' '}
        <button type="button" onClick={onSwitchToSignUp} className="font-medium text-accent-DEFAULT hover:text-accent-hover">
          Sign up here
        </button>
      </p>
    </form>
  );
};

export default LoginForm;