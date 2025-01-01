import { FC, ReactNode, useEffect, useState } from "react";
import { SocketContext } from "./socketContext";
import { io, Socket } from "socket.io-client";
import { useAppSelector } from "~hooks/useReduxHooks";
import toast from "react-hot-toast";
import { SocketEvents } from "~constants/socket.events";

export const SocketContextProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const stateUserId = useAppSelector(state => state.user._id);
    const [Socket, setSocket] = useState<Socket | null>(null);
    const [isConnected, setIsConnected] = useState<boolean>(false);
    // set on window focus retry

    useEffect(() => {
        if (!stateUserId) {
            console.log("User not logged in");
            return
        }

        const socketInstance = io(import.meta.env.VITE_API_URL, {
            auth: {
                userId: stateUserId as string
            },
            path: "/socket/chat",
            reconnectionAttempts: 20,
            randomizationFactor: 0.6,
            reconnectionDelay: 3000,
            transports: ["websocket"],
        })

        socketInstance.on("connect", () => {
            setSocket(socketInstance);
            setIsConnected(socketInstance.connected);
        })

        socketInstance.on(SocketEvents.client_error, (message: string) => {
            toast.error(message);
        })

        socketInstance.on("connect_error", async (err) => {
            setIsConnected(socketInstance.connected);
        })

        return () => {
            if (stateUserId) {
                const socketDisconnected = !!Socket?.disconnect().connected;
                setIsConnected(socketDisconnected);
    
                if(!socketDisconnected){
                    console.log("listeners removed");
                    Socket?.removeAllListeners();
                }
            }
        }
    }, [stateUserId]);

    return <SocketContext.Provider value={{ Socket, socketConnected: isConnected }}>
        {children}
    </SocketContext.Provider>
}