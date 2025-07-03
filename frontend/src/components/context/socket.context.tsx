// context/SocketContext.tsx

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

interface ISocketContext {
  socket: Socket | null;
  isConnected: boolean;
}

const SocketContext = createContext<ISocketContext>({
  socket: null,
  isConnected: false,
});

export const useSocket = () => useContext(SocketContext);

interface Props {
  children: React.ReactNode;
}

export const SocketProvider = ({ children }: Props) => {
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const user = localStorage.getItem("user");
    const userId = user ? JSON.parse(user)._id : null;

    if (!userId) return;

    const socket = io(import.meta.env.VITE_BACKEND_URL); 
    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("✅ Socket connected:", socket.id);
      setIsConnected(true);
      socket.emit("join_room", userId);
    });

    socket.on("disconnect", () => {
      console.log("❌ Socket disconnected");
      setIsConnected(false);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, []);

  return (
    <SocketContext.Provider
      value={{ socket: socketRef.current, isConnected }}
    >
      {children}
    </SocketContext.Provider>
  );
};
