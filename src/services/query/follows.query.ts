import axios, { AxiosResponse } from 'axios';
import { activeTab } from '~components/modals/follows-list-modal/follow-list.modal';
import { protectedApi } from '~services/api/http';
import { IFollow } from '~types/dto/follow.dto';
import { IBasicUser } from '~types/dto/user.dto';

interface ApiResponse<T> {
    body: T
    message: string;
    success: boolean;
    nextPageParam: number
}

export const fetchFollowers = async (pageParam: number = 0, activeTab: activeTab, userId: string) => {
    const response = await protectedApi
        .get<ApiResponse<IFollow & { follower_info: IBasicUser }[]>>(`/users/${userId}/${activeTab}`, {
            params: { page: pageParam }
        });
    return { ...response.data, nextPageParam: ++pageParam };
};

export const fetchFollowings = async (pageParam: number = 0, activeTab: activeTab, userId: string) => {
    const response = await protectedApi
        .get<ApiResponse<IFollow & { followee_info: IBasicUser }[]>>(`/users/${userId}/${activeTab}`, {
            params: { page: pageParam }
        });
    return { ...response.data, nextPageParam: response.data.body.length < pageParam ? null : ++pageParam };
};