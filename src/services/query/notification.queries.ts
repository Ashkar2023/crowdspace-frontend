import { protectedApi } from '~services/api/http';
import { INotification } from '~types/dto/notification.dto';
import { T_Post } from '~types/dto/post.dto';

export interface fetchNotificationApiResponse {
    body: {
        notifications: INotification[],
        count: number
    },
    success:boolean,
    message:string
}

const fetchNotifications = async () => {
    const response = await protectedApi.get<fetchNotificationApiResponse>('/notifications');
    return response.data;
};

export default fetchNotifications;