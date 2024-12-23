import { Modal, ModalContent, ModalBody, Button } from '@nextui-org/react'
import { UseDisclosureReturn } from '@nextui-org/use-disclosure'
import { PressEvent } from '@react-types/shared'
import { Dispatch, FC, SetStateAction } from 'react'
import toast from 'react-hot-toast'
import { LuFlag, LuPenSquare, LuTrash } from 'react-icons/lu'
import { useParams } from 'react-router-dom'
import { useAppSelector } from '~hooks/useReduxHooks'
import { protectedApi } from '~services/api/http'
import { T_Post } from '~types/dto/post.dto'
import { IReportRequiredFields, ReportReasons, ReportTargets } from '~types/dto/report.dto'

type Props<T extends ReportTargets = ReportTargets> = {
    disclosure: UseDisclosureReturn,
    activeTargetId: string | null,
    reportTargetType: T | null,
    setPosts: Dispatch<SetStateAction<T_Post[]>>,
    openEditPost: () => void
}

export const PostActionsModal: FC<Props> = ({ disclosure, activeTargetId: post_id, reportTargetType, setPosts,openEditPost }) => {
    const { username: usernameState, _id: userId } = useAppSelector(state => state.user);
    const { username } = useParams();

    const isLoggedInUser = username?.replace("@", "") === usernameState; // CHANGE to userId would be much better

    const reportSubmitHandler = async (e: PressEvent) => { //for now only
        try {
            /* --------FAKING IT------- */
            const body: IReportRequiredFields = { // just faking do a modal for taking in the data
                reason: ReportReasons.COPYRIGHT_VIOLATION,
                reported_by: userId!,
                target_id: post_id!,
                target_type: reportTargetType!,
                description: "heeelpdssdfd"
            }
            /* --------FAKING IT-------- */

            const { data } = await protectedApi.post("/reports", body, {});

            data.success && toast.success(data.message);

        } catch (error) {
            if (error instanceof Error)
                console.log(error.message)
        }
    }

    const deleteSubmitHandler = async (e: PressEvent) => {
        try {

            if (!confirm("are you sure to delete this post?")) {
                return
            }
            const { data } = await protectedApi.delete(`/posts/${post_id}`);

            setPosts(prev => prev.filter(p => p._id !== post_id));

            disclosure.onClose();

            data.success && toast.success(data.message, {
                duration: 1400,
                position: "bottom-right",
                icon: <LuTrash />,
                style: {
                    background: "var(--app-secondary)",
                    color: "red",
                    border: "1px solid red"
                }
            })
        } catch (error) {
            if (error instanceof Error)
                console.log(error.message)
        }
    }

    return (
        <Modal
            isOpen={disclosure.isOpen}
            onOpenChange={disclosure.onOpenChange}
            onClose={disclosure.onClose}

            hideCloseButton={true}
            isDismissable={true}
            backdrop="blur"
            className="bg-app-secondary"
            classNames={{
                base: ["w-56"],
            }}
        >
            <ModalContent
                className='border-1.5 border-app-tertiary'
            >
                {(onClose) => (
                    <>
                        <ModalBody
                            className='p-3 gap-1'
                        >
                            {
                                isLoggedInUser === false &&
                                <Button
                                    startContent={<LuFlag size={18} />}
                                    className="w-full justify-center text-danger"
                                    color="danger"
                                    variant="light"
                                    radius='sm'
                                    onPress={reportSubmitHandler}
                                >
                                    Report
                                </Button>
                            }
                            {
                                isLoggedInUser === true &&
                                <>
                                    {/* <hr className='border-t border-app-tertiary' /> */}
                                    <Button
                                        startContent={<LuTrash size={18} />}
                                        className="w-full justify-center text-danger"
                                        color="danger"
                                        variant="light"
                                        onPress={deleteSubmitHandler}
                                    >
                                        Delete
                                    </Button>
                                </>
                            }
                            {/* {username?.replace("@", "") !== usernameState &&
                                <>
                                    // <hr className='border-t border-app-tertiary' />
                                    <Button
                                        startContent={<LuUserMinus size={18} />}
                                        className="w-full justify-center text-app-t-secondary"
                                        variant="light"
                                        onPress={() => {

                                        }}
                                    >
                                        Unfollow
                                    </Button>
                                </>
                            } */}
                            {
                                isLoggedInUser === true &&
                                <>
                                    {/* <hr className='border-t border-app-tertiary' /> */}
                                    <Button
                                        startContent={<LuPenSquare size={18} />}
                                        className="w-full justify-center text-app-t-secondary hover:!bg-app-tertiary"
                                        color="default"
                                        variant="light"
                                        onPress={openEditPost}
                                    >
                                        Edit
                                    </Button>
                                </>
                            }
                        </ModalBody>
                    </>
                )}
            </ModalContent>
        </Modal>
    )
}
