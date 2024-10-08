import { defaultLayout } from "@nextui-org/react";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    current_location: null,
    sidebarCollapsed: false,
    notifificationPanelOpen: false,
    openModal: "",
    modalState: {}
};

const interfaceSlice = createSlice({
    name: "interface",
    initialState,
    reducers: {
        setInterfaceState: (state, action) => {

        },
        clearInterfaceState: (state, action) => {
            state = initialState;
        }
    }
});

export const { setInterfaceState, clearInterfaceState } = interfaceSlice.actions
export default interfaceSlice.reducer;