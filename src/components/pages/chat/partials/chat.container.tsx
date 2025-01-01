import { Avatar, Button, Textarea } from "@nextui-org/react"
import { useQuery } from "@tanstack/react-query"
import { useContext, useEffect, useRef, useState } from "react"
import { LuLoader, LuMoreVertical, LuSendHorizonal, LuVideo } from "react-icons/lu"
import { Link, useNavigate } from "react-router-dom"
import { ChatContext } from "~/context/chatContext"
import { SocketContext } from "~/context/socketContext"
import { SocketEvents } from "~constants/socket.events"
import { useAppSelector } from "~hooks/useReduxHooks"
import { fetchMessages } from "~services/query/chat.queries"
import { IMessage, msgContentType } from "~types/dto/message.dto"
import { buildImageUrl } from "~utils/imageUrl"



export const ChatContainer = () => {
    const { activeChat } = useContext(ChatContext);
    const { Socket } = useContext(SocketContext);
    const navigate = useNavigate();

    const [messagebody, setMessageBody] = useState("");
    const [chatMessages, setChatMessages] = useState<IMessage[]>([]);

    const stateUserId = useAppSelector(state => state.user._id);
    const chatId = activeChat?._id as string;
    const receiver = activeChat?.participants.filter(v => v !== stateUserId)[0];

    const messagesDivRef = useRef<HTMLDivElement>(null);


    /* CHANGE use infinite fetching on scroll up in descending order */
    const { data, isLoading, isFetching, isFetched, error, refetch } = useQuery({
        queryKey: ["getMessages", chatId],
        queryFn: () => {
            return fetchMessages(chatId)
        },
        retry: false,
        enabled: !!chatId
    })

    useEffect(() => {
        if (data?.data?.success) {
            setChatMessages(data?.data?.body.messages);
        }

    }, [data]);

    const handleIncomingMessages = (message: IMessage) => {
        setChatMessages(prev => [...prev, message]);
        // FIX cache hit
    }

    useEffect(() => {
        messagesDivRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [chatMessages])

    useEffect(() => {
        Socket?.on(SocketEvents.recv_msg, handleIncomingMessages);

        return () => {
            Socket?.off(SocketEvents.recv_msg, handleIncomingMessages)
        }
    }, [Socket])

    return (
        <div className="flex-1 flex flex-col h-screen">

            {/* Action bar */}
            <div className="p-4 border-b border-app-tertiary flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <Avatar
                        src={buildImageUrl(activeChat?.profile.avatar)}
                        name={activeChat?.profile.displayname}
                        showFallback
                        className="border border-app-tertiary w-11 h-11"
                    />
                    <div>
                        <h2 className="font-semibold">{activeChat?.profile.username}</h2>
                        <p className="text-xs text-app-t-secondary">Offline</p>
                    </div>
                </div>
                <div className="flex space-x-2">
                    {/* <Link to={`/call/${chatId}?receiver=${receiver}`} target="_blank"> */}
                    <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        onClick={(e) => {
                            navigate(`/call/${chatId}?receiver=${receiver}`);
                        }}
                    >
                        <LuVideo className="h-5 w-5 text-app-t-primary" />
                    </Button>
                    {/* </Link> */}
                    <Button isIconOnly size="sm" variant="light" aria-label="More Options">
                        <LuMoreVertical className="h-5 w-5 text-app-t-primary" />
                    </Button>
                </div>
            </div>

            {/* messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2" >
                {chatMessages.map((message, index) => (
                    <div
                        key={message._id}
                        className={`flex ${message.sender === stateUserId ? "justify-end" : "justify-start"} animate-slideDown`}
                    >
                        <div
                            className={`max-w-[70%] min-w-[20%] p-3 rounded-lg ${message.sender === stateUserId ? "bg-blue-500 text-white" : "bg-app-tertiary"}`}
                        >
                            <p>{message.body}</p>
                            <p className="text-[10px] text-left mt-1 text-white/60">{new Date(message.createdAt).toLocaleTimeString("en-US", {
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: true
                            })}</p>
                        </div>
                    </div>
                ))}
                <div
                    ref={messagesDivRef}
                    className={chatMessages.length === 0 ? "h-full flex justify-center items-center text-sm" : "h-0 overflow-clip"}
                >
                    {
                        /*  An issue where this message gets shown*/
                        isFetching ?
                            <LuLoader size={23} className="animate-spin animate-delayed-appearance" color="gray" />
                            :
                            <span
                                className="text-center font-light animate-appearance-in duration-500"
                            >
                                Drop a <span className="text-2xl">&#128075;</span> to kick things off!
                            </span>

                    }
                </div>
            </div>

            {/* footer */}
            <div className="p-4 border-t border-app-tertiary">
                <div className="flex space-x-2">
                    <Textarea
                        placeholder="Type a message..."
                        variant="bordered"
                        onChange={(e) => setMessageBody(e.target.value)}
                        value={messagebody}
                        minRows={1}
                        maxRows={4}
                    // onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    />
                    <Button
                        isIconOnly
                        color="primary"
                        aria-label="Send"
                        onPress={(e) => {
                            Socket?.emit(SocketEvents.send_msg, {
                                body: messagebody,
                                chat_id: chatId,
                                content_type: msgContentType.text,
                            } as IMessage);

                            setMessageBody("");
                        }}
                    >
                        <LuSendHorizonal />
                    </Button>
                </div>
            </div>
        </div>
    )
}