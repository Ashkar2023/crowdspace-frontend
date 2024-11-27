import { Outlet } from "react-router-dom"
import { FC, useRef } from "react"
import type { onCloseRef } from "~components/modals/post-create-modal/post-create.modal"
import PostModal from "~components/modals/post-create-modal/post-create.modal"
import { useDisclosure } from "@nextui-org/react"
import Navbar from "~components/navbar"



export const HomeLayout: FC = () => {
    const setModalStateRef = useRef<onCloseRef>(null);

    const { isOpen, onOpenChange, onClose} = useDisclosure({
        onClose: setModalStateRef.current?.reset
    });

    return (
        <div className="md:grid md:grid-cols-[3fr_9fr] min-h-screen bg-app-primary text-app-t-primary">
            <Navbar
                togglePostModal={onOpenChange}
                postDisabled={false}
            />
            <div className="flex flex-col max-h-dvh overflow-y-scroll border-l border-app-tertiary">
                <Outlet />
            </div>
            <PostModal isOpen={isOpen} onOpenChange={onOpenChange} onClose={onClose} ref={setModalStateRef} />
        </div>
    )
}
