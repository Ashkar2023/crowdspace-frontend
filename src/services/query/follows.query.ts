import { activeTab } from '~components/modals/follows-list-modal/follow-list.modal';
import { protectedApi } from '~services/api/http';
import { IFollowee, IFollower } from '~types/dto/follow.dto';

interface ApiResponse<T> {
    body: T
    message: string;
    success: boolean;
    nextPageParam: number | null
}

export const fetchFollowers = async (pageParam: number = 0, activeTab: activeTab, userId: string): Promise<ApiResponse<IFollower[]>> => {
    const response = await protectedApi
        .get<ApiResponse<IFollower[]>>(`/users/${userId}/${activeTab}`, {
            params: { page: pageParam }
        });
    return { ...response.data, nextPageParam: ++pageParam };
};

export const fetchFollowings = async (pageParam: number = 0, activeTab: activeTab, userId: string): Promise<ApiResponse<IFollowee[]>> => {
    const response = await protectedApi
        .get<ApiResponse<IFollowee[]>>(`/users/${userId}/${activeTab}`, {
            params: { page: pageParam }
        });
    return { ...response.data, nextPageParam: response.data.body.length < pageParam ? null : ++pageParam };
};