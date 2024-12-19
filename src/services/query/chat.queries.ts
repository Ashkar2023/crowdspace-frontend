import { protectedApi } from "~services/api/http"

export const fetchAllChats = async () => {
    return (await protectedApi.get('/chats')).data;
}

export const searchUserChat = async (endUserId: string) => {
    return (await protectedApi.get(`/chats/search/${endUserId}`));
}

export const fetchMessages = async (chatId:string) => {
    return (await protectedApi.get(`/chats/${chatId}/messages`))
}

export const fetchChat = async (chatId:string)=>{
    return (await protectedApi.get(`/chats/${chatId}`));
}