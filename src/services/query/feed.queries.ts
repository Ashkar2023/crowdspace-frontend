import { protectedApi } from '~services/api/http';
import { T_Post } from '~types/dto/post.dto';
import { computeNextPageParam } from '~utils/query.utils';

interface ApiResponse {
    body: {
        posts: T_Post[];
    }
}

const fetchFeed = async (pageParam: number) => {
    const response = await protectedApi.get<ApiResponse>('/posts', {
        params: {
            page: pageParam
        }
    });

    const nextPageParam = computeNextPageParam(response.data.body.posts.length, 5, pageParam );
    
    return { ...response.data, nextPageParam };
};

export default fetchFeed;