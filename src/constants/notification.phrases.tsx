import { Link } from "react-router-dom";
import { NotificationKind } from "./notification";

const usernameClass: string = "hover:underline decoration-1 underline-offset-2 decoration-dotted";

export type INotificationPhrases = { // MAPPED OBJECT type
    [key in NotificationKind]: (actor: string) => JSX.Element;
};
// export type INotificationPhrases = Record<NotificationKind, (actor: string) => JSX.Element> // can be written like this

export const NotificationPhrases : INotificationPhrases = {
    comment: (actorUsername: string) => <>
        {/* <Link to={`/profile/@${actorUsername}`}> */}
            <b className={usernameClass}>
                {actorUsername}
            </b>
        {/* </Link> */}
        <br />commented on your post</>,

    like: (actorUsername: string) => <>
        {/* <Link to={`/profile/@${actorUsername}`}> */}
            <b className={usernameClass}>
                {actorUsername}
            </b>
        {/* </Link> */}
        <br />liked your post</>,

    follow: (actorUsername: string) => <>
        {/* <Link to={`/profile/@${actorUsername}`}> */}
            <b className={usernameClass}>
                {actorUsername}
            </b>
        {/* </Link> */}
        <br />started following you</>,

    mention: (actorUsername: string) => <>
        {/* <Link to={`/profile/@${actorUsername}`}> */}
            <b className={usernameClass}>
                {actorUsername}
            </b>
        {/* </Link> */}
        <br />mentioned you in a post</>,

    message: (actorUsername: string) => <>
        {/* <Link to={`/profile/@${actorUsername}`}> */}
            <b className={usernameClass}>
                {actorUsername}
            </b>
        {/* </Link> */}
        <br />sent you a message</>,

    follow_request: (actorUsername: string) => <>
            <b className={usernameClass}>
                {actorUsername}
            </b>
        <br />requested to follow you</>
};