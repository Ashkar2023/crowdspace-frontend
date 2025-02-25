import { FC, MouseEvent, useCallback, useEffect, useRef, useState } from "react";
import { Avatar, Image, useDisclosure } from "@nextui-org/react";
import { LuClipboardList, LuHeart, LuLoader, LuMessageCircle, LuShare } from "react-icons/lu";
import { formatDistance } from "date-fns";
import { useAppSelector } from "~hooks/useReduxHooks";
import { T_Post } from "~types/dto/post.dto";
import { useInfiniteQuery } from "@tanstack/react-query";
import fetchFeed from "~services/query/feed.queries";
import { buildImageUrl, buildPostUrl, getFallbackImage } from "~utils/url.builder";
import { PostViewModal } from "~components/modals/post-view-modal/post-view.modal";
import { useNavigate } from "react-router-dom";
import { useIntersection } from "~hooks/useIntersection";
import { AxiosError } from "axios";
import { protectedApi } from "~services/api/http";
import { notateNumber } from "~utils/number.notation";
import toast from "react-hot-toast";
import { toastSuccessTheme } from "~config/toastTheme.config";

const Feed: FC = () => {
    const navigate = useNavigate();
    const postContainerRef = useRef<HTMLDivElement>(null);
    const postsRef = useRef<T_Post[]>([]); // Use ref to hold the latest posts data
    const [posts, setPosts] = useState<T_Post[]>([]);
    const [activePost, setActivePost] = useState<T_Post | null>(null);

    const { data, isFetching, fetchNextPage, hasNextPage } = useInfiniteQuery({
        queryKey: ["feed"],
        queryFn: ({ pageParam }) => fetchFeed(pageParam),
        getNextPageParam: (lastPage) => lastPage.nextPageParam,
        initialPageParam: 1,
    });

    useEffect(() => {
        if (data?.pages) {
            postsRef.current = data.pages.flatMap((page) => page.body.posts);
            setPosts([...postsRef.current]); // Force state update for re-render
        }
    }, [data?.pages]);

    useEffect(() => {
        if (activePost) {
            postsRef.current = postsRef.current.map((post) =>
                post._id === activePost._id ? activePost : post
            );
            setPosts([...postsRef.current]); // Update state to reflect changes
        }
    }, [activePost]);

    const postViewModalDisclosure = useDisclosure({
        onClose() {
            setActivePost(null);
        },
    });

    const postModalOpenHandler = useCallback((event: MouseEvent<HTMLDivElement>) => {
        const clickedTarget = event.target as HTMLElement;
        const postCard = clickedTarget.closest(".post_card");
        const postIndex = postCard ? parseInt(postCard.getAttribute("data-index")!) : -1;

        if (postCard && postIndex !== -1) {
            setActivePost(postsRef.current[postIndex]);
            postViewModalDisclosure.onOpen();
        }

        if (
            clickedTarget.classList.contains("post-user-avatar") ||
            clickedTarget.classList.contains("post-username")
        ) {
            const postIndex = (clickedTarget.closest(".post") as HTMLElement)?.dataset.postIndex;
            if (postIndex !== undefined) {
                navigate(`/profile/@${postsRef.current[+postIndex].author.username}`);
            }
        }
    }, []);

    const likeHandler = useCallback(async (ev: globalThis.MouseEvent) => {
        const clickedTarget = ev.target as HTMLElement;
        const likeButton = clickedTarget.closest(".like_button");
        if (!likeButton) return;

        const index = parseInt(likeButton.getAttribute("data-index")!);
        const liked = likeButton.getAttribute("data-liked") === "true";

        try {
            if (liked) {
                await protectedApi.delete(`/posts/${postsRef.current[index]._id}/like`);
            } else {
                await protectedApi.post(`/posts/${postsRef.current[index]._id}/like`);
            }

            postsRef.current[index] = {
                ...postsRef.current[index],
                liked: !liked,
                likesCount: liked ? postsRef.current[index].likesCount - 1 : postsRef.current[index].likesCount + 1,
            };

            setPosts([...postsRef.current]); // Force re-render
        } catch (error) {
            if (error instanceof AxiosError && error.response?.status === 409) {
                console.log(error.message);
            }
        }
    }, []);

    const copyPostUrl = useCallback((ev: globalThis.MouseEvent) => {
        const target = ev.target as HTMLElement;
        const element = target.closest(".post_share") as HTMLElement;
        if (!element) return;

        const postIndex = parseInt(element.dataset.index!);

        navigator.clipboard.writeText(buildPostUrl(postsRef.current[postIndex].url));

        toast.success("Link copied!", {
            style: toastSuccessTheme,
            icon: <LuClipboardList color="gray" />,
        });
    }, []);

    /* FIX could completely unite the listeners */
    useEffect(() => {
        const container = postContainerRef.current;
        if (!container) return;

        container.addEventListener("click", likeHandler);
        container.addEventListener("click", copyPostUrl);
        console.log("Event listeners attached");

        return () => {
            container.removeEventListener("click", likeHandler);
            container.removeEventListener("click", copyPostUrl);
            console.log("Event listeners removed");
        };
    }, []);

    const { isVisible, observerRef } = useIntersection({
        root: postContainerRef.current,
        threshold: 0,
    })

    useEffect(() => {
        if (isVisible && hasNextPage && !isFetching) {
            fetchNextPage();
        }
    }, [isVisible])


    return (
        <>
            <PostViewModal activePost={activePost} disclosure={postViewModalDisclosure} setActivePost={setActivePost} />

            <div className="posts-container w-full" onClick={postModalOpenHandler} ref={postContainerRef}>
                {posts.map((post, index) => (
                    <div
                        key={post._id}
                        data-post-index={index}
                        ref={index === posts.length - 2 ? observerRef : null}
                        className="post bg-app-primary p-4 border-t-[0.5px] border-app-secondary"
                    >
                        <div className="flex space-x-3 post-user-data" data-username={post.author.username}>
                            <Avatar
                                src={buildImageUrl(post.author.avatar).href}
                                name={post.author.displayname}
                                showFallback
                                className="post-user-avatar border-[0.5px] border-app-tertiary cursor-pointer"
                            />
                            <div>
                                <h4 className="post-username font-medium text-sm cursor-pointer">{post.author.username}</h4>
                                <p className="text-xs text-app-t-secondary">
                                    {formatDistance(new Date(post.createdAt), Date.now(), { addSuffix: true })}
                                </p>
                            </div>
                        </div>

                        {post.media.length > 0 && (
                            <Image
                                src={buildImageUrl(post.media[0].media_url).href}
                                alt="Post media"
                                className="post_card"
                                data-index={index}
                                classNames={{
                                    wrapper: ["rounded-2xl", "min-w-fit", "ml-12", "mt-4", "bg-center", "bg-slate-300", "z-0"],
                                    img: ["max-w-fit", "max-h-80", "object-contain", "bg-black"],
                                }}
                                fallbackSrc={getFallbackImage("post").href}
                            />
                        )}

                        <div className="flex items-center justify-between pl-12">
                            <div className="px-2 space-y-2 text-app-t-secondary">
                                <button>
                                    <LuHeart
                                        size={20}
                                        className="like_button"
                                        data-liked={post.liked ? "true" : ""}
                                        data-index={index}
                                        fill={post.liked ? "red" : "transparent"}
                                        color={post.liked ? "red" : ""}
                                    />
                                </button>
                                <span className="text-sm align-super ml-1 mr-3">{notateNumber(post.likesCount)}</span>
                                <button>
                                    <LuMessageCircle size={20} className="post_card active:fill-slate-500" data-index={index} />
                                </button>
                                <span className="text-sm align-super ml-1 mr-3">{notateNumber(post.commentsCount)}</span>
                                <button>
                                    <LuShare size={20} className="post_share" data-index={index} />
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
                {
                    isFetching && (
                        <div className="h-8 my-2 content-center justify-items-center">
                            <LuLoader size='1.4em' color="gray" className="animate-spin" />
                        </div>
                    )
                }
            </div>
        </>
    );
};

export default Feed;