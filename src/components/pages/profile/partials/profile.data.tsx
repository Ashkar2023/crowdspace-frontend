import { Avatar, Button, useDisclosure } from "@nextui-org/react"
import { PressEvent } from "@react-types/shared"
import { Dispatch, FC, SetStateAction, useContext, useEffect, useState } from "react"
import toast from "react-hot-toast"
import { LuLoader, LuUserMinus, LuUserPlus } from "react-icons/lu"
import { protectedApi } from "~services/api/http"
import { ProfileStateType } from "~types/components/profile.types"
import { FollowStatus } from "~types/dto/follow.dto"
import { IFollows } from "../profile.page"
import { useNavigate, useParams } from "react-router-dom"
import { ChatContext } from "~/context/chatContext"
import { useMutation } from "@tanstack/react-query"
import { findOrCreateUserChat } from "~services/query/chat.queries"
import { useAppSelector } from "~hooks/useReduxHooks"
import { buildImageUrl } from "~utils/imageUrl"
import { IUser } from "~types/dto/user.dto"
import FollowListModal from "~components/modals/follows-list-modal/follow-list.modal"
import { useDispatch } from "react-redux"

type Props = {
    profileData: ProfileStateType | null,
    setProfileDetails: Dispatch<SetStateAction<ProfileStateType | null>>
}

const ProfileData: FC<Props> = ({ profileData, setProfileDetails }) => {
    const navigate = useNavigate();
    const { username } = useParams()
    const stateUsername = useAppSelector(state => state.user.username);
    const chatContext = useContext(ChatContext);

    const [openTab, setOpenTab] = useState<"followers" | "followings" | null>(null);
    const [chatLoading, setChatLoading] = useState<boolean>(false);

    const followHandler = async (e: PressEvent) => {
        try {
            /* handle current user profile */
            const { data, status } = profileData?.outgoingFollow?.status ?
                /* Hanlde remove follow request */
                await protectedApi.delete(`/users/${profileData?.profile._id}/follow`) :
                await protectedApi.post(`/users/${profileData?.profile._id}/follow`)

            data.success && toast.success(data.message, {
                duration: 1400,
                position: "top-right",
                icon: status === 201 ? <LuUserPlus /> : status === 200 ? <LuUserMinus /> : null,
                style: {
                    background: "var(--app-secondary)",
                    color: "var(--app-text-primary)",
                    border: "1px solid var(--app-tertiary)"
                }
            })

            data.success && setProfileDetails({
                ...profileData!,
                outgoingFollow: {
                    ...data.body
                }
            });

        } catch (error) {
            if (error instanceof Error)
                console.log(error.message)
        }
    }

    const followerId = profileData?.profile._id as string;
    const { mutate: fetchChatData, isIdle, isPending, isSuccess, data, } = useMutation({
        mutationKey: ["fetchChatDetail"],
        mutationFn: () => findOrCreateUserChat(followerId),
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

    const followListDisclosure = useDisclosure({
        defaultOpen: false
    })

    return (
        <div className="max-w-4xl p-4 space-y-4">
            {/* Profile header */}
            <div className="flex items-center space-x-4">
                {/* Profile picture */}
                <div className="size-32 aspect-square rounded-full overflow-clip bg-app-tertiary">
                    {
                        profileData?.profile?.avatar &&
                        <Avatar
                            src={buildImageUrl(profileData?.profile?.avatar).href}
                            name={profileData?.profile.displayname!}
                            showFallback
                            color="default"
                            className="h-full w-full"
                        />
                    }
                </div>

                {/* Username and buttons */}
                <div className="flex-1 space-y-2">
                    <h3 className="text-2xl font-medium">{profileData?.profile.username ?? "Crowdspace User"}</h3>
                    <div className="flex space-x-2">
                        {
                            username?.replace("@", "") !== stateUsername ?
                                <>
                                    <Button
                                        variant="solid"
                                        size="sm"
                                        className={`text-sm px-6 text-white ${profileData?.outgoingFollow?.status ? "bg-app-secondary" : "bg-app-accent"}`}
                                        onPress={followHandler}
                                    >
                                        {
                                            profileData?.outgoingFollow?.status === FollowStatus.active ?
                                                "Unfollow" :
                                                profileData?.outgoingFollow?.status === FollowStatus.pending ?
                                                    "Requested" :
                                                    "Follow"
                                        }
                                    </Button>
                                    <Button
                                        variant="light"
                                        size="sm"
                                        className="text-sm text-app-t-primary px-4 border-2 border-app-tertiary min-w-24"
                                        onPress={() => fetchChatData()}
                                    >
                                        {
                                            chatLoading ?
                                                <LuLoader className="animate-spin" /> :
                                                "Message"
                                        }
                                    </Button>
                                </>
                                :
                                <>
                                    <Button
                                        variant="light"
                                        size="sm"
                                        className="text-sm text-app-t-primary px-4 border-2 border-app-tertiary min-w-24"
                                        onPress={() => navigate("/settings/profile")}
                                    >
                                        Edit profile
                                    </Button>
                                    {/* <Button
                                        variant="light"
                                        size="sm"
                                        className="text-sm text-app-t-primary px-4 border-2 border-app-tertiary min-w-24"
                                    >
                                        share profile
                                    </Button> */}
                                </>
                        }
                    </div>
                </div>
            </div>


            {/* Bio */}
            <div className="">
                <p className="text-app-t-secondary">{profileData?.profile.bio}</p>
            </div>

            {/* Add links */}

            {/* Follower/Following counts */}
            <div className="flex justify-around">
                {
                    [
                        ['postsCount', "Post"],
                        ['followersCount', "Followers"],
                        ['followingsCount', "Followings"]
                    ].map(([item, title]) => {
                        if (item === "postsCount") {
                            return (
                                <div key={item} className="text-center">
                                    <b className="">{profileData?.profile.postsCount}</b><br />
                                    <p className="max-w-18 px-10 mb-1">
                                        {title}
                                    </p>
                                </div>
                            )
                        } else {
                            return (
                                <div key={item} className="text-center">
                                    <b className="">{profileData?.profile[item as keyof IUser] as string}</b>
                                    <br />
                                    <button
                                        className="max-w-18 px-10 mb-1 "
                                        onClick={() => { followListDisclosure.onOpenChange() }}
                                    >
                                        {title}
                                    </button>
                                </div>
                            )
                        }

                    })}
            </div>

            <FollowListModal
                disclosure={followListDisclosure}
                user_id={profileData?.profile?._id!}
            />

        </div>
    )
}

export default ProfileData