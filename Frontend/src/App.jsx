import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { store } from './store/store';
import { loadUser } from './store/slices/authSlice';
import { setTheme } from './store/slices/themeSlice';
import { useSocket } from './hooks/useSocket';
import config from './config/config';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ChatPage from './pages/ChatPage';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

const AppContent = () => {
  const dispatch = useDispatch();
  const { isInitialized } = useSelector((state) => state.auth);
  const { mode } = useSelector((state) => state.theme);

  // Initialize theme on app load
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      dispatch(setTheme(savedTheme));
    } else {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      dispatch(setTheme(prefersDark ? 'dark' : 'light'));
    }
  }, [dispatch]);

  // Apply theme to document
  useEffect(() => {
    if (mode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [mode]);

  // Load user on app initialization
  useEffect(() => {
    if (!isInitialized) {
      dispatch(loadUser());
    }
  }, [dispatch, isInitialized]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <Layout>
            <HomePage />
          </Layout>
        } />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/chat" element={
          <ProtectedRoute>
            <ChatPageWithSocket />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
};

// Separate component for chat page with socket connection
const ChatPageWithSocket = () => {
  const socketApi = useSocket(config.BACKEND_URL);
  const { isConnected } = socketApi;
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <Layout 
      showConnectionStatus={true}
      isConnected={isConnected} 
      onToggleSidebar={() => setIsSidebarOpen(true)}
    >
      <ChatPage 
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        socketApi={socketApi}
      />
    </Layout>
  );
};

function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

export default App;