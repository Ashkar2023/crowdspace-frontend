import { AxiosResponse } from 'axios';
import { activeTab } from '~components/modals/follows-list-modal/follow-list.modal';
import { protectedApi } from '~services/api/http';
import { IFollow, IFollowee, IFollower } from '~types/dto/follow.dto';
import { INotification } from '~types/dto/notification.dto';
import { computeNextPageParam } from '~utils/query.utils';

interface ApiResponse<T> {
    body: T
    message: string;
    success: boolean;
}

interface PaginatedApiResponse<T> extends ApiResponse<T> {
    nextPageParam: number | null
}

export const fetchFollowers = async (pageParam: number = 0, activeTab: activeTab, userId: string): Promise<PaginatedApiResponse<IFollower[]>> => {
    const response = await protectedApi
        .get<PaginatedApiResponse<IFollower[]>>(`/users/${userId}/${activeTab}`, {
            params: { page: pageParam }
        });

    const nextPageParam = computeNextPageParam(response.data.body.length, 6, pageParam);
    return { ...response.data, nextPageParam };
};

export const fetchFollowings = async (pageParam: number = 0, activeTab: activeTab, userId: string): Promise<PaginatedApiResponse<IFollowee[]>> => {
    const response = await protectedApi
        .get<PaginatedApiResponse<IFollowee[]>>(`/users/${userId}/${activeTab}`, {
            params: { page: pageParam }
        });
    const nextPageParam = computeNextPageParam(response.data.body.length, 6, pageParam);
    return { ...response.data, nextPageParam };
};

export const acceptFollowRequest = async (followNotf: INotification): Promise<ApiResponse<IFollow>> => {
    console.log("id", followNotf.target)
    const response = await protectedApi.patch(`/users/${followNotf.target}/accept`, {
        followerId: followNotf.actor._id,
    })
    console.log("id", followNotf.target)

    return response.data
}