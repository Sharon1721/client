import React, { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { SocketContext } from './SocketContext';

interface Props {
  children: React.ReactNode;
}

export function SocketProvider({ children }: Props) {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    // Create the socket connection with configuration options
    const socketConnection = io(import.meta.env.VITE_API_URI || 'http://localhost:4000', {
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      autoConnect: true,
      transports: ['websocket', 'polling'], // Try WebSocket first, fallback to polling
    });

    // Add event listeners
    socketConnection.on('connect', () => {
      console.log('Socket connected:', socketConnection.id);
    });

    socketConnection.on('connect_error', (err) => {
      console.error('Socket connection error:', err.message);
    });

    socketConnection.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
    });

    setSocket(socketConnection);

    // Clean up on unmount
    return () => {
      socketConnection.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
}
