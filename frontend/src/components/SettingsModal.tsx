// src/components/SettingsModal.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTimes, FaUser, FaInfoCircle, FaShieldAlt, FaSignOutAlt, FaGoogle, FaCheck } from 'react-icons/fa';

interface SettingsModalProps {
  onClose: () => void;
}

const SettingsModal = ({ onClose }: SettingsModalProps) => {
  const navigate = useNavigate();
  const [googleDriveConnected, setGoogleDriveConnected] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('aura_user');
    localStorage.removeItem('aura_token');
    navigate('/');
  };

  const handleConnectGoogleDrive = async () => {
    try {
      const token = localStorage.getItem('aura_token');
      const response = await fetch('/api/integrations/google-drive/connect', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.authUrl) {
        window.open(data.authUrl, '_blank', 'width=600,height=700');
        setGoogleDriveConnected(true);
      }
    } catch (err) {
      console.error('Failed to connect Google Drive:', err);
    }
  };

  const user = JSON.parse(localStorage.getItem('aura_user') || '{}');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto relative">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-xl z-10">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FaTimes className="w-5 h-5" />
          </button>
          <h2 className="text-3xl font-bold text-gray-900">Settings</h2>
        </div>

        <div className="p-6 space-y-6">
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-100">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center">
                <FaUser className="text-white text-xl" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900">{user.name || 'User'}</h3>
                <p className="text-sm text-gray-600">{user.email || ''}</p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <FaGoogle className="text-blue-600 text-lg" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Integrations</h3>
            </div>
            <button
              onClick={handleConnectGoogleDrive}
              disabled={googleDriveConnected}
              className={`w-full py-3.5 rounded-lg font-semibold shadow-sm transition-all flex items-center justify-center space-x-2 ${
                googleDriveConnected
                  ? 'bg-green-50 text-green-700 border-2 border-green-300 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md'
              }`}
            >
              {googleDriveConnected ? (
                <>
                  <FaCheck className="text-lg" />
                  <span>Google Drive Connected</span>
                </>
              ) : (
                <>
                  <FaGoogle className="text-lg" />
                  <span>Connect Google Drive</span>
                </>
              )}
            </button>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <FaInfoCircle className="text-blue-600 text-lg" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">About MedeSense</h3>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed">
              MedeSense is your personal AI wellbeing companion designed to provide compassionate support
              for your wellness journey. Remember, MedeSense does not provide medical advice, diagnoses,
              or prescriptions.
            </p>
          </div>

          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center">
                <FaShieldAlt className="text-white text-lg" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Safety & Privacy</h3>
            </div>
            <div className="space-y-2.5 text-sm text-gray-700">
              <div className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full mt-2 flex-shrink-0"></div>
                <span>Your conversations are private and secure</span>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full mt-2 flex-shrink-0"></div>
                <span>MedeSense cannot provide emergency support</span>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full mt-2 flex-shrink-0"></div>
                <span>For crisis situations, contact 911 or 988</span>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full mt-2 flex-shrink-0"></div>
                <span>Always consult healthcare professionals for medical concerns</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full py-4 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 shadow-md hover:shadow-lg transition-all flex items-center justify-center space-x-2.5"
          >
            <FaSignOutAlt className="text-lg" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
