import { Children, FC, ReactNode, useEffect, useState } from "react"
import { ChatContext } from "./chatContext"
import { IChat } from "~types/dto/chat.dto"

export const ChatContextProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const [activeChat, setActiveChat] = useState<IChat | null>(null);
    const [chats, setChats] = useState<IChat[] | null>(null);

    return (
        <ChatContext.Provider value={{
            activeChat,
            setActiveChat: (chat) => {
                if (chat || chat === null) {
                    setActiveChat(chat);
                }
            },
            chats,
            setChats
        }}>
            {children}
        </ChatContext.Provider>
    )
}