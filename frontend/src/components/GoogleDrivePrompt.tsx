// src/components/GoogleDrivePrompt.tsx
import { FaGoogle, FaTimes } from 'react-icons/fa';

interface GoogleDrivePromptProps {
  onConnect: () => void;
  onSkip: () => void;
}

const GoogleDrivePrompt = ({ onConnect, onSkip }: GoogleDrivePromptProps) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-8 relative">
        <button
          onClick={onSkip}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <FaTimes className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaGoogle className="text-3xl text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Connect Google Drive
          </h2>
          <p className="text-gray-600">
            Link your Google Drive to easily access and share your documents with MedeSense for personalized insights.
          </p>
        </div>

        <div className="space-y-3">
          <button
            onClick={onConnect}
            className="w-full py-3.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 shadow-md hover:shadow-lg transition-all flex items-center justify-center space-x-2"
          >
            <FaGoogle />
            <span>Connect Google Drive</span>
          </button>

          <button
            onClick={onSkip}
            className="w-full py-3.5 bg-white text-gray-700 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-all"
          >
            Skip for now
          </button>
        </div>

        <p className="text-xs text-gray-500 text-center mt-4">
          You can always connect Google Drive later from Settings
        </p>
      </div>
    </div>
  );
};

export default GoogleDrivePrompt;
