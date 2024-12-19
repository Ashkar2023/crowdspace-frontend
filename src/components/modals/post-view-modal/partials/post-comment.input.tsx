import { Button, Input } from "@nextui-org/react";
import { FC, useState } from "react";
import { LuCheck, LuMessageCircle, LuPenSquare, LuReply, LuXCircle } from "react-icons/lu";
import { protectedApi } from "~services/api/http";
import { IComment } from "~types/dto/comment.dto";
import { IUser } from "~types/dto/user.dto";
import { ICommentWithAuthor } from "./post-comments.view";
import { useMutation } from "@tanstack/react-query";
import { patchComment } from "~services/query/comment.queries";
import toast from "react-hot-toast";
import { toastTheme as customToastTheme } from "~/config/toast.config";

type Props = {
    post_id: string,
    setComments: React.Dispatch<React.SetStateAction<(IComment & {
        author: IUser;
    })[]>>,
    replyTo: ICommentWithAuthor | null,
    setReplyTo: React.Dispatch<React.SetStateAction<ICommentWithAuthor | null>>,
    editComment: ICommentWithAuthor | null,
    setEditComment: React.Dispatch<React.SetStateAction<ICommentWithAuthor | null>>
}

export const PostCommentInputPartial: FC<Props> = ({ post_id, setComments, replyTo, setReplyTo, editComment, setEditComment }) => {
    const [commentBody, setCommentBody] = useState<string>("");

    const { mutate } = useMutation({
        mutationFn: patchComment,
        onSettled(data, error, variables, context) {
            const message = data?.message ?? error?.message;

            toast[data ? "success" : "error"](message, {
                style: customToastTheme,
                icon: <LuCheck />,
                position: 'bottom-right'
            });

            if (error) {

            } else {
                const { updatedComment } = data.body;
                setComments(prev => {
                    const newCommentList = prev.map((c, i) => c._id === updatedComment._id ? { ...updatedComment } : c);
                    return newCommentList
                })
            }

            setEditComment(null);
            setCommentBody("");
        },
    })

    const commentSubmitHandler = async () => {
        try {
            const { data } = await protectedApi.post(`/comments`, {
                commentBody: commentBody,
                post_id,
            });

            if (data.success) {
                setComments(prev => {
                    return [data.body.comment, ...prev]
                })
                setReplyTo(null);
                setCommentBody("")
            }
        } catch (error) {
            console.log(error)
        }
    };

    return (
        <div className="flex relative h-[9%] px-2">
            {
                replyTo &&
                <div className="absolute -top-10 w-4/5 flex rounded-xl bg-app-tertiary px-2">
                    <LuReply size={20} className="self-center me-2" />
                    <div className="flex-grow">
                        <h4 className="inline">{replyTo.author.username || "username"}</h4>
                        <p className="flex max-w-full overflow-clip text-sm text-app-t-secondary">{replyTo.commentBody.slice(0, 45)}</p>
                    </div>
                    <LuXCircle className="self-center cursor-pointer" color="red" onClick={() => setReplyTo(null)} />
                </div>
            }
            {
                editComment &&
                <div className="absolute -top-10 w-4/5 flex rounded-xl bg-app-tertiary px-2">
                    <LuPenSquare size={20} className="self-center me-2" />
                    <div className="flex-grow">
                        <h4 className="inline">Edit comment</h4>
                        <p className="flex max-w-full overflow-clip text-sm text-app-t-secondary">{editComment.commentBody.slice(0, 45)}</p>
                    </div>
                    <LuXCircle className="self-center cursor-pointer hover:ring-1 ring-red-500/45  rounded-full" color="red" onClick={() => setEditComment(null)} />
                </div>

            }
            <div className="flex gap-2 w-full items-center">
                <Input
                    variant="bordered"
                    classNames={{
                        inputWrapper: 'border-1'
                    }}
                    value={commentBody}
                    onChange={(e) => { setCommentBody(e.target.value) }}
                    placeholder="add comment..."
                />
                <Button
                    isIconOnly
                    onPress={() => editComment ?
                        mutate({
                            commentId: editComment._id,
                            commentBody // coming from component state
                        })
                        :
                        commentSubmitHandler()}
                    color="primary"
                >
                    <LuMessageCircle size={18} />
                </Button>
            </div>
        </div>
    )
}
