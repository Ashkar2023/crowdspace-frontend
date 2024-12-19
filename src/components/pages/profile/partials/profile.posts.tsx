import { useDisclosure } from "@nextui-org/react"
import { FC, useCallback, useEffect, useRef, useState } from "react"
import { BiDotsVerticalRounded } from "react-icons/bi"
import { PostActionsModal } from "~components/modals/post-actions-modal/post-actions-list.modal"
import { PostViewModal } from "~components/modals/post-view-modal/post-view.modal"
import { T_Post } from "~types/dto/post.dto"
import { ReportTargets } from "~types/dto/report.dto"

type Props = {
    posts: T_Post[], // Give valid type
}

const ProfilePosts: FC<Props> = ({ posts }) => {
    const [activePost, setActivePost] = useState<T_Post | null>(null);
    const postsWrapperRef = useRef<HTMLDivElement>(null);

    const postViewModalDisclosure = useDisclosure({
        defaultOpen: false,
        onClose() {
            setActivePost(null);
        }
    })

    const postActionsModalDisclosure = useDisclosure({
        defaultOpen: false,
        onClose() {
            setActivePost(null)
        }
    })

    const handleClick = useCallback((event: MouseEvent) => {
        const clickedTarget = event.target as HTMLElement;
        const postCard = clickedTarget.closest(".post_card");
        const postIndex = parseInt(postCard?.getAttribute("data-index")!);

        if (clickedTarget.classList.contains("post-actions")) {
            setActivePost(posts[postIndex]);
            postActionsModalDisclosure.onOpen();
            return
        }

        if (postCard) {
            setActivePost(posts[postIndex]);
            postViewModalDisclosure.onOpen();
        }
    }, [posts])

    useEffect(() => {

        postsWrapperRef.current?.addEventListener("click", handleClick)

        return () => {
            postsWrapperRef.current?.removeEventListener("click", handleClick)
        }
    }, [posts])

    return (
        <>
            <PostViewModal disclosure={postViewModalDisclosure} activePost={activePost} /> {/* Set active post to context */}

            <PostActionsModal
                disclosure={postActionsModalDisclosure}
                activeTargetId={activePost?._id as T_Post["_id"]}
                reportTargetType={ReportTargets.POST}
            />

            <div className="flex flex-wrap gap-4 mx-auto mb-8" ref={postsWrapperRef}>
                {posts &&
                    posts.map((post, index) => {
                        const imgUrl = new URL(post.media[0].media_url, "http://localhost:4100")

                        return (
                            <div
                                key={index}
                                className="relative size-72 group self-center items-center border-1 border-app-secondary rounded-3xl bg-black overflow-hidden post_card"
                                data-index={index}
                            >

                                <button className="absolute right-4 top-4 hidden group-hover:block rounded-lg bg-gray-500/30 p-1 hover:bg-slate-700/50 post-actions">
                                    <BiDotsVerticalRounded className="text-slate-200 post-actions" size={18} />
                                </button>

                                <img
                                    src={imgUrl.href}
                                    className="h-full object-cover"
                                />

                            </div>
                        )
                    })}
            </div>
        </>
    )
}

export default ProfilePosts