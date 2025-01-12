import React, { useEffect, useState } from 'react';
import { Modal, ModalContent, ModalBody, ModalHeader, Tabs, Tab, Avatar } from '@nextui-org/react';
import { UseDisclosureReturn } from '@nextui-org/use-disclosure';
import { TRANSITION_EASINGS } from "@nextui-org/framer-utils";
import { IFollow, IFollowee, IFollower } from '~types/dto/follow.dto';
import { IBasicUser } from '~types/dto/user.dto';
import { QueryClient, useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { fetchFollowers, fetchFollowings } from '~services/query/follows.query';
import { useAppSelector } from '~hooks/useReduxHooks';
import { LuLoader } from 'react-icons/lu';
import { buildImageUrl } from '~utils/imageUrl';
import { IFollows } from '~components/pages/profile/profile.page';

interface FollowListModalProps {
    disclosure: UseDisclosureReturn;
    user_id: string
}

export type activeTab = "followers" | "followings"

const FollowListModal: React.FC<FollowListModalProps> = ({ disclosure, user_id }) => {
    const [activeTab, setActiveTab] = useState<activeTab>("followers");
    const queryClient = useQueryClient();

    // useEffect(() => {
    //     queryClient.resetQueries({ queryKey: [user_id, activeTab] });
    //     setActiveTab("followings");
    // }, [user_id, queryClient]);

    const followingsQuery = useInfiniteQuery({
        queryKey: [user_id, 'followings'],
        queryFn: ({ pageParam = 0 }) => fetchFollowings(pageParam, activeTab, user_id),
        initialPageParam: 1,
        getNextPageParam: (recentData) => recentData.nextPageParam,
        enabled: activeTab === 'followings',
    });

    const followersQuery = useInfiniteQuery({
        queryKey: [user_id, 'followers'],
        queryFn: ({ pageParam = 0 }) => fetchFollowers(pageParam, activeTab, user_id),
        initialPageParam: 1,
        getNextPageParam: (recentData) => recentData.nextPageParam,
        enabled: activeTab === 'followers',
    });

    const activeQuery = activeTab === "followers" ? followersQuery : followingsQuery;

    // memoize result
    const currentList = activeQuery.data?.pages.reduce<(IFollowee | IFollower)[]>((acc, curr) => {
        return acc.concat(curr.body)
    }, []);

    const renderUserInfo = (user: IFollowee | IFollower) => {
        const userInfo = "followee_info" in user ? user.followee_info : user.follower_info;

        return (
            <div
                className='flex w-full px-3 py-3 hover:bg-app-secondary cursor-pointer text-app-t-primary'
                key={user._id}
            >
                <Avatar
                    src={buildImageUrl(userInfo.avatar).href}
                    name={"notf"}
                    showFallback
                    className='w-11 h-11 border border-app-tertiary rounded-full bg-app-tertiary'
                />
                <p className='text-app-t-primary'>{userInfo.username}</p>
            </div>
        )
    }

    return (
        <Modal
            isOpen={disclosure.isOpen}
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
                                currentList?.length && currentList.map((user, index) => renderUserInfo(user) )
                            }
                            {
                                activeQuery.isFetching &&
                                <div className='place-items-center'>
                                    <LuLoader className='animate-spin' color='gray' />
                                </div>
                            }
                            <button className='bg-white' onClick={() => activeQuery.fetchNextPage()}>get</button>
                        </ModalBody>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
};

export default FollowListModal;