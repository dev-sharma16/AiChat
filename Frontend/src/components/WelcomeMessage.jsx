import React from 'react';
import { Bot, Sparkles } from 'lucide-react';

const WelcomeMessage = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full p-6 mb-6 shadow-lg">
        <Bot className="w-12 h-12 text-white" />
      </div>
      
      <h1 className="text-3xl font-bold text-gray-800 mb-4">
        Welcome to AI Chat
      </h1>
      
      <p className="text-gray-600 max-w-md mb-6 leading-relaxed">
        Start a conversation with our AI assistant powered by Google Gemini. 
        Ask questions, get help, or just chat about anything!
      </p>
      
      <div className="flex items-center gap-2 text-sm text-purple-600 bg-purple-50 px-4 py-2 rounded-full">
        <Sparkles className="w-4 h-4" />
        <span>Powered by Gemini 2.0 Flash</span>
      </div>
    </div>
  );
};

export default WelcomeMessage;