import { FC, useCallback, useEffect, useRef, useState } from "react"
import { PostCommentInputPartial } from "./post-comment.input"
import { T_Post } from "~types/dto/post.dto"
import { protectedApi } from "~services/api/http"
import { IComment } from "~types/dto/comment.dto"
import { IBasicUser, IUser } from "~types/dto/user.dto"
import { Avatar, Button } from "@nextui-org/react"
import { LuCheck, LuTrash } from "react-icons/lu"
import { useAppSelector } from "~hooks/useReduxHooks"
import { PressEvent } from "@react-types/shared"
import toast from "react-hot-toast"
import { formatDistance } from "date-fns"
import { buildImageUrl } from "~utils/imageUrl"

type Props = {
    activePost: T_Post | null
}

export type ICommentWithAuthor = IComment & {
    author: IBasicUser
}

export const PostCommentsViewPartial: FC<Props> = ({ activePost }) => {
    const loggedInUserId = useAppSelector((state) => state.user._id);
    const commentsWrapper = useRef<HTMLDivElement>(null);

    const [comments, setComments] = useState<(ICommentWithAuthor)[]>([])
    const [replyFor, setReplyFor] = useState<ICommentWithAuthor | null>(null);
    const [editComment, setEditComment] = useState<ICommentWithAuthor | null>(null);

    useEffect(() => {
        (async function () {
            try {
                const { data } = await protectedApi.get(`/posts/${activePost?._id}/comments`)

                setComments(data.body.comments);

            } catch (error) {
                console.log(error)
            }
        })()

        return () => {
            setComments([]);
        }
    }, [])

    const replyAndEditClickListener = useCallback((e: MouseEvent) => {
        const clickedElement = e.target as HTMLElement;
        const dataset_index = clickedElement.dataset.cindex;
        const parsedIndex = parseInt(dataset_index as string, 10);

        if (clickedElement.id === "reply_button" && !isNaN(parsedIndex)) {
            setEditComment(null);
            setReplyFor(comments[parsedIndex]);
        } else if (clickedElement.id === "edit_button" && !isNaN(parsedIndex)) {
            setReplyFor(null);
            setEditComment(comments[parsedIndex]);
        }

    }, [comments]);

    useEffect(() => {
        commentsWrapper.current?.addEventListener("click", replyAndEditClickListener);

        return () => {
            commentsWrapper.current?.removeEventListener("click", replyAndEditClickListener);
        }
    }, [replyAndEditClickListener])

    const deleteCommentHandler = async (commentId: string) => {
        try {
            const { data } = await protectedApi.delete(`/comments/${commentId}`);

            if (data.success) {

                const filteredComments = comments.filter((comment, index, commentsArray) => {
                    return commentId !== comment._id;
                })

                toast.success(data.message, {
                    duration: 1400,
                    position: "bottom-right",
                    icon: <LuCheck />,
                    style: {
                        background: "var(--app-secondary)",
                        color: "var(--app-text-primary)",
                        border: "1px solid var(--app-tertiary)"
                    }
                })
                setComments(filteredComments);
                setReplyFor(null)
                setEditComment(null);
            }
        } catch (error) {
            if (error instanceof Error) console.log(error.message);
        }
    };

    return (
        <div className="flex flex-col border-s border-app-tertiary h-full">
            <div
                className="bg-gradient-to-b from-app-tertiary to-app-secondary h-[610px] overflow-y-scroll"
                ref={commentsWrapper}
            >
                {
                    comments.map((comment, index) => (
                        <div
                            key={comment._id}
                            className="p-4 border-b bg-transparent border-gray-700"
                        >
                            <div className="flex items-start gap-3">
                                <Avatar
                                    src={buildImageUrl(comment.author?.avatar)}
                                    name={comment.author.displayname}
                                    showFallback
                                />
                                <div className="flex-1 max-w-44">
                                    <p className="mb-1 text-sm text-app-t-primary/65 font-light">
                                        <span className="text-app-t-primary text-base font-semibold mr-2">
                                            {comment.author?.username}
                                        </span>
                                        {comment.commentBody}
                                    </p>
                                    <section className="font-light flex gap-2">
                                        <p className="text-xs text-app-t-secondary inline">{formatDistance(new Date(comment.createdAt), Date.now(), { addSuffix: true })}</p>
                                        {
                                            !comment.replyFor &&
                                            <button
                                                className="text-xs text-app-t-secondary"
                                                id="reply_button"
                                                data-cindex={index.toString()}>
                                                reply
                                            </button>
                                        }
                                        {
                                            (loggedInUserId === comment.author._id) ?
                                                <button
                                                    className="text-xs text-app-t-secondary"
                                                    id="edit_button"
                                                    data-cindex={index.toString()}>
                                                    edit
                                                </button>
                                                :
                                                null
                                        }
                                    </section>
                                </div>
                                {
                                    /* CHANGE the unknown later as author will be populated. so use will be comment.author._id */
                                    (loggedInUserId === comment.author as unknown) ?
                                        (<Button
                                            isIconOnly
                                            className="bg-transparent comment-delete-button"
                                            size="sm"
                                            onClick={(e) => deleteCommentHandler(comment._id)}
                                        >
                                            <LuTrash color="red" />
                                        </Button>) :
                                        null
                                }
                            </div>
                        </div>
                    ))
                }
            </div>

            <PostCommentInputPartial
                post_id={activePost?._id!}
                editComment={editComment}
                setComments={setComments}
                replyFor={replyFor}
                setEditComment={setEditComment}
                setReplyFor={setReplyFor}
            />
        </div>
    )
}
