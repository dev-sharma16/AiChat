import React, { useState } from 'react';
import { Send, MessageCircle } from 'lucide-react';

const ChatInput = ({ onSendMessage, disabled = false }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 border-t border-gray-200 dark:border-gray-600 p-4">
      <div className="flex items-end gap-3 max-w-4xl mx-auto">
        <div className="flex-1 relative">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message here..."
            disabled={disabled}
            className="w-full px-4 py-3 pr-12 border border-gray-300 dark:bg-slate-500 dark:text-white rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none max-h-32 disabled:opacity-50 disabled:cursor-not-allowed"
            rows={1}
            style={{
              minHeight: '48px',
              height: 'auto'
            }}
          />
          <MessageCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        </div>
        
        <button
          type="submit"
          disabled={!message.trim() || disabled}
          className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-gray-300 disabled:to-gray-400 text-white p-3 rounded-2xl transition-all duration-200 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </form>
  );
};

export default ChatInput;