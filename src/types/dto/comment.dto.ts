import { IBasicUser, IUserState } from "./user.dto";

export interface IComment {
    _id: string,
    post_id: string;
    author: IBasicUser;
    commentBody: string;
    replyFor?: string;
    createdAt:string
    updatedAt:string
}