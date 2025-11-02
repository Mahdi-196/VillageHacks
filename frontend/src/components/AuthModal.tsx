import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTimes } from 'react-icons/fa';
import TOSModal from './TOSModal';

interface AuthModalProps {
  mode: 'login' | 'signup';
  onClose: () => void;
  onSwitchMode: () => void;
}

const AuthModal = ({ mode, onClose, onSwitchMode }: AuthModalProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showTOS, setShowTOS] = useState(false);
  const navigate = useNavigate();

  const handleAcceptTOS = () => {
    setShowTOS(false);
    localStorage.setItem('aura_tos_accepted', 'true');
    navigate('/chat');
  };

  const handleDeclineTOS = () => {
    setShowTOS(false);
    localStorage.removeItem('aura_token');
    localStorage.removeItem('aura_user');
    setError('You must accept the Terms of Service to use MedeSense.');
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { authAPI } = await import('../services/api');

      const data = mode === 'login'
        ? await authAPI.login(email, password)
        : await authAPI.register(email, password, name);

      localStorage.setItem('aura_token', data.access_token);
      localStorage.setItem('aura_user', JSON.stringify(data.user));

      if (mode === 'signup') {
        setShowTOS(true);
      } else {
        const tosAccepted = localStorage.getItem('aura_tos_accepted');
        if (tosAccepted) {
          navigate('/chat');
        } else {
          setShowTOS(true);
        }
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Unable to connect to server. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (showTOS) {
    return (
      <TOSModal
        onAccept={handleAcceptTOS}
        onDecline={handleDeclineTOS}
      />
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-2 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <FaTimes className="w-4 h-4" />
        </button>

        <h2 className="text-2xl font-semibold text-slate-900 mb-2">
          {mode === 'login' ? 'Welcome Back' : 'Join MedeSense'}
        </h2>
        <p className="text-slate-600 text-sm mb-6">
          {mode === 'login'
            ? 'Continue your wellness journey'
            : 'Start your personalized wellness journey'}
        </p>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {mode === 'signup' && (
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm"
                placeholder="Enter your name"
                required
              />
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm"
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm"
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2.5 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Please wait...' : mode === 'login' ? 'Login' : 'Sign Up'}
          </button>
        </form>

        <div className="mt-5 text-center">
          <button
            type="button"
            onClick={onSwitchMode}
            className="text-blue-600 hover:text-blue-700 font-medium text-sm hover:underline"
          >
            {mode === 'login'
              ? "Don't have an account? Sign up"
              : 'Already have an account? Login'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
