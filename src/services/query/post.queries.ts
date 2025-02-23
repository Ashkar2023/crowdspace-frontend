import { Query, QueryFunction } from '@tanstack/react-query';
import { protectedApi } from '~services/api/http';
import { T_Post } from '~types/dto/post.dto';
import { computeNextPageParam } from '~utils/query.utils';

interface ApiResponse {
    body: {
        post: T_Post;
    }
}

export const fetchPost = async (post_id: string): Promise<T_Post> => {
    const response = await protectedApi.get<ApiResponse>(`/post/${post_id}`);

    return response.data.body.post;
};