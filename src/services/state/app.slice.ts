import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    current_location: null,
    sidebarCollapsed: false,
    notifificationPanelOpen: false,
    openModal: "",
    modalState: {}
};

const appSlice = createSlice({
    name: "app",
    initialState,
    reducers: {
        setAppState: (state, action) => {

        },
        clearAppState: (state, action) => {
            state = initialState;
        }
    }
});

export const { setAppState, clearAppState } = appSlice.actions
export default appSlice.reducer;