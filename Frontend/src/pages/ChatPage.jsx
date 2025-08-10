import React, { useEffect, useRef } from 'react';
import { useSocket } from '../hooks/useSocket';
import ChatMessage from '../components/ChatMessage';
import ChatInput from '../components/ChatInput';
import TypingIndicator from '../components/TypingIndicator';
import WelcomeMessage from '../components/WelcomeMessage';
import config from '../config/config';

const ChatPage = () => {
  const { isConnected, messages, isTyping, sendMessage } = useSocket(config.BACKEND_URL);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto px-4 py-6"
        style={{ scrollbarWidth: 'thin', scrollbarColor: '#CBD5E0 transparent' }}
      >
        <div className="max-w-4xl mx-auto">
          {messages.length === 0 ? (
            <WelcomeMessage />
          ) : (
            <>
              {messages.map((message) => (
                <ChatMessage
                  key={message.id}
                  message={message.text}
                  isUser={message.isUser}
                  timestamp={message.timestamp}
                />
              ))}
              
              {isTyping && <TypingIndicator />}
            </>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Chat Input */}
      <ChatInput 
        onSendMessage={sendMessage}
        disabled={!isConnected}
      />

      {/* Connection Warning */}
      {!isConnected && (
        <div className="bg-red-500 text-white text-center py-2 text-sm">
          Connection lost. Please check if your server is running on port 3007.
        </div>
      )}
    </div>
  );
};

export default ChatPage;