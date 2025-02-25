import { FC, useEffect, useRef } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import fetchFeed from "~services/query/feed.queries";
import { buildImageUrl } from "~utils/url.builder";
import { useIntersection } from "~hooks/useIntersection";

const ExplorePage: FC = () => {
    const {
        data,
        error,
        isFetching,
        fetchNextPage,
        hasNextPage,
    } = useInfiniteQuery({
        queryKey: ["feed"],
        queryFn: ({ pageParam }) => fetchFeed(pageParam),
        getNextPageParam: (lastPage) => lastPage.nextPageParam ?? undefined,
        initialPageParam: 1,
    });

    const observerRef = useRef<HTMLDivElement>(null);
    const { isVisible } = useIntersection({
        root: null,
        threshold: 0.1,
    });

    useEffect(() => {
        if (isVisible && hasNextPage && !isFetching) {
            fetchNextPage();
        }
    }, [isVisible, hasNextPage, isFetching]);

    if (isFetching && !data) return <div>Loading...</div>;
    if (error) return <div>Error loading posts</div>;

    return (
        <div className="p-12">
            <div className="grid grid-cols-3 gap-1">
                {data?.pages.flatMap((page) =>
                    page.body.posts.map((post) => (
                        <div key={post._id} className="relative aspect-square overflow-clip rounded-lg border border-app-tertiary">
                            {post.media.length > 0 && (
                                <img
                                    src={buildImageUrl(post.media[0].media_url).href}
                                    alt="Post media"
                                    className="w-full h-full object-cover"
                                />
                            )}
                        </div>
                    ))
                )}
            </div>
            <div ref={observerRef} className="h-1" />
        </div>
    );
};

export default ExplorePage;