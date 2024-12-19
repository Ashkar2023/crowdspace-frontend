import { Dispatch, SetStateAction } from "react"
import { IChat } from "~types/dto/chat.dto"

export type chatContextType = {
    chats: IChat[] | null,
    activeChat: IChat | null,
    // setActiveChat: Dispatch<SetStateAction<IChat | null>> ,
    // setChats: Dispatch<SetStateAction<IChat[] | null>>
    setActiveChat: (chat: IChat | null) => void,
    setChats: (chats: IChat[]) => void
}