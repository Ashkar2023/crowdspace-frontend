import { act, FC, useState } from "react"
import { LuMoveLeft, LuMoveRight } from "react-icons/lu"
import { T_Post } from "~types/dto/post.dto"

type Props = {
    activePost: T_Post | null
}
export const PostMediaViewPartial: FC<Props> = ({ activePost }) => {
    const [index, setIndex] = useState<number>(0);

    const postsURLs = activePost?.media.map((media, index) => {
        return new URL(media.media_url, "http://localhost:4100");
    })

    return (
        <div className='flex relative group align-middle bg-black max-h-[650px]'>
            {
                postsURLs?.length! > 1 &&
                <div className="absolute hidden group-hover:flex justify-between w-full h-20 top-1/2 -translate-y-1/2 px-4">
                    <button
                        className="rounded-md hover:bg-gray-500/40 p-4 self-center"
                        onClick={() => setIndex(prev => {
                            if (index !== 0) {
                                return prev - 1;
                            }
                            return prev
                        })}
                    >
                        <LuMoveLeft />
                    </button>

                    <button
                        className="rounded-md hover:bg-gray-500/40 p-4 self-center"
                        onClick={() => setIndex(prev => {
                            if (index !== (postsURLs?.length! - 1)) {
                                return prev + 1;
                            }
                            return prev
                        })}>
                        <LuMoveRight className="group" />
                    </button>
                </div>
            }

            <img src={postsURLs![index].href} alt="activePost" className="object-contain" />
        </div>
    )
}
