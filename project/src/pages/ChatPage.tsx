import React, { useState, useRef, useEffect } from 'react';
import data from "../utils/data/data.json";
import { Send, Mic, Video, ImagePlus, MessageSquare } from 'lucide-react';
import ChatMessage from '../components/ChatMessage';
import InputModeButton from '../components/InputModeButton';
import { useChatStore } from '../store/chatStore';
import { mockPlacementAssistant } from '../utils/mockAssistant';

type InputMode = 'text' | 'audio' | 'video' | 'image';
type QAItem = { question: string; answer: string };

const ChatPage: React.FC = () => {
  const { messages, addMessage } = useChatStore();
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [inputMode, setInputMode] = useState<InputMode>('text');
  const [isRecording, setIsRecording] = useState(false);
  const [qaData] = useState<QAItem[]>(data);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 🎤 Speech Recognition
  const SpeechRecognition =
    (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

  const toggleRecording = () => {
    if (!SpeechRecognition) {
      alert("Speech Recognition not supported");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";

    recognition.onstart = () => setIsRecording(true);

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInputValue(transcript);
      setIsRecording(false);
    };

    recognition.onerror = () => setIsRecording(false);

    recognition.start();
  };

  // Scroll bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 📩 Send Message
  const handleSend = () => {
    if (inputValue.trim() === '') return;

    const userMessage = inputValue;

    addMessage({
      id: Date.now().toString(),
      text: userMessage,
      sender: 'user',
      timestamp: new Date()
    });

    setInputValue('');
    setIsLoading(true);

    setTimeout(() => {
      const response = mockPlacementAssistant(userMessage, qaData);

      addMessage({
        id: Date.now().toString(),
        text: response,
        sender: 'assistant',
        timestamp: new Date()
      });

      setIsLoading(false);
    }, 1000);
  };

  // 🖼️ Image Upload
  const handleImageUpload = (file: File) => {
    addMessage({
      id: Date.now().toString(),
      text: `📷 Image uploaded: ${file.name}`,
      sender: 'user',
      timestamp: new Date()
    });

    const response = mockPlacementAssistant("image", qaData);

    addMessage({
      id: Date.now().toString(),
      text: response,
      sender: 'assistant',
      timestamp: new Date()
    });
  };

  // 🎥 Video Upload
  const handleVideoUpload = (file: File) => {
    addMessage({
      id: Date.now().toString(),
      text: `🎥 Video uploaded: ${file.name}`,
      sender: 'user',
      timestamp: new Date()
    });

    const response = mockPlacementAssistant("video", qaData);

    addMessage({
      id: Date.now().toString(),
      text: response,
      sender: 'assistant',
      timestamp: new Date()
    });
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}

        {isLoading && <div className="text-gray-500">Typing...</div>}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Section */}
      <div className="p-4 border-t bg-white">

        {/* Mode Buttons */}
        <div className="flex gap-2 mb-2">
          <InputModeButton mode="text" currentMode={inputMode} onClick={() => setInputMode('text')} icon={<MessageSquare size={16} />} />
          <InputModeButton mode="audio" currentMode={inputMode} onClick={toggleRecording} icon={<Mic size={16} />} />
          <InputModeButton mode="image" currentMode={inputMode} onClick={() => setInputMode('image')} icon={<ImagePlus size={16} />} />
          <InputModeButton mode="video" currentMode={inputMode} onClick={() => setInputMode('video')} icon={<Video size={16} />} />
        </div>

        {/* Input Box */}
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask something..."
            className="flex-1 border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none min-h-[50px] max-h-[150px]"
            onKeyDown={(e) => {
            if (e.key === "Enter") {
             handleSend();
             }
          }}
      
          />

          <button onClick={handleSend} className="bg-blue-500 text-white p-2 rounded">
            <Send size={18} />
          </button>
        </div>

        {/* Image Upload */}
        {inputMode === 'image' && (
          <input
            type="file"
            accept="image/*"
            className="mt-2"
            onChange={(e) =>
              e.target.files && handleImageUpload(e.target.files[0])
            }
          />
        )}

        {/* Video Upload */}
        {inputMode === 'video' && (
          <input
            type="file"
            accept="video/*"
            className="mt-2"
            onChange={(e) =>
              e.target.files && handleVideoUpload(e.target.files[0])
            }
          />
        )}
      </div>
    </div>
  );
};

export default ChatPage;