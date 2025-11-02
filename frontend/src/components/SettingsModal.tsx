// src/components/SettingsModal.tsx
import { useNavigate } from 'react-router-dom';
import { FaTimes, FaUser, FaInfoCircle, FaShieldAlt, FaSignOutAlt } from 'react-icons/fa';

interface SettingsModalProps {
  onClose: () => void;
}

const SettingsModal = ({ onClose }: SettingsModalProps) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('aura_user');
    localStorage.removeItem('aura_token');
    navigate('/');
  };

  const user = JSON.parse(localStorage.getItem('aura_user') || '{}');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto relative">
        <div className="sticky top-0 bg-white border-b border-slate-200 p-5 rounded-t-lg z-10">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <FaTimes className="w-4 h-4" />
          </button>
          <h2 className="text-2xl font-semibold text-slate-900">Settings</h2>
        </div>

        <div className="p-5 space-y-4">
          <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <FaUser className="text-white text-base" />
              </div>
              <div className="flex-1">
                <h3 className="text-base font-semibold text-slate-900">{user.name || 'User'}</h3>
                <p className="text-sm text-slate-600">{user.email || ''}</p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg p-4">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-9 h-9 bg-blue-100 rounded-lg flex items-center justify-center">
                <FaInfoCircle className="text-blue-600 text-base" />
              </div>
              <h3 className="text-base font-semibold text-slate-900">About MedeSense</h3>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed">
              MedeSense is your personal AI wellbeing companion designed to provide compassionate support
              for your wellness journey. Remember, MedeSense does not provide medical advice, diagnoses,
              or prescriptions.
            </p>
          </div>

          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-9 h-9 bg-emerald-600 rounded-lg flex items-center justify-center">
                <FaShieldAlt className="text-white text-base" />
              </div>
              <h3 className="text-base font-semibold text-slate-900">Safety & Privacy</h3>
            </div>
            <div className="space-y-2 text-sm text-slate-700">
              <div className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full mt-1.5 flex-shrink-0"></div>
                <span>Your conversations are private and secure</span>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full mt-1.5 flex-shrink-0"></div>
                <span>MedeSense cannot provide emergency support</span>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full mt-1.5 flex-shrink-0"></div>
                <span>For crisis situations, contact 911 or 988</span>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full mt-1.5 flex-shrink-0"></div>
                <span>Always consult healthcare professionals for medical concerns</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="w-full py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center justify-center space-x-2"
          >
            <FaSignOutAlt className="text-base" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
