import { string } from "zod";

export enum msgContentType {
    image = "image",
    video = "video",
    text = "text"
}

export type IMessage = {
    _id: string,
    chat_id: string,
    content_type: msgContentType,
    body: string | null,
    media_url: string | null,
    sender: string,
    reply_to: string | null,
    // reciever: string, // not in database, check and segregate this into another interface/type to have clear idea of what is this
    createdAt: string,
    updatedAt: string
}