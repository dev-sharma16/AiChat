import React, { useEffect, useRef } from 'react';
import { useSocket } from './hooks/useSocket';
import ChatMessage from './components/ChatMessage';
import ChatInput from './components/ChatInput';
import ConnectionStatus from './components/ConnectionStatus';
import TypingIndicator from './components/TypingIndicator';
import WelcomeMessage from './components/WelcomeMessage';
import config from './config/config';

function App() {
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 p-4 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg p-2">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">AI Chat</h1>
              <p className="text-sm text-gray-500">Powered by Gemini</p>
            </div>
          </div>
          
          <ConnectionStatus isConnected={isConnected} />
        </div>
      </header>

      {/* Chat Container */}
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
      </div>

      {/* Connection Warning */}
      {!isConnected && (
        <div className="bg-red-500 text-white text-center py-2 text-sm">
          Connection lost. Please check if your server is running on port 3000.
        </div>
      )}
    </div>
  );
}

export default App;