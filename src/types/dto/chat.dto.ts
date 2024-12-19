import { msgContentType } from "./message.dto"

export type IChat = {
    _id: string,
    last_message: {
        time: Date,
        body: string | null,
        msg_type: msgContentType
    },
    participants: [string, string],
    unread_messages: number
}