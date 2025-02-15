import { protectedApi } from '~services/api/http';
import { T_Post } from '~types/dto/post.dto';

interface ApiResponse {
    body: {
        posts: T_Post[];
    }
}

const fetchFeed = async (pageParam: number) => {
    console.log("from fetch",pageParam)
    const response = await protectedApi.get<ApiResponse>('/posts', {
        params: {
            page: pageParam
        }
    });
    return { ...response.data, nextPageParam: ++pageParam };
};

export default fetchFeed;