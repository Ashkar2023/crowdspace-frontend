import { FC, useEffect, useState } from "react"
import { PostCommentInputPartial } from "./post-comment.input"
import { T_Post } from "~types/dto/post.dto"
import { protectedApi } from "~services/api/http"
import { IComment } from "~types/dto/comment.dto"
import { IUser, IUserState } from "~types/dto/user.dto"

type Props = {
    activePost: T_Post | null
}

export const PostCommentsViewPartial: FC<Props> = ({ activePost }) => {
    const [comments, setComments] = useState<(IComment & IUser)[]>([])

    useEffect(() => {
        (async function () {
            try {
                const {data} = await protectedApi.get(`/posts/${activePost?._id}/comments`)
                console.log(data.body);
                setComments(data.body.comments)
            } catch (error) {
                console.log(error)
            }
        })()
    }, [activePost])

    return (
        <div className="flex flex-col border-s border-app-tertiary">
            <div className="bg-app-accent flex-grow">
                { 
                    comments.map((value,index)=>(
                        <div></div>
                    ))
                }
            </div>

            <PostCommentInputPartial post_id={activePost?._id!} />
        </div>
    )
}
