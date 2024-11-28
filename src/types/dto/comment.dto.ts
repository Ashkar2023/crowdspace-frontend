import { IUserState } from "./user.dto";

export interface IComment {
    _id: string,
    post_id: string;
    author: IUserState;
    commentBody: string;
    replyFor?: string;
}
