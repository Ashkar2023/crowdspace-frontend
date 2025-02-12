import { protectedApi } from "~services/api/http";
import { IBasicUser } from "~types/dto/user.dto";

interface response {
    body: {
        results: IBasicUser[]
    }
}

export const searchQueryFetch = async (query: string) => {
    query = query.trim();
    if (!query) return;

    const encodedQuery = encodeURIComponent(query);
    return (await protectedApi.get<response>(`/search?q=${encodedQuery}`)).data;
}