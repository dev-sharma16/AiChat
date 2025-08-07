import React from 'react';
import { Wifi, WifiOff } from 'lucide-react';

const ConnectionStatus = ({ isConnected }) => {
  return (
    <div className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium ${
      isConnected 
        ? 'bg-green-100 text-green-700' 
        : 'bg-red-100 text-red-700'
    }`}>
      {isConnected ? (
        <Wifi className="w-4 h-4" />
      ) : (
        <WifiOff className="w-4 h-4" />
      )}
      <span>{isConnected ? 'Connected' : 'Disconnected'}</span>
    </div>
  );
};

export default ConnectionStatus;