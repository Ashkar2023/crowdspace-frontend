import { FC } from "react";
import { useQuery } from "@tanstack/react-query";
import fetchFeed from "~services/query/feed.queries";
import { buildImageUrl } from "~utils/imageUrl";

const ExplorePage: FC = () => {
    const { data, error, isFetching } = useQuery({
        queryKey: ['feed'],
        queryFn: fetchFeed
    });

    if (isFetching) return <div>Loading...</div>;
    if (error) return <div>Error loading posts</div>;

    return ( //direclty rendering the grid without the aside component for recommendations so no need of the intermediary page
        <div
            className="grid grid-cols-3 gap-1 p-12"
        >
            {data?.body.posts.map((post) => (
                <div key={post._id} className="relative aspect-square overflow-clip rounded-lg border-1 border-app-tertiary">
                    {post.media.length > 0 && (
                        <img
                            src={buildImageUrl(post.media[0].media_url)}
                            alt="Post media"
                            className="w-full h-full object-cover"
                        />
                    )}
                </div>
            ))}
        </div>
    );
};

export default ExplorePage;