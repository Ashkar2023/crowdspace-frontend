import { Socket } from "socket.io-client";

export interface SocketContextType {
    Socket: Socket | null
    socketConnected: boolean
}

export type IncomingCallData = {
    roomId: string,
    userBasic: {
        _id: string,
        username: string,
        displayname: string,
        avatar: string,
    },
    receiverId: string
}

export type callMetadata = {
    roomId: string;
    receiverId: string
};