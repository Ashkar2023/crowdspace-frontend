import { createSlice } from "@reduxjs/toolkit";

const clientState = {
    isLoggedIn: false
}

const serverState = {
    username: null,
    displayname: null,
    isVerified: false,
    gender: null,
    configuration: null,
    bio: null,
    links: [],
    cover: null,
    avatar: null,
    gender: null
};

const userSlice = createSlice({
    name: "user",
    initialState: { ...clientState, ...serverState },
    reducers: {
        setUser: (state, action) => {
            const { username, configuration, displayname, avatar, gender, links, bio } = action.payload;

            state.isLoggedIn = true;
            state.username = username;
            state.configuration = configuration;
            state.displayname = displayname;
            state.avatar = avatar;
            state.gender = gender;
            state.links = links
            state.bio = bio;
        },
        clearUser: (state) => {
            state.isLoggedIn = false;
            state.username = null;
            state.displayname = null;
            state.isVerified = false
            state.configuration = null;
            state.bio = null;
            state.links = null;
            state.cover = null;
            state.avatar = null;
        },
        updateUserProfile: (state, action) => {
            const { gender, bio, links } = action.payload;

            state.gender = gender;
            state.links = links;
            state.bio = bio;
        }
    }
})

export const { setUser, clearUser, updateUserProfile } = userSlice.actions;
export default userSlice.reducer;