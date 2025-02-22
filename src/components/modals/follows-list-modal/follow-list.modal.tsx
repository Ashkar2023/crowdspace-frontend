import React, { useEffect, useRef, useState } from 'react';
import { Modal, ModalContent, ModalBody, Avatar, ModalHeader, Button } from '@nextui-org/react';
import { UseDisclosureReturn } from '@nextui-org/use-disclosure';
import { IFollowee, IFollower } from '~types/dto/follow.dto';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { fetchFollowers, fetchFollowings } from '~services/query/follows.query';
import { LuLoader } from 'react-icons/lu';
import { buildImageUrl } from '~utils/imageUrl';
import { useIntersection } from '~hooks/useIntersection';

interface FollowListModalProps {
    disclosure: UseDisclosureReturn;
    user_id: string
}

export type activeTab = "followers" | "followings"

const FollowListModal: React.FC<FollowListModalProps> = ({ disclosure, user_id }) => {
    // FIX initial click tab selection
    const [activeTab, setActiveTab] = useState<activeTab>("followers");
    const containerRef = useRef<HTMLDivElement>(null);
    const queryClient = useQueryClient();

    // useEffect(() => {
    // return () => {
    // queryClient.resetQueries({ queryKey: [user_id, activeTab] });
    //     }
    // }, [user_id]);

    const { observerRef, isVisible } = useIntersection({
        root: containerRef.current,
        threshold: 0.1
    }, [])

    /* FIX the cache is not retrieved properly on subsequent profile enters */
    /* FIX where the nextPage param is not being set to null */
    const followingsQuery = useInfiniteQuery({
        queryKey: [user_id, 'followings'],
        queryFn: ({ pageParam }) => fetchFollowings(pageParam, activeTab, user_id),
        initialPageParam: 1,
        getNextPageParam: (recentData) => recentData.nextPageParam,
        enabled: activeTab === 'followings' && user_id !== undefined,
        // retry: false
    });

    const followersQuery = useInfiniteQuery({
        queryKey: [user_id, 'followers'],
        queryFn: ({ pageParam = 0 }) => fetchFollowers(pageParam, activeTab, user_id),
        initialPageParam: 1,
        getNextPageParam: (recentData) => recentData.nextPageParam,
        enabled: activeTab === 'followers' && user_id !== undefined,
        // retry: false
    });

    const activeQuery = activeTab === "followers" ? followersQuery : followingsQuery;

    useEffect(() => {
        if (isVisible && activeQuery?.hasNextPage && !activeQuery.isFetching) {
            activeQuery.fetchNextPage();
        }
    }, [isVisible]);

    /* FIND if memoization is possible */
    const currentList = activeQuery.data?.pages.reduce<(IFollowee | IFollower)[]>((acc, curr) => {
        return acc.concat(curr.body)
    }, []);

    /* FIX put this component outside the followModal. or else this would recreate the whole renderlist */
    const renderUserInfo = (user: IFollowee | IFollower, index: number) => {
        const userInfo = "followee_info" in user ? user.followee_info : user.follower_info;

        return (
            <div
                className='flex w-full px-3 py-3 hover:bg-app-secondary cursor-pointer text-app-t-primary'
                key={user._id}
                ref={index === currentList?.length! - 1 ? observerRef : null}
            >
                <Avatar
                    src={buildImageUrl(userInfo.avatar).href}
                    name={"notf"}
                    showFallback
                    className='w-11 h-11 border border-app-tertiary rounded-full bg-app-tertiary'
                />
                <p className='text-app-t-primary place-content-center px-2'>{userInfo.username}</p>
            </div>
        )
    }

    return (
        <Modal
            isOpen={disclosure.isOpen}
            /* FIX onClose bug */
            onClose={disclosure.onClose}
            // hideCloseButton={true}
            isDismissable={true}
            backdrop="opaque"
            className="bg-app-secondary h-[420px]"
            classNames={{
                closeButton: ['rounded-xl']
            }}
            size='xs'
        >
            <ModalContent className='border-1.5 border-app-tertiary'>
                {(onClose) => (
                    <>
                        {/*
                            //ModalHeader is already flex
                         */}
                        <ModalHeader className='justify-center'>
                            <div className='flex gap-2 border border-app-tertiary rounded-xl p-1'>
                                <Button
                                    size='sm'
                                    variant={activeTab === 'followers' ? "shadow" : "light"}
                                    onPress={() => setActiveTab("followers")}
                                >
                                    followers
                                </Button>
                                <Button
                                    size='sm'
                                    className={``}
                                    onPress={() => setActiveTab("followings")}
                                    variant={activeTab === 'followings' ? "shadow" : "light"}
                                >
                                    followings
                                </Button>
                            </div>
                        </ModalHeader>
                        <ModalBody className='px-3 py-0 mb-4 gap-1 overflow-y-auto border-t-1 border-app-tertiary'>
                            <div ref={containerRef} className='min-h-full w-full space-y-1'>
                                {
                                    currentList?.length && currentList.map((user, index) => renderUserInfo(user, index))
                                }
                                {
                                    activeQuery.isFetching &&
                                    <div className='place-items-center'>
                                        <LuLoader className='animate-spin mb-2' size={24} color='gray' />
                                    </div>
                                }
                            </div>
                        </ModalBody>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
};

export default FollowListModal;