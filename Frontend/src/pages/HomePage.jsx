import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Bot, MessageCircle, Shield, Zap, ArrowRight } from 'lucide-react';

const HomePage = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full p-6 w-24 h-24 mx-auto mb-8">
            <Bot className="w-12 h-12 text-white" />
          </div>
          
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
            AI Chat Assistant
          </h1>
          
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-8">
            Experience the power of AI conversation with Google Gemini. 
            Get instant answers, creative assistance, and intelligent discussions.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {isAuthenticated ? (
              <Link
                to="/chat"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Continue Chatting
                <ArrowRight className="w-5 h-5" />
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Get Started
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-medium py-3 px-6 rounded-lg border border-gray-300 dark:border-gray-600 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Sign In
                </Link>
              </>
            )}
          </div>

          {isAuthenticated && (
            <p className="mt-4 text-gray-600 dark:text-gray-400">
              Welcome back, <span className="font-medium text-blue-600 dark:text-blue-400">{user?.username}</span>!
            </p>
          )}
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="bg-blue-100 dark:bg-blue-900/30 rounded-lg p-3 w-12 h-12 mb-6">
              <MessageCircle className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Real-time Chat
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Instant responses with WebSocket technology for seamless conversations with AI.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="bg-purple-100 dark:bg-purple-900/30 rounded-lg p-3 w-12 h-12 mb-6">
              <Zap className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Powered by Gemini
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Advanced AI capabilities with Google's latest Gemini 2.0 Flash model for intelligent responses.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="bg-green-100 dark:bg-green-900/30 rounded-lg p-3 w-12 h-12 mb-6">
              <Shield className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Secure & Private
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Your conversations are protected with secure authentication and encrypted connections.
            </p>
          </div>
        </div>

        {/* CTA Section */}
        {!isAuthenticated && (
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-8 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Start Chatting?
            </h2>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Join thousands of users who are already experiencing the future of AI conversation.
            </p>
            <Link
              to="/register"
              className="inline-flex items-center gap-2 bg-white text-blue-600 font-medium py-3 px-6 rounded-lg hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Create Free Account
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;