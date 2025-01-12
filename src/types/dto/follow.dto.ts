import { IBasicUser } from "./user.dto"

export enum FollowStatus {
    active = 'active',
    pending = 'pending'
};

export interface IFollow {
    followee_id: string,
    follower_id: string,
    status: FollowStatus,
    close_friends: boolean,
    _id:string
}

export type IFollower = IFollow & { follower_info: IBasicUser }
export type IFollowee = IFollow & { followee_info: IBasicUser }