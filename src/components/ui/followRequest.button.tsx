import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Button } from "@nextui-org/react";
import { followRequestStatus, INotification } from '~types/dto/notification.dto';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { acceptFollowRequest } from '~services/query/follows.query';
import { NotificationKind } from '~constants/notification';
import { FollowStatus } from '~types/dto/follow.dto';
import { LuLoader, LuLoader2 } from 'react-icons/lu';
import { fetchNotificationApiResponse } from '~services/query/notification.queries';
import { useNotifications } from '~/context/notificationContext';
import toast from 'react-hot-toast';
import { toastErrorTheme } from '~config/toastTheme.config';

interface FollowRequestNotificationProps {
    followNotf: INotification
}

const FollowRequestButton: React.FC<FollowRequestNotificationProps> = ({ followNotf }) => {
    if (followNotf.type !== NotificationKind.followRequest) {
        return null;
    }

    const queryClient = useQueryClient();
    const [isAccepted, setIsAccepted] = useState(followNotf.status === followRequestStatus.accepted);
    const { setNotifications } = useNotifications();

    const { mutate, isPending } = useMutation({
        mutationFn: acceptFollowRequest,
        mutationKey: [followNotf._id, "followRequest"],
        onSuccess(data, variables, context) {
            setIsAccepted(data.body.status === FollowStatus.active ? true : false);

            if (setNotifications !== null) {
                setNotifications(prev => {
                    return prev.map(notf => {
                        return notf.target === data.body._id ?
                            { ...notf, status: followRequestStatus.accepted } :
                            notf
                    })
                })
            }
        },
        onError(error, variables, context) {
            console.log(error);
            console.log(context);
            // FIX with type
            // @ts-ignore
            toast.error(error.response.data.message, {
                style: toastErrorTheme
            });
        },
    })

    // const { data, status } = profileData?.outgoingFollow?.status ?
    //                 await protectedApi.delete(`/users/${profileData?.profile._id}/follow`) :
    //                 await protectedApi.post(`/users/${profileData?.profile._id}/follow`)

    const handleAccept = () => {
        mutate(followNotf);
    };

    return (
        <Button
            className={`self-center min-w-24 px-2 ${isAccepted ? 'bg-app-primary' : 'bg-app-accent'} text-app-t-primary`}
            size="sm"
            isDisabled={isAccepted}
            onPress={handleAccept}
        >
            {isPending ?
                <LuLoader /> :
                isAccepted ? 'Accepted' : 'Accept'
            }
        </Button>
    );
};

export default FollowRequestButton;