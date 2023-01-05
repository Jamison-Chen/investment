import { createSlice } from "@reduxjs/toolkit";

import type { Error } from "../../types";

export interface ErrorState {
    error_list: Error[];
}

const initialState: ErrorState = {
    error_list: [],
};

export const error_slice = createSlice({
    name: "error",
    initialState,
    reducers: {
        push_error: (state, action) => {
            state.error_list.push(action.payload);
        },
        remove_error: (state, action) => {
            state.error_list.splice(action.payload, 1);
        },
    },
});

export const { push_error, remove_error } = error_slice.actions;

export default error_slice.reducer;
