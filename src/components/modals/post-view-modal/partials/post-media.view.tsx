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
        <div className='flex relative align-middle bg-black'>
            {
                postsURLs?.length! > 1 &&
                <div className="absolute flex justify-between w-full max-h-full h-20 top-1/2 -translate-y-1/2">
                    <button onClick={() => setIndex(prev => {
                        if (index !== 0) {
                            return prev - 1;
                        }
                        return prev
                    })}
                    >
                        <LuMoveLeft />
                    </button>

                    <button onClick={() => setIndex(prev => {
                        if (index !== (postsURLs?.length! - 1)) {
                            return prev + 1;
                        }
                        return prev
                    })}>
                        <LuMoveRight />
                    </button>
                </div>
            }
            <img src={postsURLs![index].href} alt="activePost" className="object-contain" />
        </div>
    )
}
