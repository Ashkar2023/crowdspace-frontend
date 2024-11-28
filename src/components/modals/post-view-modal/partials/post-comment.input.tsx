import { Button, Input } from "@nextui-org/react"
import { FC, useCallback, useState } from "react"
import type { PressEvent } from "@react-types/shared"
import { LuMessageCircle } from "react-icons/lu";
import { mediaApi } from "~services/api/media.api";
import { protectedApi } from "~services/api/http";

type Props = {
    post_id: string
}

export const PostCommentInputPartial: FC<Props> = ({ post_id }) => {
    const [comment, setComment] = useState<string>("");

    const commentSubmitHandler = useCallback(async (e: PressEvent) => {
        try {
            const { data } = await protectedApi.post(`/comments`, {
                commentBody: comment,
                post_id,
            });

            console.log(data)
        } catch (error) {
            console.log(error)
        }
    }, [post_id]);

    return (
        <div className="p-2">
            <div className="flex gap-2">
                <Input
                    variant="bordered"
                    classNames={{}}
                    value={comment}
                    onChange={(e) => { setComment(e.target.value) }}
                    placeholder="add comment..."
                />
                <Button
                    isIconOnly
                    onPress={commentSubmitHandler}
                    value={comment}
                >
                    <LuMessageCircle size={18} />
                </Button>
            </div>
        </div>
    )
}
