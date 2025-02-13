export interface ILoginState {
    isLoggedIn: boolean
}

export interface IBasicUser {
    username: string,
    displayname: string,
    avatar: string,
    _id: string | undefined
}

// FIX null
export type IConfiguration = {
    privateAccount: boolean,
    suggestionInProfile: boolean,
    PushNotifications: {
        likes: boolean,
        comments: boolean,
        follows: boolean,
        messages: boolean,
        stories: boolean,
        posts: boolean,
        liveStream: boolean
    } | null,
    inAppNotifications: {
        likes: boolean,
        comments: boolean,
        follows: boolean,
        messages: boolean,
        stories: boolean,
        posts: boolean,
        liveStream: boolean
    } | null
}

export interface IUser {
    username: string | null,
    displayname: string | null,
    avatar: string | undefined,
    _id: string | undefined
    isVerified: boolean,
    gender: "M" | "F" | undefined,
    configuration: null | IConfiguration,
    bio: string | undefined,
    followersCount: number,
    followingsCount: number,
    postsCount:number,
    links: string[],
    cover: string | undefined,
}

export type IUserState = ILoginState & IUser;