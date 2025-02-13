import React, { useState } from 'react';
import { Button } from "@nextui-org/react";
import { followRequestStatus, INotification } from '~types/dto/notification.dto';
import { useMutation } from '@tanstack/react-query';
import { acceptFollowRequest } from '~services/query/follows.query';
import { NotificationKind } from '~constants/notification';
import { FollowStatus } from '~types/dto/follow.dto';

interface FollowRequestNotificationProps {
    followNotf: INotification
}

const FollowRequestButton: React.FC<FollowRequestNotificationProps> = ({ followNotf }) => {
    if (followNotf.type !== NotificationKind.followRequest) {
        return null;
    }

    const [isAccepted, setIsAccepted] = useState(followNotf.status === followRequestStatus.accepted);

    const { mutate } = useMutation({
        mutationFn: acceptFollowRequest,
        mutationKey: [followNotf._id, "followRequest"],
        onSuccess(data, variables, context) {
            setIsAccepted(data.body.status === FollowStatus.active ? true : false)
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
            onPress={handleAccept}
        >
            {isAccepted ? 'Follow' : 'Accept'}
        </Button>
    );
};

export default FollowRequestButton;