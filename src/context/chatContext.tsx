import { createContext } from "react";
import { chatContextType } from "~types/context/chatContext.type";

export const ChatContext = createContext<chatContextType>({
    chats: null,
    activeChat: null,
    setActiveChat: ()=>{},
    setChats: ()=>{},
});
