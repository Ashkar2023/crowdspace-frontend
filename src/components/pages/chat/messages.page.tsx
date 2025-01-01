import { RecentChatList } from "./partials/recentChats.list"
import { ChatContainer } from "./partials/chat.container"
import { Suspense, useContext, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { LuLoader, LuMessageCircle } from "react-icons/lu"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { fetchAllChats, fetchChat } from "~services/query/chat.queries"
import { ChatContext } from "~/context/chatContext"


export const MessagesPage = () => {
    const { chat_id } = useParams();
    const navigate = useNavigate();
    const { setChats, chats } = useContext(ChatContext);
    const { activeChat, setActiveChat } = useContext(ChatContext);

    const { data, error, isLoading, refetch } = useQuery({
        queryKey: ["fetchAllChats"],
        queryFn: fetchAllChats,
        retry: false,
        enabled: chats === null
    });

    const {
        data: chatData,
        refetch: chatRefetch,
        isFetched: chatDataFetched
    } = useQuery({
        queryKey: ["fetchChat", chat_id],
        queryFn: () => {
            return fetchChat(chat_id!)
        },
        retry: false,
        enabled() {
            return !activeChat?._id && !!chat_id // Fix issue No: 001 in book
        }
    })

    useEffect(() => {

        if (chatData?.data?.success && chatDataFetched) {
            if (activeChat === null && chatData.data?.body?.chat) {
                setActiveChat(chatData.data.body.chat);
            }
        } else if (!chatData?.data?.success && chatDataFetched) {
            navigate('/messages');
        }

    }, [chatDataFetched]);

    useEffect(() => {
        if (data?.body.count) {
            setChats(data.body.chats);
        }

    }, [data])

    useEffect(() => {
        if (!chat_id) {
            setActiveChat(null);
        }

    }, [chat_id, navigate])

    useEffect(()=>{
        return ()=>{
            setActiveChat(null);
        }
    },[])

    const placeholder = (loader: boolean) => (
        <div className="place-content-center grid">
            <div className="flex gap-2 bg-app-tertiary px-4 py-1 rounded-md border-[0.7px] border-gray-600">
                {!loader ?
                    <>
                        <LuMessageCircle className="self-center" size={20} />
                        <h1 className="text-lg font-normal inline-block">
                            Select a Chat
                        </h1>
                    </>
                    :
                    <LuLoader color="gray" size={25} className="animate-spin" />
                }
            </div>
        </div>
    )

    return (
        <div className="grid grid-cols-[3fr_7fr] h-screen">
            <RecentChatList />

            {
                activeChat?._id ?
                    <ChatContainer />
                    :
                    placeholder(isLoading)
            }
        </div>
    )
}