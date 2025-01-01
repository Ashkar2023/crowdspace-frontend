import { Outlet, useLocation } from "react-router-dom"
import { FC, useEffect, useRef, useState } from "react"
import type { onCloseRef } from "~components/modals/post-create-modal/post-create.modal"
import PostModal from "~components/modals/post-create-modal/post-create.modal"
import { Button, Skeleton, useDisclosure } from "@nextui-org/react"
import Navbar from "~components/navbar"
import { AnimatePresence, motion } from "framer-motion"
import { LuX } from "react-icons/lu"



export const HomeLayout: FC = () => {
    const setModalStateRef = useRef<onCloseRef>(null);
    const { pathname } = useLocation();

    const [updates, setUpdates] = useState<boolean>(false);

    const { isOpen, onOpenChange, onClose } = useDisclosure({
        onClose: setModalStateRef.current?.reset
    });

    useEffect(() => {
        setUpdates(false)
    }, [pathname])

    return (
        <div className="md:grid md:grid-cols-[3fr_9fr] min-h-screen bg-app-primary text-app-t-primary relative">
            <Navbar
                toggleCreatePostModal={onOpenChange}
                postButtonDisabled={false}
                updatesBoxState={[updates, setUpdates]}
            />
            {/* <AnimatePresence>
                {updatesBoxState[0] &&

                    <motion.div
                        initial={{ opacity: 0, x: -100 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        transition={{ duration: 0.2 }}
                        className='absolute bg-app-primary z-[5] lg:left-[384px] md:left-[288px] w-1/4 h-full border-x border-app-tertiary overflow-y-scroll'
                    >
                        <div className='w-full flex p-4 justify-between'>
                            <h2 className='text-2xl font-semibold'>Updates</h2>
                            <Button
                                isIconOnly
                                size='sm'
                                radius="md"
                                variant='light'
                                endContent={<LuX size={18} color='gray' />}
                                onPress={() => updatesBoxState[1](false)}
                            />
                        </div>
                        <div className='divide-y-1 divide-app-tertiary'>
                            
                            {
                                true &&
                                Array.from({ length: 6 }).map((_, i) => {
                                    return (
                                        <div className='flex w-full px-2 py-3'>
                                            <Skeleton className='size-12 rounded-full' />
                                            <div className="flex flex-grow my-auto ms-3">
                                                <Skeleton className=' h-4 w-3/4 rounded-lg' />
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </motion.div>
                }
            </AnimatePresence> */}
            <div className="flex flex-col max-h-dvh overflow-y-scroll border-l border-app-tertiary">
                <Outlet />
            </div>
            <PostModal isOpen={isOpen} onOpenChange={onOpenChange} onClose={onClose} ref={setModalStateRef} />
        </div>
    )
}
