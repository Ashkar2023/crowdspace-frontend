import { protectedApi } from '~services/api/http';
import { INotification } from '~types/dto/notification.dto';
import { T_Post } from '~types/dto/post.dto';

interface ApiResponse {
    body: {
        notifications: INotification[],
        count: number
    }
}

const fetchNotifications = async () => {
    const response = await protectedApi.get<ApiResponse>('/notifications');
    return response.data;
};

export default fetchNotifications;