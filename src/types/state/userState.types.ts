export interface IClientState {
    isLoggedIn:boolean
}

export interface IServerState{
    username: string | null,
    displayname: string | null,
    isVerified: boolean,
    gender: "M" | "F" | undefined,
    configuration: null,
    bio: string | undefined,
    links: string[],
    cover: string | undefined,
    avatar: string | undefined,
    userUUID: string | undefined //change to uuid later
}

export type TUserState = IClientState & IServerState;