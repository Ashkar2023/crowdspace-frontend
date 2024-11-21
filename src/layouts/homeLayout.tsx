import { Outlet } from "react-router-dom"
import Navbar from "../components/navbar"
import { FC, useEffect, useRef } from "react"
import type { onCloseRef } from "~components/modal/post.modal"
import PostModal from "~components/modal/post.modal"
import { useDisclosure } from "@nextui-org/react"



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
            <div className="flex flex-col items-center mx-32">
                <Outlet />
            </div>
            <PostModal isOpen={isOpen} onOpenChange={onOpenChange} onClose={onClose} ref={setModalStateRef} />
        </div>
    )
}
