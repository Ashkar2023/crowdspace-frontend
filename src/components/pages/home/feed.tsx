import { FC, MouseEvent, useCallback, useEffect, useState } from "react";
import { Avatar, Image, useDisclosure } from "@nextui-org/react";
import { LuHeart, LuMessageCircle, LuShare } from "react-icons/lu";
import { formatDistance } from "date-fns";
import { useAppSelector } from "~hooks/useReduxHooks";
import { T_Post } from "~types/dto/post.dto";
import { useQuery } from "@tanstack/react-query";
import fetchFeed from "~services/query/feed.queries";
import { buildImageUrl, getFallbackImage } from "~utils/imageUrl";
import { PostViewModal } from "~components/modals/post-view-modal/post-view.modal";

const Feed: FC = () => {
    const userState = useAppSelector((state) => state.user);
    const [posts, setPosts] = useState<T_Post[]>([]);
    const [activePost, setActivePost] = useState<T_Post | null>(null)

    const { data, error, isFetching } = useQuery({
        queryKey: ['feed'],
        queryFn: fetchFeed,
    });

    useEffect(() => {
        if (data?.body.posts) {
            setPosts(data?.body.posts)
        }
    }, [data])

    const postViewModalDisclosure = useDisclosure({
        onClose() {
            setActivePost(null);
        },
    })

    const handleClick = useCallback((event: MouseEvent<HTMLDivElement>) => { //changed the type here to generic to remove the need for ref
        const clickedTarget = event.target as HTMLElement;
        const postCard = clickedTarget.closest(".post_card");
        const postIndex = parseInt(postCard?.getAttribute("data-index")!);

        // // post actions 
        // if (clickedTarget.classList.contains("post-actions")) {
        //     setActivePost(posts[postIndex]);
        //     postActionsModalDisclosure.onOpen();
        //     return
        // } 

        if (postCard) {
            setActivePost(posts[postIndex]);
            postViewModalDisclosure.onOpen();
        }
    }, [posts])

    return (
        <>
            <PostViewModal
                activePost={activePost}
                disclosure={postViewModalDisclosure}
            />

            <div className="w-full" onClick={(e) => handleClick(e)}>
                {data?.body.posts.map((post, index) => (
                    <div key={post._id} className="bg-app-primary p-4 shadow-md border-t-[0.5px] border-app-secondary">

                        {/* USER info */}
                        <div className="flex space-x-4">
                            <Avatar
                                src={buildImageUrl(post.author.avatar)}
                                name={post.author.displayname}
                                showFallback
                                className="border-[0.5px] border-app-tertiary"
                            />
                            <div>
                                <h4 className="font-medium text-sm">{post.author.username}</h4>
                                <p className="text-xs text-app-t-secondary">
                                    {formatDistance(new Date(post.createdAt), Date.now(), { addSuffix: true })}
                                </p>
                            </div>
                        </div>

                        {/* MEDIA  */}
                        {post.media.length > 0 && (
                            <Image
                                src={buildImageUrl(post.media[0].media_url)}
                                alt="Post media"
                                className="post_card" // this classname is crucial here for setting the activePost
                                data-index={index}
                                loading="eager"
                                classNames={{
                                    wrapper: ["min-h-80", "min-w-fit", "mt-4", "bg-center", "bg-slate-300 bg-blend-multiply", "bg-no-repeat"],
                                    img: ["max-w-fit", "max-h-80", "object-contain", "bg-black","z-0"]
                                }}
                                fallbackSrc={getFallbackImage("post")}
                            />
                        )}

                        {/* Bottom ACTION BAR */}
                        <div className="flex items-center justify-between">
                            <div className="px-2 space-y-2 space-x-3">
                                <button className="">
                                    <LuHeart size={20} className="text-app-t-primary" />
                                </button>
                                <button className="">
                                    <LuMessageCircle size={20} className="text-app-t-primary" />
                                </button>
                                <button className="">
                                    <LuShare size={20} className="text-app-t-primary" />
                                </button>
                            </div>
                            <div>
                                {/* <button className="me-2 my-2">
                                <LuBookmark size={20} className="text-app-t-primary" />
                            </button> */}
                            </div>
                        </div>
                        <p className="mt-2 ms-2 text-app-t-secondary">{post.caption}</p>
                    </div>
                ))}
            </div>
        </>
    );
};

export default Feed;