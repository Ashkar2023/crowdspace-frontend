import { FC, MouseEvent, RefObject, useCallback, useEffect, useRef, useState } from "react";
import { Avatar, Image, useDisclosure } from "@nextui-org/react";
import { LuHeart, LuMessageCircle, LuShare } from "react-icons/lu";
import { formatDistance } from "date-fns";
import { useAppSelector } from "~hooks/useReduxHooks";
import { T_Post } from "~types/dto/post.dto";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import fetchFeed from "~services/query/feed.queries";
import { buildImageUrl, getFallbackImage } from "~utils/imageUrl";
import { PostViewModal } from "~components/modals/post-view-modal/post-view.modal";
import { useNavigate, useOutletContext } from "react-router-dom";

const Feed: FC = () => {
    const userState = useAppSelector((state) => state.user);
    const navigate = useNavigate();
    // const postContainerRef = useRef<HTMLDivElement>(null);
    const { postContainerRef } = useOutletContext<{ postContainerRef: RefObject<HTMLDivElement> }>()

    const [posts, setPosts] = useState<T_Post[]>([]);
    const [activePost, setActivePost] = useState<T_Post | null>(null)

    const { data, error, isFetching, fetchNextPage } = useInfiniteQuery({
        queryKey: ['feed'],
        queryFn: ({ pageParam }) => fetchFeed(pageParam),
        getNextPageParam(lastPage, allPages) {
            return lastPage.nextPageParam
        },
        initialPageParam: 1
    });

    useEffect(() => {
        console.log(data)
        if (data?.pages) {
            setPosts(data?.pages.reduce<T_Post[]>((acc, cur) => acc.concat(cur.body.posts), []))
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

        /* routing for click on avatar & usename */
        if (clickedTarget.classList.contains("post-user-avatar") || clickedTarget.classList.contains("post-username")) {
            const postIndex = (clickedTarget.closest(".post") as HTMLElement).dataset.postIndex;
            navigate(`/profile/@${posts[+postIndex!].author.username}`);
        }
    }, [posts])

    // SHOULD remove this logic and fix the UI and rewrite appropriately
    const captureScrollEndHandler = (ev: Event) => {
        const el = ev.target as HTMLDivElement;
        ev.stopPropagation()

        fetchNextPage()
    }

    useEffect(() => {
        console.log("p", postContainerRef.current)
        // postContainerRef.current?.addEventListener("scrollend", captureScrollEndHandler, { capture: true })
        window.addEventListener("scrollend", captureScrollEndHandler, { capture: true })

        return () => {
            // postContainerRef.current?.removeEventListener("scrollend", captureScrollEndHandler, { capture: true })
            window.removeEventListener("scrollend", captureScrollEndHandler, { capture: true })
        }
    }, [])

    return (
        <>
            <PostViewModal
                activePost={activePost}
                disclosure={postViewModalDisclosure}
            />

            <div
                className="posts-container w-full"
                onClick={(e) => handleClick(e)}
                ref={postContainerRef}
            >
                {posts.map((post, index) => (
                    <div
                        key={post._id}
                        data-post-index={index}
                        className="post bg-app-primary p-4 shadow-md border-t-[0.5px] border-app-secondary"
                    >

                        {/* USER info */}
                        <div className="flex space-x-3 post-user-data" data-username={post.author.username}>
                            <Avatar
                                src={buildImageUrl(post.author.avatar).href}
                                name={post.author.displayname}
                                showFallback
                                className="post-user-avatar border-[0.5px] border-app-tertiary  cursor-pointer"
                            />
                            <div>
                                <h4 className="post-username font-medium text-sm username cursor-pointer">{post.author.username}</h4>
                                <p className="text-xs text-app-t-secondary">
                                    {formatDistance(new Date(post.createdAt), Date.now(), { addSuffix: true })}
                                </p>
                            </div>
                        </div>

                        {/* MEDIA  */}
                        {post.media.length > 0 && (
                            <Image
                                src={buildImageUrl(post.media[0].media_url).href}
                                alt="Post media"
                                className="post_card" // this classname is crucial here for setting the activePost
                                data-index={index}
                                loading="eager"
                                classNames={{
                                    wrapper: ["min-h-80", "min-w-fit", "ml-12", "mt-4", "bg-center", "bg-slate-300 bg-blend-multiply", "bg-no-repeat"],
                                    img: ["max-w-fit", "max-h-80", "object-contain", "bg-black", "z-0"]
                                }}
                                fallbackSrc={getFallbackImage("post").href}
                            />
                        )}

                        {/* Bottom ACTION BAR */}
                        <div className="flex items-center justify-between pl-12">
                            <div className="px-2 space-y-2 space-x-3 text-app-t-secondary">
                                <button className="">
                                    <LuHeart size={20}
                                        className=""
                                        fill={post.liked ? "red" : "transparent"}
                                        color={post.liked ? "red" : ""}
                                    />
                                </button>
                                <button className="">
                                    <LuMessageCircle size={20} className="" />
                                </button>
                                <button className="">
                                    <LuShare size={20} className="" />
                                </button>
                            </div>
                            <div>
                                {/* <button className="me-2 my-2">
                                <LuBookmark size={20} className="text-app-t-primary" />
                            </button> */}
                            </div>
                        </div>
                        <p className="mt-2 pl-12 font-light text-small ms-2 text-app-t-secondary">{post.caption}</p>
                    </div>
                ))}
            </div>
        </>
    );
};

export default Feed;