import { Button } from "@nextui-org/react"
import { PressEvent } from "@react-types/shared"
import { AxiosError } from "axios"
import { act, Dispatch, FC, useEffect, useState } from "react"
import { LuChevronLeft, LuChevronRight, LuHeart } from "react-icons/lu"
import { protectedApi } from "~services/api/http"
import { T_Post } from "~types/dto/post.dto"
import { buildImageUrl } from "~utils/imageUrl"

type Props = {
    activePost: T_Post | null
    setActivePost: Dispatch<React.SetStateAction<T_Post | null>>
}
export const PostMediaViewPartial: FC<Props> = ({ activePost, setActivePost }) => {
    const [index, setIndex] = useState<number>(0);
    const [postsURLs, setPostURLs] = useState<URL[]>([]);
    const [liked, setLiked] = useState<boolean>(activePost?.liked!);

    useEffect(() => {
        const mappedUrls: URL[] = [];

        activePost?.media.forEach((media, index) => {
            const url = buildImageUrl(media.media_url);
            mappedUrls.push(url);
        })
        setPostURLs(mappedUrls);
    }, []);

    const likeHandler = async (e: PressEvent) => {
        let like = liked;
        try {
            const { data: { body }, status } = liked ?
                await protectedApi.delete(`/posts/${activePost?._id}/like`) : //if success return 204 NO CONTENT - means no body
                await protectedApi.post(`/posts/${activePost?._id}/like`);

            if (body?.action === "liked" && status === 201) {
                like = true
            } else if (status === 204) {
                like = false
            }

        } catch (error) {
            if (error instanceof AxiosError) {
                if(error.status === 409){
                    console.log(error.message)
                    like = false;
                }
            }
        }finally{
            setLiked(like)
            setActivePost(prev => prev ? ({
                ...prev,
                liked: like,
                likesCount: like ? ++prev.likesCount : --prev.likesCount
            }) : prev)
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

            {
                postsURLs.length > 0 &&
                <img src={postsURLs![index].href} alt="activePost" className="object-contain" />
            }
        </div>
    )
}
