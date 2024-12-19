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