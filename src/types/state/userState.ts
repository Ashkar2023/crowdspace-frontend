export interface IClientState {
    isLoggedIn:boolean
}

export interface IServerState{
    username: string | null,
    displayname: string | null,
    isVerified: boolean,
    gender: "M" | "F" | undefined,
    configuration: null,
    bio: string | null,
    links: string[],
    cover: string | null,
    avatar: string | null,
}

export type TUserState = IClientState & IServerState;