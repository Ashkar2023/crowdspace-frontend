import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@nextui-org/react";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import type { ForwardRefRenderFunction } from "react";
import { GrFormPrevious, GrFormNext } from "react-icons/gr";
import { LuUpload } from "react-icons/lu";
import FileUploadSelector from "~/atomic-components/post-modal/fileUploadSelector";
import PostSubmitForm from "~/atomic-components/post-modal/postSubmitForm";
import PostTypeSelector from "~/atomic-components/post-modal/postTypeSelector";
import { PostDataStateUpdateHandler, PostWizardStages, PostMetadata, PostType, PostVisibility } from "~types/components/post-modal.types";
import type { PressEvent } from "@react-types/shared";
import { mediaApi } from "~services/api/media.api";
import toast from "react-hot-toast";

type CustomProps = {
    isOpen: boolean,
    onClose: () => void,
    onOpenChange: (isOpen: boolean) => void,
}

export type onCloseRef = {
    reset: () => void
}

const initialPostDataState: PostMetadata = {
    caption: "",
    mentions: [],
    postType: PostType.TEXT,
    tags: [],
    visibility: PostVisibility.EVERYONE,
    location: undefined,
    thumbnail: undefined,
    files: null
};

const PostModal: ForwardRefRenderFunction<onCloseRef, CustomProps> = ({ isOpen, onOpenChange, onClose }, ref) => {
    const [postWizardState, setPostWizardState] = useState<PostWizardStages>(PostWizardStages.SELECT_TYPE);
    const [postDataState, setPostDataState] = useState<PostMetadata>({ ...initialPostDataState });

    useImperativeHandle(ref,()=>{
        return {
            reset(){
                setPostDataState(initialPostDataState);
                setPostWizardState(PostWizardStages.SELECT_TYPE);
            }
        }
    })

    const updatePostDataState: PostDataStateUpdateHandler = (key, value, type?: "remove" | "push", index?: number) => {
        if (["tags", "mentions"].includes(key) && Array.isArray(value)) {
            setPostDataState(prev => {
                const updatedArray = Array.from(prev[key] as string[]);
                switch (type) {
                    case "remove":
                        updatedArray.splice(index!, 1);
                        break;
                    case "push":
                        updatedArray.push(value[0] as string);
                        break;
                }
                return { ...prev, [key]: updatedArray }
            })
        } else {
            setPostDataState((prev) => ({ ...prev, [key]: value }));
        }
    }

    const goNext = () => {
        setPostWizardState(prevState => {
            switch (prevState) {
                case PostWizardStages.SELECT_TYPE:
                    if (postDataState.postType === PostType.MEDIA) {
                        return PostWizardStages.SELECT_FILES;
                    } else {
                        return PostWizardStages.INPUT_METADATA;
                    }

                case PostWizardStages.SELECT_FILES:
                    if (postDataState.files?.length) {
                        return PostWizardStages.INPUT_METADATA;
                    } else {
                        toast.error("select atleast 1 image")
                    }

                default:
                    return prevState;
            }
        })
    }

    const goBack = () => {
        setPostWizardState(prevState => {
            switch (prevState) {
                case PostWizardStages.INPUT_METADATA:
                    if (postDataState.postType === PostType.TEXT) {
                        return PostWizardStages.SELECT_TYPE;
                    } else {
                        return PostWizardStages.SELECT_FILES;
                    }

                case PostWizardStages.SELECT_FILES:
                    setPostDataState(prev => ({
                        ...prev,
                        files: null,
                        thumbnail: undefined
                    }))
                    return PostWizardStages.SELECT_TYPE;

                default:
                    return prevState;
            }
        })
    }


    const submitHandler = async () => {
        try {
            const postData = new FormData();

            // Setting the formdata
            Object.entries(postDataState).forEach(([key, value], index) => {
                if (key === "files" && value instanceof FileList) {
                    Array.from(value).forEach((file, index) => {
                        postData.append("media", file);
                    })
                } else if (Array.isArray(value)) {
                    value.forEach((v, index) => {
                        postData.append(key, v);
                    })
                } else {
                    postData.append(key, String(value));
                }
            })

            const response = await mediaApi.post("/posts", postData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });

        } catch (error) {
            if (error instanceof Error) {
                console.log(error);
            }
        }
    }

    const nextOrSubmit = (e: PressEvent) => {
        postWizardState === PostWizardStages.INPUT_METADATA ?
            submitHandler() :
            goNext();
    }

    return (
        <Modal
            isOpen={isOpen}

            backdrop="blur"
            classNames={{
                /* Hack-fix for rendering artifact white-line corners in dark mode */
                /* "base" is same as ModalContent */
                base: ["bg-app-secondary"],
                // wrapper: ["animate-slideDown"],
            }}
            placement="top"
            size="lg"
            radius="lg"

            onClose={onClose}
            onOpenChange={onOpenChange}
            isDismissable={false}
        // hideCloseButton={true}
        >
            <ModalContent className="shadow-none">
                {(onClose) => (
                    <ModalBody className="text-app-t-primary">
                        <ModalHeader className="p-1 w-full">
                            <h3 className="text-lg w-full text-center">Create Post</h3>
                        </ModalHeader>

                        <ModalBody className="">

                            {(() => {
                                switch (postWizardState) {
                                    case PostWizardStages.SELECT_TYPE:
                                        return <PostTypeSelector updatePostDataState={updatePostDataState} postDataState={postDataState} />;

                                    case PostWizardStages.SELECT_FILES:
                                        return <FileUploadSelector updatePostDataState={updatePostDataState} postDataState={postDataState} />;

                                    case PostWizardStages.INPUT_METADATA:
                                        return <PostSubmitForm updatePostDataState={updatePostDataState} postDataState={postDataState} />
                                }

                            })()}

                        </ModalBody>

                        <ModalFooter className="p-2 w-full">
                            <Button
                                size="sm"
                                isDisabled={postWizardState === PostWizardStages.SELECT_TYPE ? true : false}
                                color="danger"
                                radius="md"
                                onPress={goBack}
                            >
                                <GrFormPrevious />
                                Back
                            </Button>

                            <Button
                                size="sm"
                                color="primary"
                                radius="md"
                                onPress={nextOrSubmit}
                            >
                                {
                                    postWizardState === PostWizardStages.INPUT_METADATA ?
                                        <>
                                            Submit
                                            <LuUpload />
                                        </>
                                        :
                                        <>
                                            Next
                                            <GrFormNext />
                                        </>
                                }
                            </Button>
                        </ModalFooter>
                    </ModalBody>
                )}
            </ModalContent>
        </Modal >
    )
}

export default forwardRef(PostModal)