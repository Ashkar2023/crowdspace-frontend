import { Modal, ModalBody, ModalContent } from "@nextui-org/react"
import type { UseDisclosureReturn } from "@nextui-org/use-disclosure"
import { PostMediaViewPartial } from "./partials/post-media.view"
import { PostCommentsViewPartial } from "./partials/post-comments.view"
import { FC } from "react"
import { T_Post } from "~types/dto/post.dto"

type Props = {
    disclosure: UseDisclosureReturn,
    activePost: T_Post | null
}

export const PostViewModal: FC<Props> = ({ disclosure, activePost }) => {


    return (
        <Modal
            isOpen={disclosure.isOpen}
            onOpenChange={disclosure.onOpenChange}

            size="3xl"
            hideCloseButton={true}
            isDismissable={true}
            backdrop="blur"
            className="bg-app-secondary text-app-t-primary"
            classNames={{
                wrapper: ["overflow-x-visible",],
            }}
        >
            <ModalContent className="h-[650px]">
                {(onClose) => (
                    <div
                        className="grid grid-cols-[3fr_2fr] h-full gap-0 p-0 overflow-y-auto"
                    >
                        <PostMediaViewPartial activePost={activePost} />

                        <PostCommentsViewPartial activePost={activePost} />

                    </div>

                )}
            </ModalContent>
        </Modal>
    )
}
