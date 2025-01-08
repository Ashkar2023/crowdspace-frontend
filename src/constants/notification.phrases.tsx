import { Link } from "react-router-dom";

const usernameClass: string = "hover:underline decoration-1 underline-offset-2 decoration-dotted";

export const NotificationPhrases = {
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
        <br />sent you a message</>
};