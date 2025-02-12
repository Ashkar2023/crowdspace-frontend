import { Avatar, Button } from "@nextui-org/react";
import { useCallback, useContext, useEffect } from "react";
import toast from "react-hot-toast";
import { LuX, LuVideo } from "react-icons/lu";
import { useLocation, useNavigate } from "react-router-dom";
import { SocketContext } from "~/context/socketContext";
import { SocketEvents } from "~constants/socket.events";
import { useAppSelector } from "~hooks/useReduxHooks";
import { IncomingCallData } from "~types/context/socketContext.types";
import { INotification } from "~types/dto/notification.dto";
import { buildImageUrl } from "~utils/imageUrl";
import { type INotificationPhrases, NotificationPhrases } from "~constants/notification.phrases";
import { NotificationKind } from "~constants/notification";
import { toastSuccessTheme } from "~config/toastTheme.config";

export const SocketEventsMounter = () => {
    const stateUserId = useAppSelector(state => state.user._id);
    const { Socket: socketInstance } = useContext(SocketContext);
    const navigate = useNavigate();
    const location = useLocation();

    const incomingCallHandler = useCallback(({ roomId, userBasic, receiverId }: IncomingCallData) => {

        toast((t) => (
            <div className="text-center mobile:min-w-60">
                <Avatar
                    src={buildImageUrl(userBasic.avatar).href}
                    name={userBasic.displayname}
                    className="mx-auto size-20 w-20 h-20 m-4 rounded-full place-self-center"
                    showFallback
                />
                <h1 className="font-semibold text-xl">{userBasic.username}</h1>
                <p className="font-extralight">incoming video call</p>
                <div className="space-x-2 content-center mt-3">
                    <Button
                        isIconOnly
                        color="danger"
                        className="text-inherit"
                        size="lg"
                        onClick={(e) => {
                            socketInstance?.emit(SocketEvents.call_decline, roomId);
                            toast.dismiss(t.id);
                        }}
                    ><LuX size={20} /></Button>
                    <Button
                        isIconOnly
                        className="text-inherit"
                        color="success"
                        size="lg"
                        onClick={async (e) => {
                            toast.dismiss(t.id);
                            navigate(`/call/${roomId}?receiver=${receiverId}`);
                        }}
                    ><LuVideo size={20} /></Button>
                </div>
            </div>
        ), {
            duration: 30 * 1000,
            style: toastSuccessTheme
        });
    }, [socketInstance]);

    const notify = useCallback(({ actor, ...notification }: INotification) => {

        if (
            location.pathname.includes("/messages") &&
            notification.type === NotificationKind.message
        ) return;

        /* 
            CHANGE
            my idea was to update the store state followers count here by dispatching event
            But then i thought that i should fetch the user profile for the logged in user also, so there wont be a need of managing store state
            But for optimization i can chose to use useQuery and its cache, -
            and invalidate the cached by setting the cache to "stale", when an inbound activity like follow / unfollow happens
         */

        toast((t) => (
            <div className="mobile:min-w-60 flex gap-2">
                <Avatar
                    src={buildImageUrl(actor.avatar!).href}
                    className="size-8 rounded-full bg-app-tertiary"
                    showFallback
                    name={actor.displayname}
                />
                <p className="font-extralight text-sm">
                    {NotificationPhrases[notification.type as keyof INotificationPhrases](actor.username)}
                </p>
            </div>
        ), {
            duration: 3000,
            style: toastSuccessTheme,
            position: "bottom-right"
        });

    }, [socketInstance, location])


    useEffect(() => {
        socketInstance?.on(SocketEvents.call_incoming, incomingCallHandler);
        socketInstance?.on("notification", notify);

        return () => {
            socketInstance?.off(SocketEvents.call_incoming, incomingCallHandler)
            socketInstance?.off("notification", notify);
        }
    }, [socketInstance, notify])

    return null
}
