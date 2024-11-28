export interface ILoginState {
    isLoggedIn:boolean
}

export interface IUser{
    username: string | null,
    displayname: string | null,
    isVerified: boolean,
    gender: "M" | "F" | undefined,
    configuration: null,
    bio: string | undefined,
    links: string[],
    cover: string | undefined,
    avatar: string | undefined,
    _id: string | undefined //change to uuid later
}

export type IUserState = ILoginState & IUser;