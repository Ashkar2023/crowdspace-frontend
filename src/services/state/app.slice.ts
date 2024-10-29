import { createSlice } from "@reduxjs/toolkit";
import { IAppState } from "~types/state/appState";


/* SET the init state TYPE */
// current_location: null, 
// sidebarCollapsed: false,
// notifificationPanelOpen: false,
// openModal: "",
// modalState: {},'

const initialState : IAppState = {
    theme: (window.matchMedia('(prefers-color-scheme:dark)').matches ? "dark" : "light")
};

const appSlice = createSlice({
    name: "app",
    initialState,
    reducers: {
        setAppTheme: (state, action) => {
            state.theme = action.payload;
        },
    }
});

export const { setAppTheme } = appSlice.actions;
export default appSlice.reducer;