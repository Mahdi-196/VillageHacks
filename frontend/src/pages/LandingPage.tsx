// src/pages/LandingPage.tsx
import { useState } from 'react';
import { FaHeart, FaLock, FaBrain, FaUserMd } from 'react-icons/fa';
import AuthModal from '../components/AuthModal';

const LandingPage = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');

  const handleGetStarted = () => {
    setAuthMode('signup');
    setShowAuthModal(true);
  };

  const handleLogin = () => {
    setAuthMode('login');
    setShowAuthModal(true);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white border-b border-slate-200 px-6 py-4 md:px-12">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <FaUserMd className="text-2xl text-blue-600" />
            <span className="text-xl font-semibold text-slate-900">MedeSense</span>
          </div>
          <button
            onClick={handleLogin}
            className="px-5 py-2 text-blue-600 hover:bg-blue-50 font-medium transition-colors rounded-lg"
          >
            Login
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-16 md:py-24">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Your Personal AI Wellbeing Companion
          </h1>
          <p className="text-lg text-slate-600 mb-10 max-w-2xl mx-auto">
            Experience personalized wellness support through compassionate AI conversations.
            MedeSense is here to listen, understand, and guide you toward better wellbeing.
          </p>

          <button
            onClick={handleGetStarted}
            className="px-8 py-3 bg-blue-600 text-white rounded-lg text-base font-medium hover:bg-blue-700 transition-colors"
          >
            Get Started
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg border border-slate-200">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <FaLock className="text-2xl text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Secure Document Upload</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Upload medical records safely with HIPAA-compliant encryption. Documents are processed securely and never stored on disk without proper compliance measures.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg border border-slate-200">
            <div className="w-12 h-12 bg-violet-100 rounded-lg flex items-center justify-center mb-4">
              <FaBrain className="text-2xl text-violet-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Intelligent Memory</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Powered by Supermemory, MedeSense remembers your journey, creating truly personalized support over time.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg border border-slate-200">
            <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
              <FaHeart className="text-2xl text-emerald-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Compassionate Support</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Always available to listen and provide caring guidance for your wellbeing journey.
            </p>
          </div>
        </div>
      </div>

      {showAuthModal && (
        <AuthModal
          mode={authMode}
          onClose={() => setShowAuthModal(false)}
          onSwitchMode={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}
        />
      )}
    </div>
  );
};

export default LandingPage;
