export interface ILoginState {
    isLoggedIn: boolean
}

export interface IBasicUser {
    username: string,
    displayname: string,
    avatar: string,
    _id: string | undefined
}

export interface IUser {
    username: string | null,
    displayname: string | null,
    avatar: string | undefined,
    _id: string | undefined
    isVerified: boolean,
    gender: "M" | "F" | undefined,
    configuration: null,
    bio: string | undefined,
    followersCount: number,
    followingsCount: number,
    postsCount:number,
    links: string[],
    cover: string | undefined,
}

export type IUserState = ILoginState & IUser;