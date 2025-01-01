import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Textarea, Input, button, Switch } from "@nextui-org/react";
import { FC, useState, useEffect, useCallback, memo, SetStateAction, Dispatch } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { LuUpload, LuSave, LuGlobe, LuCheck, LuX } from "react-icons/lu";
import { PostDataStateUpdateHandler, PostMetadata, PostType, PostVisibility } from "~types/components/post-modal.types";
import { mediaApi } from "~services/api/media.api";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import TagInput from "../post-create-modal/partials/tagInput";
import { T_Post } from "~types/dto/post.dto";
import { buildImageUrl } from "~utils/imageUrl";
import { toastErrorTheme, toastSuccessTheme } from "~config/toastTheme.config";
import { protectedApi } from "~services/api/http";

type Props = {
    isOpen: boolean,
    onClose: () => void,
    post: T_Post | undefined,
    setPosts: Dispatch<SetStateAction<T_Post[]>>
}


const initialPostDataState: PostMetadata = {
    caption: "",
    mentions: [],
    postType: PostType.TEXT,
    tags: [],
    visibility: PostVisibility.EVERYONE, /* CREATE the select option for visibility */
    location: undefined,
    thumbnail: undefined,
    files: null
};

const PostEditModal: FC<Props> = ({ isOpen, onClose, post, setPosts }) => {
    const [postDataState, setPostDataState] = useState<PostMetadata>(initialPostDataState);

    const { register, handleSubmit, setValue, trigger } = useForm<PostMetadata>();

    useEffect(() => {
        if (post) {
            setPostDataState({
                ...post,
                files: null
            })
        }
    }, [post])


    useEffect(() => {
        /* Bug in caption, visibility but tag seems fine double-check */
        setValue('caption', post?.caption ?? postDataState.caption)
        setValue('visibility', post?.visibility ?? postDataState.visibility)
        setValue('tags', post?.tags ?? postDataState.tags); // Register tags field

        if (!isOpen && post) {
            setPostDataState({ ...post, files: null });
        }
    }, [isOpen])

    const tagsStateUpdater: PostDataStateUpdateHandler = (key: "tags", value: string, type?: "remove" | "push", index?: number) => {
        setPostDataState(prev => {
            const newTagsArray: PostMetadata["tags"] = [...prev.tags];
            switch (type) {
                case "push":
                    newTagsArray.push(value[0]);
                    break;
                case "remove":
                    newTagsArray.splice(index as number, 1);
                    break;
            }
            setValue('tags', newTagsArray)
            return {
                ...prev,
                tags: newTagsArray
            };
        })
    }

    const onSubmit = async (values: FieldValues) => {
        try {
            console.log("values", values)

            if (values.visibility instanceof Boolean) {
                values.visibility = values.visibility ?
                    PostVisibility.FOLLOWERS_ONLY :
                    PostVisibility.EVERYONE;
            }
            const response = await protectedApi.patch(`/posts/${post?._id}`, values);

            response.data.success && toast.success("Post updated", {
                style: toastSuccessTheme,
                icon: <LuCheck />
            })

            if (!response.data.success) {
                return toast.error("Post updated", {
                    style: toastErrorTheme,
                    icon: <LuX />
                })
            }

            setPosts(prev => (prev.map((p, i) => { ////////////////////////////////
                console.log(prev);
                console.log(response.data.body);
                return p._id !== response.data.body.updatedPost._id ?
                    p :
                    {
                        ...response.data.body.updatedPost
                    }
            })));

            // setPostDataState(initialPostDataState)

            onClose();
        } catch (error) {
            if (error instanceof AxiosError) {
                toast.error(error.response?.data.message || "Failed to update post");
            }
        }
    };


    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            closeButton={<button>cancel</button>}
            backdrop="blur"
            size="lg"
            className="bg-app-secondary text-app-t-primary"
            classNames={{
                closeButton: ["hover:bg-red-500/10", "text-red-500", "rounded-xl", "py-1"]
            }}
            isDismissable={false}
            isKeyboardDismissDisabled={false}
        >
            <ModalContent className="pb-2">
                <ModalHeader>
                    <h3>Edit Post</h3>
                </ModalHeader>
                <ModalBody>
                    <div className="flex gap-2 mt-4 max-w-full overflow-y-scroll" id="">
                        {post?.media.map((m, i) => {
                            return <img
                                className="h-24 max-w-28 rounded-xl object-cover"
                                src={buildImageUrl(m.media_url)}
                                key={i}
                                alt={`File ${i + 1}`}
                            />
                        })}
                    </div>

                    <div>
                        <Textarea
                            label="Caption"
                            {...register("caption")}
                            variant="bordered"
                            className="mb-4"
                        />
                        <div className="flex mb-3 ms-1">
                            <h3 className="text-md">Everyone</h3>
                            <Switch
                                size="sm"
                                {...register("visibility")}
                                isSelected={postDataState.visibility === PostVisibility.FOLLOWERS_ONLY ? true : false}
                                onValueChange={(bool) => {
                                    if (bool) {
                                        setPostDataState({ ...postDataState, visibility: PostVisibility.FOLLOWERS_ONLY })
                                    } else {
                                        setPostDataState({ ...postDataState, visibility: PostVisibility.EVERYONE })
                                    }
                                }}
                                classNames={{
                                    wrapper: ["ms-2"]
                                }}
                            />
                            <h3 className="text-md">Followers</h3>
                        </div>
                        <TagInput
                            postDataState={postDataState}
                            updatePostDataState={tagsStateUpdater}
                        />
                        <Button
                            onClick={(e) => handleSubmit(onSubmit)()}
                            color="primary" radius="md" className="flex place-self-end">
                            Update
                        </Button>

                    </div>
                </ModalBody>
            </ModalContent>
        </Modal >
    );
};

export default PostEditModal;