import { Image, useDisclosure } from "@nextui-org/react"
import { FC, Suspense, useCallback, useEffect, useRef, useState } from "react"
import { BiDotsVerticalRounded } from "react-icons/bi"
import { PostViewModal } from "~components/modals/post-view-modal/post-view.modal"
import { T_Post } from "~types/dto/post.dto"

type Props = {
    posts: T_Post[], // Give valid type
}

const ProfilePosts: FC<Props> = ({ posts }) => {
    const [activePost, setActivePost] = useState<T_Post | null>(null);
    const postsWrapperRef = useRef<HTMLDivElement>(null);

    const disclosure = useDisclosure({
        defaultOpen: false
    })


    const handleClick = useCallback((event: MouseEvent) => {
        const clickedTarget = event.target as HTMLElement;
        const postCard = clickedTarget.closest(".post_card");

        if (postCard) {
            const postIndex = parseInt(postCard.getAttribute("data-index")!);
            setActivePost(posts[postIndex]);
            disclosure.onOpen();
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
            <PostViewModal disclosure={disclosure} activePost={activePost} />
            <div className="flex flex-wrap gap-4 mx-auto mb-8" ref={postsWrapperRef}>
                {posts &&
                    posts.map((post, index) => {
                        const imgUrl = new URL(post.media[0].media_url, "http://localhost:4100")

                        return (
                            <div
                                key={index}
                                className="relative size-72 group self-center items-center rounded-3xl bg-black overflow-hidden post_card"
                                data-index={index}
                            >

                                <button className="absolute right-4 top-4 hidden group-hover:block rounded-lg bg-gray-500/30 p-1 hover:bg-slate-700/50">
                                    <BiDotsVerticalRounded className="" size={18} />
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