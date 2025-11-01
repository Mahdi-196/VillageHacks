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
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 px-6 py-4 md:px-12">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <FaUserMd className="text-3xl text-indigo-600" />
            <span className="text-2xl font-bold text-gray-900">MedeSense</span>
          </div>
          <button
            onClick={handleLogin}
            className="px-6 py-2 text-indigo-600 hover:bg-indigo-50 font-medium transition-colors rounded-lg"
          >
            Login
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-20 md:py-32">
        <div className="text-center mb-20">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Your Personal AI Wellbeing Companion
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
            Experience personalized wellness support through compassionate AI conversations.
            MedeSense is here to listen, understand, and guide you toward better wellbeing.
          </p>

          <button
            onClick={handleGetStarted}
            className="px-10 py-4 bg-indigo-600 text-white rounded-lg text-lg font-semibold hover:bg-indigo-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            Get Started
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <div className="bg-white p-8 rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
            <div className="w-14 h-14 bg-rose-100 rounded-lg flex items-center justify-center mb-4">
              <FaHeart className="text-3xl text-rose-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Compassionate Support</h3>
            <p className="text-gray-600 leading-relaxed">
              Always available to listen and provide caring guidance for your wellbeing journey.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
            <div className="w-14 h-14 bg-violet-100 rounded-lg flex items-center justify-center mb-4">
              <FaBrain className="text-3xl text-violet-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Infinite Memory</h3>
            <p className="text-gray-600 leading-relaxed">
              Powered by Supermemory, MedeSense remembers your journey, creating truly personalized support over time.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
            <div className="w-14 h-14 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
              <FaLock className="text-3xl text-emerald-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Private & Secure</h3>
            <p className="text-gray-600 leading-relaxed">
              Your conversations are confidential and protected with enterprise-grade security.
            </p>
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 text-center max-w-3xl mx-auto">
          <p className="text-amber-900">
            <strong className="font-semibold">Important:</strong> MedeSense is a wellness companion and does not provide medical advice,
            diagnoses, or prescriptions. In case of emergency, please contact emergency services or a healthcare professional.
          </p>
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
