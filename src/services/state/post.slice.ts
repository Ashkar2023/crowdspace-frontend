import { createSlice } from "@reduxjs/toolkit";
import { PostType, PostVisibility } from "~types/components/post-modal.types";

/* CHANGE THE ENTIRE SLICE TO STORE DRAFTS */
const initialState: { 
    postType: PostType,
    caption: string,
    mentions: string[],
    tags: string[],
    visibility: PostVisibility
} = {
    postType: PostType.TEXT,
    caption: "",
    mentions: [],
    tags: [],
    visibility: PostVisibility.EVERYONE,
};

const postSlice = createSlice({
    name: "post",
    initialState,
    reducers: {
        setPostType: (state, action: {
            type: string,
            payload: PostType
        }) => {
            state.postType = action.payload;
        },
        setCaption: (state, action: { type: string, payload: string }) => {
            state.caption = action.payload;
        },
        // setVisibility:(state,action)=>{

        // }
        // addMentions: (state, action) => {
        //     state.mentions = [...state.mentions, action.payload.mention];
        // },
        // addTags:(state,action)=>{

        // },
    }
})

export const { setCaption, setPostType } = postSlice.actions;
export default postSlice.reducer;