export const NotificationPhrases = {
    comment: (actorUsername: string) => `${actorUsername} commented on your post`,
    like: (actorUsername: string) => `${actorUsername} liked your post`,
    follow: (actorUsername: string) => `${actorUsername} started following you`,
    mention: (actorUsername: string) => `${actorUsername} mentioned you in a post`,
    message: (actorUsername: string) => `${actorUsername} sent you a message`
};