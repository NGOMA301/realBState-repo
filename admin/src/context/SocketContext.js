import { createContext, useContext, useEffect, useState } from "react";
import { initializeSocket } from "@/api/api";

const SocketContext = createContext({
  socket: null,
  socketReady: false,
});

export function SocketProvider({ children }) {
  const [socket, setSocket] = useState(null);
  const [socketReady, setSocketReady] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const setupSocket = async () => {
      try {
        const s = await initializeSocket();
        if (isMounted) {
          setSocket(s);
          setSocketReady(true);
        }
      } catch (error) {
        console.error("Socket initialization failed:", error);
      }
    };

    setupSocket();

    return () => {
      isMounted = false;
      // Optionally disconnect socket on unmount:
      // if (socket) socket.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, socketReady }}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  return useContext(SocketContext);
}
