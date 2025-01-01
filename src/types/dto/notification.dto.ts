import { NotificationKind } from "~constants/notification"
import { IBasicUser } from "./user.dto"

export type INotification = {
    type: NotificationKind,
    actor: IBasicUser,
    is_read: boolean,
    recipient_id: string,
    /**
     * the target Id of the notification
     * the actual comment/like or follow request.
     */
    target: string
}