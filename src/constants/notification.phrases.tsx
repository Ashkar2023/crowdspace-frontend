import { NotificationKind } from "./notification";
import { followRequestStatus, INotification } from "~types/dto/notification.dto";
import FollowRequestButton from "~components/ui/followRequest.button";

const usernameClass: string = "hover:underline decoration-1 underline-offset-2 decoration-dotted";

export function isFollowRequestNotification(type: NotificationKind): type is NotificationKind.followRequest {
    return type === NotificationKind.followRequest;
}

// export type INotificationPhrases = Record<NotificationKind, (actor: string) => JSX.Element> // can be written like this

export type INotificationPhrases = { // MAPPED OBJECT type
    [key in NotificationKind]: key extends NotificationKind.followRequest ?
    (followDoc: INotification) => JSX.Element :
    (actor: string) => JSX.Element
};

export const NotificationPhrases: INotificationPhrases = {
    comment: (actorUsername) => <>
        <b className={usernameClass}>
            {actorUsername}
        </b>
        <br />commented on your post</>,

    like: (actorUsername) => <>
        <b className={usernameClass}>
            {actorUsername}
        </b>
        <br />liked your post</>,

    follow: (actorUsername) => <>
        <b className={usernameClass}>
            {actorUsername}
        </b>
        <br />started following you</>,

    mention: (actorUsername) => <>
        <b className={usernameClass}>
            {actorUsername}
        </b>
        <br />mentioned you in a post</>,

    message: (actorUsername) => <>
        <b className={usernameClass}>
            {actorUsername}
        </b>
        <br />sent you a message</>,

    follow_request: (followNotf: INotification) => {

        if(followNotf.type !== NotificationKind.followRequest){
            throw new Error("follow request type does not match");
        }

        const statusMap: Record<followRequestStatus, string> = {
            [followRequestStatus.accepted]: "requested accepted",
            [followRequestStatus.declined]: "request declined",
            [followRequestStatus.pending]: "requested to follow you",
        }

        return (
            <div className="flex justify-between pe-2">
                <div className="">
                    <b className={usernameClass}>
                        {followNotf.actor.username}
                    </b>
                    <p>
                        {
                            followNotf.status && statusMap[followNotf.status]
                        }
                    </p>
                </div>
                <FollowRequestButton followNotf={followNotf} />
                {/* //FIX by status! --> status calling the follow request on the type with condition in socketEventsMounter  */}
            </div>
        )

    }

};