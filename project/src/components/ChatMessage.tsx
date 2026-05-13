import React from 'react';
import { format } from 'date-fns';
import { MessageSquare, User } from 'lucide-react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { Message } from '../types/chat';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.sender === 'user';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex items-start gap-4 ${isUser ? 'justify-end' : ''}`}
    >
      {!isUser && (
        <div className="bg-white rounded-full p-2 shadow-sm">
          <div className="bg-primary-500 text-white p-1 rounded-full">
            <MessageSquare size={16} />
          </div>
        </div>
      )}
      
      <div 
        className={`p-4 rounded-2xl shadow-sm max-w-[85%] ${
          isUser 
            ? 'bg-primary-500 text-white rounded-tr-none' 
            : 'bg-white text-gray-800 rounded-tl-none'
        }`}
      >
        {isUser ? (
          <p>{message.text}</p>
        ) : (
          <ReactMarkdown
            className="prose prose-sm max-w-none"
            components={{
              a: ({ node, ...props }) => (
                <a 
                  {...props} 
                  className="text-accent-500 hover:underline" 
                  target="_blank" 
                  rel="noopener noreferrer"
                />
              ),
              ul: ({ node, ...props }) => (
                <ul {...props} className="list-disc pl-5 space-y-1" />
              ),
              ol: ({ node, ...props }) => (
                <ol {...props} className="list-decimal pl-5 space-y-1" />
              ),
              li: ({ node, ...props }) => (
                <li {...props} className="my-1" />
              ),
              h3: ({ node, ...props }) => (
                <h3 {...props} className="text-lg font-medium mt-4 mb-2" />
              ),
              p: ({ node, ...props }) => (
                <p {...props} className="mb-2" />
              ),
              code: ({ node, ...props }) => (
                <code {...props} className="bg-gray-100 px-1 py-0.5 rounded text-sm" />
              ),
            }}
          >
            {message.text}
          </ReactMarkdown>
        )}
        <div 
          className={`text-xs mt-1 ${
            isUser ? 'text-primary-200' : 'text-gray-400'
          }`}
        >
          {format(new Date(message.timestamp), 'h:mm a')}
        </div>
      </div>
      
      {isUser && (
        <div className="bg-gray-200 rounded-full p-2 shadow-sm">
          <User size={16} className="text-gray-600" />
        </div>
      )}
    </motion.div>
  );
};

export default ChatMessage;