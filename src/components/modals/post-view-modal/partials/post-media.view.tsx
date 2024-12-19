import { Button } from "@nextui-org/react"
import { PressEvent } from "@react-types/shared"
import { FC, useState } from "react"
import { LuChevronLeft, LuChevronRight, LuHeart } from "react-icons/lu"
import { protectedApi } from "~services/api/http"
import { T_Post } from "~types/dto/post.dto"

type Props = {
    activePost: T_Post | null
}
export const PostMediaViewPartial: FC<Props> = ({ activePost }) => {
    const [index, setIndex] = useState<number>(0);

    /** 
     * REMOVE this is a temporary setup until the current user actions on the post are aggregated with the posts fetch
     * take aggregated "like" data of user on the post to show liked or not
    */
    const [liked, setLiked] = useState<boolean>(false);

    const postsURLs = activePost?.media.map((media, index) => {
        return new URL(media.media_url, "http://localhost:4100");
    })

    const likeHandler = async (e: PressEvent) => {
        try {
            const { data: { body }, status } = liked ?
                await protectedApi.delete(`/posts/${activePost?._id}/like`) : //if success return 204 NO CONTENT - means no body
                await protectedApi.post(`/posts/${activePost?._id}/like`);

            if (body?.action === "liked" && status === 201) {
                setLiked(true)
            } else if (status === 204 || status === 409) {
                setLiked(false)
            }
        } catch (error) {
            if (error instanceof Error) {
                console.log(error.message)
            }
        }
    }

    return (
        <div className='flex relative group align-middle bg-black max-h-[650px]'>
            {
                postsURLs?.length! > 1 &&
                <div className="absolute hidden justify-between group-hover:flex w-full h-20 top-1/2 -translate-y-1/2 px-4">
                    <button
                        className="rounded-md hover:bg-gray-500/20 border-1.5 border-app-tertiary p-3 self-center"
                        onClick={() => setIndex(prev => {
                            if (index !== 0) {
                                return prev - 1;
                            }
                            return prev
                        })}
                    >
                        <LuChevronLeft />
                    </button>

                    <button
                        className="rounded-md hover:bg-gray-500/20 border-1.5 border-app-tertiary p-3 self-center"
                        onClick={() => setIndex(prev => {
                            if (index !== (postsURLs?.length! - 1)) {
                                return prev + 1;
                            }
                            return prev
                        })}>
                        <LuChevronRight />
                    </button>
                </div>
            }

            <div className="absolute group-hover:flex justify-start hidden w-full h-12 px-2 gap-2 content-center bg-transparent bottom-0">
                <Button
                    isIconOnly
                    className="bg-transparent"
                    radius="lg"
                    onPress={likeHandler}
                >
                    <LuHeart size={20} className={liked ? "text-red-500 fill-red-500" : "text-slate-50"} />
                </Button>
                <p className="content-center">{activePost?.caption}</p>
            </div>

            <img src={postsURLs![index].href} alt="activePost" className="object-contain" />
        </div>
    )
}
