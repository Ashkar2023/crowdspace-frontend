import { createContext } from "react";
import { SocketContextType } from "~types/context/socketContext.types";

export const SocketContext = createContext<SocketContextType>({
    Socket: null,
    socketConnected: false
})