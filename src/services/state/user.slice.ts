import { createSlice } from "@reduxjs/toolkit";
import { ILoginState, IUserState, IUser } from "~types/dto/user.dto";

const clientStateObj: ILoginState = {
    isLoggedIn: false
}

const serverStateObj: IUser = {
    username: null,
    displayname: null,
    isVerified: false,
    gender: undefined,
    configuration: null,
    bio: undefined,
    links: [],
    cover: undefined,
    avatar: undefined,
    _id: undefined
};

const userSlice = createSlice({
    name: "user",
    initialState: { ...clientStateObj, ...serverStateObj } as IUserState,
    reducers: {
        setUser: (state, action) => {
            const { username, configuration, displayname, avatar, gender, links, bio, _id } = action.payload;

            state.isLoggedIn = true;
            state.username = username;
            state.configuration = configuration;
            state.displayname = displayname;
            state.avatar = avatar;
            state.gender = gender;
            state.links = links
            state.bio = bio;
            state._id = _id;
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
        },
        updateUserProfile: (state, action) => {
            const { gender, bio, links } = action.payload;

            state.gender = gender || state.gender;
            state.links = links;
            state.bio = bio;
        },
        setStoreUsername: (state, action) => {
            state.username = action.payload.username;
        }
    }
})

export const {
    setUser,
    clearUser,
    updateUserProfile,
    setStoreUsername
} = userSlice.actions;

export default userSlice.reducer;