import { FC, MouseEvent, useCallback, useEffect, useRef, useState } from "react";
import { Avatar, Image, useDisclosure } from "@nextui-org/react";
import { LuClipboardList, LuHeart, LuLoader, LuMessageCircle, LuShare } from "react-icons/lu";
import { formatDistance } from "date-fns";
import { useAppSelector } from "~hooks/useReduxHooks";
import { T_Post } from "~types/dto/post.dto";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
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
    const userState = useAppSelector((state) => state.user);
    const navigate = useNavigate();
    const postContainerRef = useRef<HTMLDivElement>(null);

    const [posts, setPosts] = useState<T_Post[]>([]);
    const [activePost, setActivePost] = useState<T_Post | null>(null)

    const { data, error, isFetching, fetchNextPage, hasNextPage } = useInfiniteQuery({
        queryKey: ['feed'],
        queryFn: ({ pageParam }) => fetchFeed(pageParam),
        getNextPageParam(lastPage, allPages) {
            return lastPage.nextPageParam
        },
        initialPageParam: 1,
    });

    useEffect(() => {
        if (data?.pages) {
            setPosts(data?.pages.reduce<T_Post[]>((acc, cur) => acc.concat(cur.body.posts), []))
        }
    }, [data])

    useEffect(() => {
        if (activePost) {
            setPosts(prev => {
                return prev.map(post => post._id === activePost._id ? activePost : post);
            })
        }
    }, [activePost])

    const postViewModalDisclosure = useDisclosure({
        onClose() {
            setActivePost(null);
        },
    })

    const postModalOpenHandler = useCallback((event: MouseEvent<HTMLDivElement>) => { //changed the type here to generic to remove the need for ref
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
    }, [data])

    const likeHandler = useCallback(async function (e: globalThis.MouseEvent) {
        const clickedTarget = e.target as HTMLElement;
        const likeButton = clickedTarget.closest(".like_button");
        const liked = likeButton?.getAttribute("data-liked");
        const index = parseInt(likeButton?.getAttribute("data-index") as string);
        let like = Boolean(liked);

        try {
            const { data: { body }, status } = liked ?
                await protectedApi.delete(`/posts/${posts[index]._id}/like`) : //if success return 204 NO CONTENT - means no body
                await protectedApi.post(`/posts/${posts[index]._id}/like`);

            if (body?.action === "liked" && status === 201) {
                like = true
            } else if (status === 204) {
                like = false
            }

        } catch (error) {
            if (error instanceof AxiosError) {
                if (error.status === 409) {
                    console.log(error.message)
                    like = false;
                }
            }
        } finally {
            setPosts(prev => prev.map((post, i) => i === index ? { ...post, liked: like, likesCount: like ? ++post.likesCount : --post.likesCount } : post));
        }
    }, [data])

    const copyPostUrl = useCallback((ev: globalThis.MouseEvent) => {
        const target = ev.target as HTMLElement;
        const element = target.closest(".post_share") as HTMLElement;
        const postIndex = parseInt(element.dataset.index!);

        navigator.clipboard.writeText(new URL("p/" + posts[postIndex].url, import.meta.env.VITE_API_URL).href);

        toast.success("Link copied!", {
            style: toastSuccessTheme,
            icon: <LuClipboardList color="green"/>
        })
    }, [data]);

    /* FIX could completely unite the listeners */
    useEffect(() => {
        postContainerRef.current?.addEventListener("click", likeHandler)
        postContainerRef.current?.addEventListener("click", copyPostUrl)
        console.log("likehandler set")
        return () => {
            postContainerRef.current?.removeEventListener("click", likeHandler)
            postContainerRef.current?.removeEventListener("click", copyPostUrl)
            console.log("likehadler removed")
        }
    }, [likeHandler, copyPostUrl])

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
            <PostViewModal
                activePost={activePost}
                disclosure={postViewModalDisclosure}
                setActivePost={setActivePost}
            />

            <div
                className="posts-container w-full"
                onClick={(e) => postModalOpenHandler(e)}
                ref={postContainerRef}
            >
                {posts.map((post, index) => (
                    /* 
                        FIX. USE virtualized lists 
                        use a single post-index. try to make the data-attributes more perfect
                    */
                    <div
                        key={post._id}
                        data-post-index={index} //for user profile fetching
                        ref={index === posts.length - 2 ? observerRef : null}
                        className="post bg-app-primary p-4 border-t-[0.5px] border-app-secondary"
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
                                <h4 className="post-username font-medium text-sm post-username cursor-pointer">{post.author.username}</h4>
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
                                    wrapper: ["rounded-2xl", "min-w-fit", "ml-12", "mt-4", "bg-center", "bg-slate-300", "bg-blend-multiply", "bg-no-repeat"],
                                    img: ["max-w-fit", "max-h-80", "object-contain", "bg-black", "z-0"]
                                }}
                                fallbackSrc={getFallbackImage("post").href}
                            />
                        )}

                        {/* Bottom ACTION BAR */}
                        <div className="flex items-center justify-between pl-12">
                            <div className="px-2 space-y-2 text-app-t-secondary">
                                <button>
                                    <LuHeart size={20}
                                        className="like_button active:scale-125 transition-transform duration-[50ms]"
                                        data-liked={post.liked ? "true" : ""} // "" for falsy value
                                        data-index={index} // "" for falsy value
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