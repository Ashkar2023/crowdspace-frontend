import { protectedApi } from '~services/api/http';
import { T_Post } from '~types/dto/post.dto';

interface ApiResponse {
    body:{
        posts: T_Post[];
    }
}

const fetchFeed = async () => {
    const response = await protectedApi.get<ApiResponse>('/posts');
    return response.data;
};

export default fetchFeed;