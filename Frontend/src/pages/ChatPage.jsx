import React, { useEffect, useRef, useState } from 'react';
import { useSocket } from '../hooks/useSocket';
import config from '../config/config';
import ChatMessage from '../components/ChatMessage';
import ChatInput from '../components/ChatInput';
import TypingIndicator from '../components/TypingIndicator';
import WelcomeMessage from '../components/WelcomeMessage';
import ChatSidebar from '../components/ChatSidebar';

const ChatPage = ({ isSidebarOpen, setIsSidebarOpen , socketApi}) => {
  const { isConnected, messages, isTyping, sendMessage, allChats, newChat, reloadPreviousChat } = socketApi;
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleNewChat = () => {
    console.log('Starting new chat');
    newChat();
    setIsSidebarOpen(false)
  };

  const handleSelectChat = (chat) => {
    // Load selected chat messages
    console.log('Selected chat:', chat);
    reloadPreviousChat(chat);
    setIsSidebarOpen(false)
  };

  return (
    <>
      <ChatSidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          allChats={allChats}
          onNewChat={handleNewChat}
          onSelectChat={handleSelectChat}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Pass sidebar toggle to Layout via props */}
        <div className="hidden">
          {/* This is a hack to pass the toggle function to Layout */}
          {typeof window !== 'undefined' && (window.toggleChatSidebar = () => setIsSidebarOpen(true))}
        </div>

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
    </>  
  );
};

export default ChatPage;