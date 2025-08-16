import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

export const useSocket = (serverUrl) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [allChats, setAllChats] = useState([]); 

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

    newSocket.on('load-all-chats', (data) => {
      const response = data
      console.log(response);
      setAllChats(response.chats);
    })

    newSocket.on('new-chat-started', () => {
      setMessages([]);
      console.log('New chat Started.!');
    })

    newSocket.on('reloaded-chat', (data) => {
      const formatted = Array.isArray(data)
      ? data.map(m => ({
          id: m._id || `${m.role}-${Date.now()}-${Math.random()}`,
          text: m?.parts?.text ?? '',
          isUser: m.role === 'user',
          timestamp: new Date(m.createdAt || Date.now())
        }))
      : [];
      setIsTyping(false);
      setMessages(formatted);
    })

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

  const newChat = () => {
    socket.emit('newChat')
  }  

  const reloadPreviousChat = (chat) => {
    socket.emit('reload-chat', chat)
  }

  return {
    isConnected,
    messages,
    isTyping,
    sendMessage,
    allChats,
    newChat,
    reloadPreviousChat
  };
};