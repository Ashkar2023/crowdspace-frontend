import { createSlice } from "@reduxjs/toolkit";
import { ILoginState, IUserState, IUser, IConfiguration } from "~types/dto/user.dto";

const clientStateObj: ILoginState = {
    isLoggedIn: false
}

/* FIX this default state */
const configuration: IConfiguration = {
    privateAccount: false,
    suggestionInProfile: true,
    PushNotifications: null,
    inAppNotifications: null
};

const serverStateObj: IUser = {
    username: null,
    displayname: null,
    isVerified: false,
    gender: undefined,
    configuration: configuration,
    bio: undefined,
    links: [],
    cover: undefined,
    avatar: undefined,
    _id: undefined,
    followersCount: 0,
    followingsCount: 0,
    postsCount: 0
};

const userSlice = createSlice({
    name: "user",
    initialState: { ...clientStateObj, ...serverStateObj } as IUserState,
    reducers: {
        setUser: (state, action) => {
            const { username, configuration, displayname, avatar, gender, links, bio, _id, followersCount, followingsCount, postsCount, isVerified } = action.payload;

            state.isLoggedIn = true;
            state.isVerified = isVerified
            state.username = username;
            state.configuration = configuration;
            state.displayname = displayname;
            state.avatar = avatar;
            state.gender = gender;
            state.links = links
            state.bio = bio;
            state._id = _id;
            state.followersCount = followersCount;
            state.followingsCount = followingsCount;
            state.postsCount = postsCount;
        },
        clearUser: (state) => {
            state.isLoggedIn = false;
            state.username = null;
            state.displayname = null;
            state.isVerified = false
            state.configuration = null;
            state.bio = undefined;
            state.links = [];
            state.cover = undefined;
            state.avatar = undefined;
            state.gender = undefined;
            state._id = undefined;
            state.followersCount = 0;
            state.followingsCount = 0;
            state.postsCount = 0;

        },
        updateUserProfile: (state, action) => {
            const { gender, bio, links } = action.payload;

            state.gender = gender || state.gender;
            state.links = links;
            state.bio = bio;
        },
        updateAvatar: (state, action: { payload: string }) => {
            state.avatar = action.payload;
        },
        setStoreUsername: (state, action) => {
            state.username = action.payload.username;
        },
        updateFollowingsCount: (state, { payload }) => {
            switch (payload.action) {
                case "followed": {
                    state.followersCount = ++state.followingsCount;
                }
                case "unfollowed": {
                    state.followersCount = --state.followingsCount;
                }
            }
        },
        updatePrivacyState: (state, { payload }) => {
            // @ts-ignore FIX
            state.configuration = {
                ...state.configuration,
                privateAccount: payload.state,
            };
        }
    }
})

export const {
    setUser,
    clearUser,
    updateUserProfile,
    setStoreUsername,
    updateFollowingsCount,
    updateAvatar,
    updatePrivacyState
} = userSlice.actions;

export default userSlice.reducer;