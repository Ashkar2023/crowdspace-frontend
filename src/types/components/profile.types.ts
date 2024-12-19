import { IFollow } from "~types/dto/follow.dto";
import { IUser } from "~types/dto/user.dto";

export type ProfileStateType = {
    profile:IUser,
    outgoingFollow: IFollow | null,
    incomingFollow: IFollow | null
};