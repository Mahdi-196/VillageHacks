// src/pages/ChatPage.tsx
import { useState, useEffect, useRef, FormEvent, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserMd, FaCog, FaPaperPlane, FaInfoCircle, FaPaperclip, FaTimes, FaFileAlt } from 'react-icons/fa';
import SettingsModal from '../components/SettingsModal';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  attachments?: AttachedFile[];
}

interface AttachedFile {
  name: string;
  size: number;
  type: string;
  url?: string;
}

const ChatPage = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem('aura_user');
    if (!user) {
      navigate('/');
    }
  }, [navigate]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newFiles: AttachedFile[] = Array.from(files).map(file => ({
      name: file.name,
      size: file.size,
      type: file.type,
    }));

    setAttachedFiles(prev => [...prev, ...newFiles]);
  };

  const removeFile = (index: number) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if ((!inputValue.trim() && attachedFiles.length === 0) || loading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue.trim() || 'Uploaded documents',
      timestamp: new Date(),
      attachments: attachedFiles.length > 0 ? [...attachedFiles] : undefined,
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setAttachedFiles([]);
    setLoading(true);

    try {
      const token = localStorage.getItem('aura_token');

      const formData = new FormData();
      formData.append('message', userMessage.content);

      if (fileInputRef.current?.files) {
        Array.from(fileInputRef.current.files).forEach(file => {
          formData.append('files', file);
        });
      }

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get response');
      }

      const assistantMessage: Message = {
        id: data.id || (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.message,
        timestamp: new Date(data.timestamp || Date.now()),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      console.error('Error sending message:', err);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Unable to connect to server. Please try again.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-4 py-4 shadow-sm">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <FaUserMd className="text-3xl text-indigo-600" />
            <div>
              <div className="text-xl font-bold text-gray-900">MedeSense</div>
              <div className="text-xs text-gray-500">Your Wellness Companion</div>
            </div>
          </div>
          <button
            onClick={() => setShowSettings(true)}
            className="p-2.5 hover:bg-gray-100 rounded-lg transition-colors text-gray-600"
            aria-label="Settings"
          >
            <FaCog className="w-6 h-6" />
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-6 bg-white">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-4 max-w-3xl mx-auto">
            <div className="w-20 h-20 bg-indigo-100 rounded-xl flex items-center justify-center mb-6">
              <FaUserMd className="text-5xl text-indigo-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Welcome to MedeSense
            </h2>
            <p className="text-lg text-gray-600 max-w-md mb-8">
              I'm here to support your wellbeing journey. Feel free to share what's on your mind,
              and I'll listen with compassion and understanding.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 max-w-lg text-sm text-blue-900 flex items-start space-x-3">
              <FaInfoCircle className="text-blue-600 mt-0.5 flex-shrink-0" />
              <p>
                <strong className="font-semibold">Important:</strong> I'm a wellness companion and cannot provide medical advice,
                diagnoses, or prescriptions. For emergencies, please contact 911.
              </p>
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] md:max-w-[70%] rounded-xl px-5 py-3 ${
                    message.role === 'user'
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-900 border border-gray-200'
                  }`}
                >
                  <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
                  {message.attachments && message.attachments.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {message.attachments.map((file, idx) => (
                        <div
                          key={idx}
                          className={`flex items-center space-x-2 p-2 rounded ${
                            message.role === 'user'
                              ? 'bg-indigo-700 bg-opacity-50'
                              : 'bg-gray-200'
                          }`}
                        >
                          <FaFileAlt className="text-sm" />
                          <span className="text-sm flex-1 truncate">{file.name}</span>
                          <span className="text-xs opacity-75">{formatFileSize(file.size)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-xl px-5 py-3 border border-gray-200">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      <div className="border-t border-gray-200 bg-gray-50 px-4 py-5 shadow-sm">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
          {attachedFiles.length > 0 && (
            <div className="mb-3 flex flex-wrap gap-2">
              {attachedFiles.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-2 bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm"
                >
                  <FaFileAlt className="text-indigo-600" />
                  <span className="max-w-[200px] truncate">{file.name}</span>
                  <span className="text-gray-500 text-xs">{formatFileSize(file.size)}</span>
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <FaTimes className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
          <div className="flex space-x-3">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              multiple
              accept=".pdf,.doc,.docx,.txt,.csv,.json"
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-3.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 shadow-sm transition-all"
              disabled={loading}
            >
              <FaPaperclip className="w-5 h-5" />
            </button>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Share what's on your mind..."
              className="flex-1 px-5 py-3.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-white"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || (!inputValue.trim() && attachedFiles.length === 0)}
              className="px-4 py-3.5 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Send message"
            >
              <FaPaperPlane className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>

      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
    </div>
  );
};

export default ChatPage;
