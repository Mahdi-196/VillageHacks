// src/components/TOSModal.tsx
import { FaFileContract, FaTimes } from 'react-icons/fa';

interface TOSModalProps {
  onAccept: () => void;
  onDecline: () => void;
}

const TOSModal = ({ onAccept, onDecline }: TOSModalProps) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col relative">
        <div className="p-6 border-b border-slate-200">
          <button
            type="button"
            onClick={onDecline}
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <FaTimes className="w-4 h-4" />
          </button>

          <div className="flex items-center space-x-3 mb-2">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <FaFileContract className="text-xl text-blue-600" />
            </div>
            <h2 className="text-2xl font-semibold text-slate-900">Terms of Service</h2>
          </div>
          <p className="text-slate-600 text-sm ml-13">Please review and accept our terms to continue</p>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-5 text-slate-700 text-sm leading-relaxed">
          <section>
            <h3 className="text-base font-semibold text-slate-900 mb-2">1. Acceptance of Terms</h3>
            <p>
              By accessing and using MedeSense, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our service.
            </p>
          </section>

          <section>
            <h3 className="text-base font-semibold text-slate-900 mb-2">2. Nature of Service</h3>
            <p className="mb-2">
              MedeSense is a wellness companion application designed to provide general wellbeing support through AI-powered conversations. You acknowledge and agree that:
            </p>
            <ul className="space-y-1.5 ml-4">
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span>MedeSense does NOT provide medical advice, diagnoses, or treatment recommendations</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span>MedeSense is NOT a substitute for professional medical care or emergency services</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span>You should always consult qualified healthcare professionals for medical concerns</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span>In case of emergency, contact 911 or your local emergency services immediately</span>
              </li>
            </ul>
          </section>

          <section>
            <h3 className="text-base font-semibold text-slate-900 mb-2">3. Privacy & Data</h3>
            <p className="mb-2">
              Your privacy is important to us. By using MedeSense:
            </p>
            <ul className="space-y-1.5 ml-4">
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span>Your conversations are stored securely and used to improve service personalization</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span>We use Supermemory technology to provide contextual, personalized support</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span>Medical documents are processed with HIPAA-compliant encryption and security measures</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span>We implement enterprise-grade security measures to protect your data</span>
              </li>
            </ul>
          </section>

          <section>
            <h3 className="text-base font-semibold text-slate-900 mb-2">4. User Responsibilities</h3>
            <p className="mb-2">
              As a user of MedeSense, you agree to:
            </p>
            <ul className="space-y-1.5 ml-4">
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span>Use the service responsibly and for its intended wellness support purpose</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span>Not rely on MedeSense for emergency situations or critical health decisions</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span>Maintain the confidentiality of your account credentials</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span>Not share sensitive medical information that requires professional healthcare oversight</span>
              </li>
            </ul>
          </section>

          <section>
            <h3 className="text-base font-semibold text-slate-900 mb-2">5. Limitation of Liability</h3>
            <p>
              MedeSense and its operators are not liable for any decisions made based on interactions with the service. This is a wellness support tool and should not be used as a replacement for professional medical advice, diagnosis, or treatment.
            </p>
          </section>

          <section>
            <h3 className="text-base font-semibold text-slate-900 mb-2">6. Changes to Terms</h3>
            <p>
              We reserve the right to modify these terms at any time. Continued use of MedeSense after changes constitutes acceptance of the updated terms.
            </p>
          </section>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mt-4">
            <p className="text-xs text-amber-900">
              <strong className="font-semibold">Important Reminder:</strong> If you are experiencing a medical emergency or mental health crisis, please contact emergency services immediately. MedeSense is designed for general wellness support only.
            </p>
          </div>
        </div>

        <div className="p-4 border-t border-slate-200 bg-slate-50 space-y-2">
          <button
            type="button"
            onClick={onAccept}
            className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Accept Terms of Service
          </button>
          <button
            type="button"
            onClick={onDecline}
            className="w-full py-2.5 bg-white text-slate-700 border border-slate-300 rounded-lg font-medium hover:bg-slate-50 transition-colors"
          >
            Decline
          </button>
        </div>
      </div>
    </div>
  );
};

export default TOSModal;
