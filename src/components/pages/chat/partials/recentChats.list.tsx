import { Avatar, Button, Input, Tooltip } from "@nextui-org/react"
import { useContext, useEffect, useState } from "react"
import { LuPlus, LuSearch } from "react-icons/lu"
import { useNavigate } from "react-router-dom"
import { ChatContext } from "~/context/chatContext"
import { SocketContext } from "~/context/socketContext"
import { IChat } from "~types/dto/chat.dto"
import { buildImageUrl } from "~utils/imageUrl"


export const RecentChatList = () => {
    const { Socket, socketConnected } = useContext(SocketContext);
    const { chats, setActiveChat, activeChat } = useContext(ChatContext)
    const navigate = useNavigate();

    useEffect(() => {
        if (activeChat) {
            navigate(`/messages/${activeChat?._id}`);
        }

    }, [activeChat])

    return (
        <div className="h-full border-r border-app-tertiary ">
            <div>
                <div className="flex justify-between h-16 items-center px-3">
                    <h2 className="text-2xl font-semibold">Chats</h2>
                    <div className="flex gap-4">
                        <Tooltip
                            content={socketConnected ? "Connected" : "Disconnected"}
                            className="bg-gray-700 text-app-t-primary text-xs"
                            placement="left"
                        >
                            <div
                                className={`self-center h-2 w-2 ${socketConnected ? "bg-green-500" : "ring-[0.5px] ring-offset-app-primary ring-offset-2 ring-red-700 bg-red-600 animate-pulse duration-[20ms]"} 
                            rounded-lg`}>
                            </div>
                        </Tooltip>
                        <Button
                            variant="solid"
                            size="sm"
                            radius="md"
                            className=""
                            isIconOnly
                        >
                            <LuPlus className="text-base " />
                        </Button>
                    </div>
                </div>

            </div>
            {
                chats?.length ?
                    <ul>
                        {chats.map((chat) => (
                            //chat.profile will not have _idsea
                            <li
                                key={chat._id}
                                className={`p-2 m-2 rounded-lg hover:bg-app-tertiary cursor-pointer ${activeChat?._id === chat._id ? "bg-app-tertiary" : ""}`}
                                onClick={() => {
                                    setActiveChat(chat);
                                }}
                            >
                                <div
                                    className={`flex items-center space-x-3`}
                                >
                                    <Avatar
                                        src={buildImageUrl(chat?.profile.avatar)}
                                        name={chat?.profile.displayname}
                                        showFallback
                                        className="border-[0.5px] border-app-tertiary h-12 w-12"
                                    />
                                    <div>
                                        <p className="font-medium">{chat.profile.username}</p>
                                        <p className="text-sm text-app-t-secondary truncate">{chat.last_message?.body}</p>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul> :
                    <div className="flex flex-col h-[80%] items-center justify-center p-8 text-app-t-secondary">
                        <p className="text-lg">No chats yet</p>
                        <p className="text-sm">Start a new conversation using the + button above</p>
                    </div>
            }
        </div>
    )
}