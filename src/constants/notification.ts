export const NOTIFICATION_ITEMS = Object.freeze([
    "likes",
    "comments",
    "follows",
    "messages",
    "stories",
    "posts",
    "liveStream"
]);

export enum NotificationKind {
    follow = "follow",
    like = "like",
    comment = "comment",
    mention = "mention",
    message="message"
}