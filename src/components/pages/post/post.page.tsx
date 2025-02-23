import { FC, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@nextui-org/react';
import { fetchPost } from '~services/query/post.queries';
import { PostCommentsViewPartial } from '~components/modals/post-view-modal/partials/post-comments.view';
import { PostMediaViewPartial } from '~components/modals/post-view-modal/partials/post-media.view';
import { T_Post } from '~types/dto/post.dto';
import { AxiosError } from 'axios';

const PostPage: FC = () => {
    const { post_url } = useParams<{ post_url: string }>();
    const [activePost, setActivePost] = useState<T_Post | null>(null);

    const { data: post, isFetching, error } = useQuery<T_Post, AxiosError>({
        queryKey: ["post", post_url],
        queryFn: () => fetchPost(post_url!),
        enabled: !!post_url,
        retry: 1
    });

    useEffect(() => {
        if (post) {
            setActivePost(post);
        }

        return () => {
            setActivePost(null)
        }
    }, [post])

    if (isFetching) {
        return (
            <div className="h-full gap-1 py-12 place-content-center w-4/6 mx-auto">
                <div className='h-full flex gap-2'>
                    <Skeleton className="w-2/3 rounded-lg" />
                    <Skeleton className="w-1/3 rounded-lg" />
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-red-500">{error.status === 401 ? "This post is private" : "Unable to load the post. Please try again"}</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-[6fr_4fr] place-content-center w-4/6 mx-auto h-full rounded-xl">
            {
                activePost &&
                <>
                    <PostMediaViewPartial activePost={activePost} setActivePost={setActivePost} rounded />
                    <PostCommentsViewPartial activePost={activePost} setActivePost={setActivePost} rounded />
                </>
            }
        </div>
    );
};

export default PostPage;