import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

export const useSocket = (serverUrl) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    const newSocket = io(serverUrl,{
      transports: ['polling'], //* due to free plan of RENDER temperarily switching to polling from webSockets
      withCredentials: true
    });
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('Connected to server');
      setIsConnected(true);
    });

    newSocket.on('disconnect', (reason) => {
      console.log('Disconnected from server:', reason);
      setIsConnected(false);
    });

    newSocket.on('message-response', (data) => {
      setIsTyping(false);
      const aiMessage = {
        id: `ai-${Date.now()}`,
        text: data.response,
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
    });

    return () => {
      newSocket.close();
    };
  }, [serverUrl]);

  const sendMessage = (message) => {
    if (!socket || !isConnected || !message.trim()) return;

    const userMessage = {
      id: `user-${Date.now()}`,
      text: message,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);
    socket.emit('message', message);
  };

  return {
    isConnected,
    messages,
    isTyping,
    sendMessage
  };
};