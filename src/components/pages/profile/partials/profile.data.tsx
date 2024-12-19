import { Button } from "@nextui-org/react"
import { PressEvent } from "@react-types/shared"
import { Dispatch, FC, SetStateAction, useContext, useState } from "react"
import toast from "react-hot-toast"
import { LuLoader, LuUserMinus, LuUserPlus } from "react-icons/lu"
import { protectedApi } from "~services/api/http"
import { ProfileStateType } from "~types/components/profile.types"
import { FollowStatus } from "~types/dto/follow.dto"
import { IFollows } from "../profile.page"
import { useNavigate } from "react-router-dom"
import { ChatContext } from "~/context/chatContext"
import { useMutation } from "@tanstack/react-query"
import { searchUserChat } from "~services/query/chat.queries"

type Props = {
    profileDetails: ProfileStateType | null,
    setProfileDetails: Dispatch<SetStateAction<ProfileStateType | null>>
    follows: IFollows
}

const ProfileData: FC<Props> = ({ profileDetails, setProfileDetails, follows }) => {
    const navigate = useNavigate();
    const chatContext = useContext(ChatContext);

    const [hoveredTab, setHoveredTab] = useState<"followers" | "followings" | null>(null);
    const [chatLoading, setChatLoading] = useState<boolean>(false);

    const followersList = follows.followers || [];
    const followingsList = follows.followings || [];


    const followHandler = async (e: PressEvent) => {
        try {
            /* handle current user profile */
            const { data, status } = profileDetails?.outgoingFollow?.status ?
                await protectedApi.delete(`/users/${profileDetails?.profile._id}/follow`) :
                await protectedApi.post(`/users/${profileDetails?.profile._id}/follow`, {
                    privateAccount: false // CHANGE, for now only
                })


            data.success && toast.success(data.message, {
                duration: 1400,
                position: "top-right",
                icon: status === 201 ? <LuUserPlus /> : status === 200 ? <LuUserMinus /> : null,
                style: {
                    background: "var(--app-secondary)",
                    color: "var(--app-text-primary)",
                    border: "1px solid var(--app-tertiary)"
                }
            }) && setProfileDetails({
                ...profileDetails!,
                outgoingFollow: {
                    ...data.body
                }
            });
        } catch (error) {
            if (error instanceof Error)
                console.log(error.message)
        }
    }

    const followerId = profileDetails?.profile._id as string;
    const { mutate, isIdle, isPending, isSuccess, data, } = useMutation({
        mutationKey: ["fetchChatDetail"],
        mutationFn: () => searchUserChat(followerId),
        retry: false,
        onMutate: () => setChatLoading(true),
        onSettled: () => setChatLoading(false),
        onSuccess(data, variables, context) {
            const chat = data?.data?.body?.chat;
            /**
             * CHANGE
             * 
             * If the messages page has been accessed before 
             * and if the chat exists in the chatlist navigate without fetching 
            */
            if (chat) {
                chatContext?.setActiveChat(chat);
                navigate(`/messages/${chat._id}`);
            }
        },
    })



    return (
        <div className="max-w-4xl p-4 space-y-4">
            {/* Profile header */}
            <div className="flex items-center space-x-4">
                {/* Profile picture */}
                <div className="size-32 rounded-full overflow-clip bg-gray-800">
                    <img src={import.meta.env.VITE_MEDIA_STORAGE_URL + profileDetails?.profile.avatar as string} alt="" className="min-h-full" />
                </div>

                {/* Username and buttons */}
                <div className="flex-1 space-y-2">
                    <h3 className="inline text-2xl">{profileDetails?.profile.username || "username"}</h3>
                    <div className="flex space-x-2">
                        <Button
                            variant="solid"
                            size="sm"
                            className={`text-sm px-6 text-white ${profileDetails?.outgoingFollow?.status ? "bg-app-secondary" : "bg-app-accent"}`}
                            onPress={followHandler}
                        >
                            {
                                profileDetails?.outgoingFollow?.status === FollowStatus.active ?
                                    "Unfollow" :
                                    profileDetails?.outgoingFollow?.status === FollowStatus.pending ?
                                        "Requested" :
                                        "Follow"
                            }
                        </Button>

                        <Button
                            variant="light"
                            size="sm"
                            className="text-sm text-app-t-primary px-4 border-2 border-app-tertiary min-w-24"
                            onPress={() => mutate()}
                        >
                            {
                                chatLoading ?
                                    <LuLoader className="animate-spin" /> :
                                    "Message"
                            }
                        </Button>

                    </div>
                </div>
            </div>

            {/* Follower/Following counts */}
            {/* <div className="flex justify-around">
                {['postsCount', 'followersCount', 'followingsCount'].map((item) => (
                    <div key={item} className="text-center">
                        <div className="">{profileDetails?.profile[item as keyof IUser]}</div>
                        <div className="bg-gray-800 rounded max-w-18 px-10 mb-1">{item}</div>
                    </div>
                ))}
            </div> */}

            <div className="flex justify-around">
                <div
                    className="text-center cursor-pointer relative"
                    onMouseEnter={() => setHoveredTab("followers")}
                    onMouseLeave={() => setHoveredTab(null)}
                >
                    <div>{profileDetails?.profile.followersCount || 0}</div>
                    <div className="bg-gray-800 rounded max-w-18 px-10 mb-1">Followers</div>

                    {hoveredTab === "followers" && (
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 bg-gray-900 text-white rounded-md shadow-lg w-60 max-h-64 overflow-y-auto z-50">
                            <div className="p-4">
                                <h4 className="font-semibold text-lg">Followers</h4>
                                {followersList.map((follower) => (
                                    <div key={follower._id} className="py-2 border-b border-gray-700">
                                        {follower._id}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
                <div
                    className="text-center cursor-pointer relative"
                    onMouseEnter={() => setHoveredTab("followings")}
                    onMouseLeave={() => setHoveredTab(null)}
                >
                    <div>{profileDetails?.profile.followingsCount || 0}</div>
                    <div className="bg-gray-800 rounded max-w-18 px-10 mb-1">Followings</div>

                    {hoveredTab === "followings" && (
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 bg-gray-900 text-white rounded-md shadow-lg w-60 max-h-64 overflow-y-auto z-50">
                            <div className="p-4">
                                <h4 className="font-semibold text-lg">Followings</h4>
                                {followingsList.map((following) => (
                                    <div key={following._id} className="py-2 border-b border-gray-700">
                                        {following._id}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>


            {/* Bio */}
            <div className="space-y-2">
                <p className="">{profileDetails?.profile.bio}</p>
                <div className="h-4 bg-gray-800 rounded w-3/6"></div>
                <div className="h-4 bg-gray-800 rounded w-4/6"></div>
            </div>

            {/* Story highlights */}
            <div className="flex space-x-4 overflow-x-auto py-2">
                {[...Array(5)].map((_, index) => (
                    <div key={index} className="flex-shrink-0">
                        <div className="w-16 h-16 rounded-full bg-gray-800"></div>
                        <div className="h-3 bg-gray-800 rounded w-12 mx-auto mt-1"></div>
                    </div>
                ))}
            </div>
        </div >
    )
}

export default ProfileData