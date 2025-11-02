// src/pages/ChatPage.tsx
import { useState, useEffect, useRef } from 'react';
import type { FormEvent, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserMd, FaCog, FaPaperPlane, FaPaperclip, FaTimes, FaFileAlt } from 'react-icons/fa';
import SettingsModal from '../components/SettingsModal';
import { chatAPI, API_BASE_URL } from '../services/api';

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

  // Load messages from localStorage on mount
  useEffect(() => {
    const user = localStorage.getItem('aura_user');
    if (!user) {
      navigate('/');
      return;
    }

    // Load saved messages for this user
    const userData = JSON.parse(user);
    const savedMessages = localStorage.getItem(`aura_chat_${userData.id}`);
    if (savedMessages) {
      try {
        const parsed = JSON.parse(savedMessages);
        // Convert timestamp strings back to Date objects
        const messagesWithDates = parsed.map((msg: Message) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
        setMessages(messagesWithDates);
      } catch (e) {
        console.error('Failed to load saved messages:', e);
      }
    }
  }, [navigate]);

  // Save messages to localStorage whenever they change (keep only last 10)
  useEffect(() => {
    if (messages.length > 0) {
      const user = localStorage.getItem('aura_user');
      if (user) {
        const userData = JSON.parse(user);
        // Keep only the last 10 messages
        const last10Messages = messages.slice(-10);
        localStorage.setItem(`aura_chat_${userData.id}`, JSON.stringify(last10Messages));
      }
    }
  }, [messages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
          const base64 = reader.result.split(',')[1];
          resolve(base64);
        } else {
          reject(new Error('Failed to convert file to base64'));
        }
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleFileSelect = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Only process the first file for medical document upload
    const file = files[0];

    // Validate file type (Textract supported formats)
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/tiff', 'application/pdf'];
    if (!validTypes.includes(file.type)) {
      alert('Please upload a valid medical document (JPEG, PNG, PDF, or TIFF format only)');
      return;
    }

    // Validate file size (max 10MB for better performance)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      alert('File size must be less than 10MB');
      return;
    }

    const newFile: AttachedFile = {
      name: file.name,
      size: file.size,
      type: file.type,
    };

    setAttachedFiles([newFile]); // Only one file at a time for medical documents
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
      content: attachedFiles.length > 0 ? `Uploaded: ${attachedFiles[0].name}` : inputValue.trim(),
      timestamp: new Date(),
      attachments: attachedFiles.length > 0 ? [...attachedFiles] : undefined,
    };

    setMessages(prev => [...prev, userMessage]);
    const tempInput = inputValue.trim();
    setInputValue('');
    setAttachedFiles([]);
    setLoading(true);

    try {
      // If there's a file attached, process it through the document upload endpoint
      if (fileInputRef.current?.files && fileInputRef.current.files.length > 0) {
        const file = fileInputRef.current.files[0];
        const base64Content = await convertFileToBase64(file);

        const token = localStorage.getItem('aura_token');
        const response = await fetch(`${API_BASE_URL}/api/documents/upload-document`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            image_base64: base64Content,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.detail || 'Failed to process document');
        }

        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: `Document uploaded successfully. Your information has been securely processed and stored.`,
          timestamp: new Date(),
        };

        setMessages(prev => [...prev, assistantMessage]);
      } else if (tempInput) {
        // Build conversation history for AI context
        const conversationHistory = messages.map(msg => ({
          role: msg.role === 'user' ? 'user' : 'assistant',
          content: msg.content
        }));

        // Add system message for context
        const allMessages = [
          {
            role: 'system',
            content: 'You are MedeSense, a supportive and empathetic wellness companion. Provide helpful, evidence-based guidance on wellbeing topics. Be warm, understanding, and encouraging. Keep responses concise and actionable.'
          },
          ...conversationHistory,
          {
            role: 'user',
            content: tempInput
          }
        ];

        // Call the AI chat endpoint
        const response = await chatAPI.sendMessage(allMessages);

        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: response.content,
          timestamp: new Date(),
        };

        setMessages(prev => [...prev, assistantMessage]);
      }
    } catch (err) {
      console.error('Error processing request:', err);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `I apologize, but I'm having trouble connecting right now. ${err instanceof Error ? err.message : 'Please try again in a moment.'}`,
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
    <div className="flex flex-col h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 px-4 py-4">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <FaUserMd className="text-2xl text-blue-600" />
            <div>
              <div className="text-xl font-semibold text-slate-900">MedeSense</div>
              <div className="text-xs text-slate-500">Your Wellness Companion</div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowSettings(true)}
            className="p-2.5 hover:bg-slate-100 rounded-lg transition-colors text-slate-600"
            aria-label="Settings"
          >
            <FaCog className="w-5 h-5" />
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-6">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-4 max-w-2xl mx-auto">
            <h2 className="text-2xl font-semibold text-slate-800 mb-3">
              Welcome to MedeSense
            </h2>
            <p className="text-base text-slate-600 max-w-md">
              Share what's on your mind or upload a medical document to get started.
            </p>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] md:max-w-[70%] rounded-lg px-4 py-3 ${
                    message.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-900'
                  }`}
                >
                  <p className="whitespace-pre-wrap leading-relaxed text-sm">{message.content}</p>
                  {message.attachments && message.attachments.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {message.attachments.map((file, idx) => (
                        <div
                          key={idx}
                          className={`flex items-center space-x-2 p-2 rounded text-xs ${
                            message.role === 'user'
                              ? 'bg-blue-700 bg-opacity-30'
                              : 'bg-slate-200'
                          }`}
                        >
                          <FaFileAlt />
                          <span className="flex-1 truncate">{file.name}</span>
                          <span className="opacity-75">{formatFileSize(file.size)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-slate-100 rounded-lg px-4 py-3">
                  <div className="flex space-x-1.5">
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-75"></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-150"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      <div className="border-t border-slate-200 bg-white px-4 py-4">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
          {attachedFiles.length > 0 && (
            <div className="mb-3 flex flex-wrap gap-2">
              {attachedFiles.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm"
                >
                  <FaFileAlt className="text-blue-600" />
                  <span className="max-w-[200px] truncate">{file.name}</span>
                  <span className="text-slate-500 text-xs">{formatFileSize(file.size)}</span>
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="text-slate-400 hover:text-red-600 transition-colors"
                  >
                    <FaTimes className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
          <div className="flex space-x-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept=".jpg,.jpeg,.png,.pdf,.tiff,.tif,image/jpeg,image/png,image/tiff,application/pdf"
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-3 bg-slate-100 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
              disabled={loading}
            >
              <FaPaperclip className="w-5 h-5" />
            </button>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={attachedFiles.length > 0 ? "Document ready to upload..." : "Type your message..."}
              className="flex-1 px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white text-sm"
              disabled={loading || attachedFiles.length > 0}
            />
            <button
              type="submit"
              disabled={loading || (!inputValue.trim() && attachedFiles.length === 0)}
              className="px-5 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
