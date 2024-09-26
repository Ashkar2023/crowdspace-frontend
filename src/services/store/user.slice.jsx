import { createSlice } from "@reduxjs/toolkit";

const clientState = {
    isLoggedIn: false
}

const serverState = {
    username: null,
    email: null,
    displayname: null,
    isVerified: false,
    gender: null,
    blockedUsers: null,
    configuration: null,
    bio: null,
    links: [],
    cover: null,
    avatar: null
};

const userSlice = createSlice({
    name: "user",
    initialState: { ...clientState, ...serverState },
    reducers: {
        setUser: (state, action) => {
            const { username, isVerified, configuration, displayname } = action.payload;

            state.isLoggedIn = true;
            state.username = username; 
            state.isVerified = isVerified; 
            state.configuration = configuration; 
            state.displayname = displayname; 
        },
        clearUser: (state, action) => {
            state = [...clientState, ...serverState]
        }
    }
})

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;