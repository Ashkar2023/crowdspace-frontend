import React, { useEffect, useState } from 'react';
import { Modal, ModalContent, ModalBody, ModalHeader, Tabs, Tab, Avatar } from '@nextui-org/react';
import { UseDisclosureReturn } from '@nextui-org/use-disclosure';
import { TRANSITION_EASINGS } from "@nextui-org/framer-utils";
import { IFollow } from '~types/dto/follow.dto';
import { IBasicUser } from '~types/dto/user.dto';
import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchFollowers } from '~services/query/follows.query';
import { useAppSelector } from '~hooks/useReduxHooks';
import { LuLoader } from 'react-icons/lu';
import { buildImageUrl } from '~utils/imageUrl';

interface FollowListModalProps {
    disclosure: UseDisclosureReturn;
    // users: IBasicUser[];
    // initialTab: string;
}

export type activeTab = "followers" | "followings"

const FollowListModal: React.FC<FollowListModalProps> = ({ disclosure }) => {
    const stateUserId = useAppSelector((state) => state.user._id);
    const [activeTab, setActiveTab] = useState<activeTab>("followers");
    const [followers, setFollowers] = useState<(IFollow & { follower_info: IBasicUser })[]>([])
    const [followings, setFollowings] = useState<(IFollow & { followee_info: IBasicUser })[]>([])

    const { data, isFetching, fetchNextPage } = useInfiniteQuery({
        queryKey: [stateUserId, activeTab],
        queryFn: ({ pageParam = 0 }) => fetchFollowers(pageParam, activeTab, stateUserId!),
        initialPageParam: 1,
        getNextPageParam: (recentData) => recentData.nextPageParam,
    })

    useEffect(() => {
        if (data?.pages) {
            let arr: any = [];
            data.pages.map(notf => {
                arr = [...notf.body];
            })
            console.log(arr);
            setFollowers(prev => {
                return [prev, ...arr]
            })
        }
    }, [data])

    return (
        <Modal
            isOpen={disclosure.isOpen}
            onOpenChange={disclosure.onOpenChange}
            onClose={disclosure.onClose}
            hideCloseButton={true}
            isDismissable={true}
            backdrop="opaque"
            className="bg-app-secondary h-[420px] "
            size='xs'
            motionProps={{
                variants: {
                    enter: {
                        scale: 1,
                        y: "var(--slide-enter)",
                        opacity: 1,
                        transition: {
                            scale: {
                                duration: 0.4,
                                ease: TRANSITION_EASINGS.ease,
                            },
                            opacity: {
                                duration: 0.4,
                                ease: TRANSITION_EASINGS.ease,
                            },
                            y: {
                                type: "spring",
                                bounce: 0,
                                duration: 0.6,
                            },
                        },
                    },
                    exit: {
                        scale: 1.03, // NextUI default 1.03
                        y: "var(--slide-exit)",
                        opacity: 0,
                        transition: {
                            duration: 0.3,
                            ease: TRANSITION_EASINGS.ease,
                        },
                    },
                }

            }}
        >
            <ModalContent className='border-1.5 border-app-tertiary'>
                {(onClose) => (
                    <>
                        {/*
                            //ModalHeader is already flex
                         */}
                        <ModalHeader className='justify-center'>
                            <Tabs
                                selectedKey={activeTab}
                                className='font-normal'
                                onSelectionChange={(tab) => setActiveTab(tab as activeTab)}
                            >
                                <Tab key="followers" title="Followers"></Tab>
                                <Tab key="followings" title="Followings"></Tab>
                            </Tabs>
                        </ModalHeader>
                        <ModalBody className='px-3 py-0 mb-4 gap-1 overflow-y-scroll border-t-1 border-app-tertiary'>
                            {
                                followers.map((f, index) => {
                                    return (
                                        <div
                                            className='flex w-full px-3 py-3 hover:bg-app-secondary cursor-pointer'
                                            key={f._id}
                                        // onClick={()=>{
                                        //     navigate()
                                        // }}
                                        >

                                            <Avatar
                                                src={buildImageUrl(f.follower_info.avatar).href}
                                                name={"notf"}
                                                showFallback
                                                className='w-11 h-11 border border-app-tertiary rounded-full bg-app-tertiary'
                                            />
                                            <p className='text-app-t-primary'>{f.follower_info.username}</p>
                                        </div>
                                    )
                                })
                            }
                            {
                                isFetching &&
                                <div className='place-items-center'>
                                    <LuLoader className='animate-spin' color='gray' />
                                </div>
                            }
                            <button className='bg-white' onClick={() => fetchNextPage()}>get</button>
                        </ModalBody>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
};

export default FollowListModal;