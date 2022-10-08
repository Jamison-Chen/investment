import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import Utils from "../../../util";
import person_fill from "../../../assets/person-fill.svg";

export interface AccountState {
    user_id: string;
    email: string;
    username: string;
    avatar_url: string;
}

const initialState: AccountState = {
    user_id: "",
    email: "",
    username: "",
    avatar_url: person_fill,
};

export const fetch_account_info = createAsyncThunk(
    "account/fetch_account_info",
    async (): Promise<{
        user_id: string;
        email: string;
        username: string;
        avatar_url: string | null;
    }> => {
        let response = await Utils.check_login();
        if (response && response.success) return response.data;
        else throw Error("Failed to fetch info");
    }
);

export const update_account_info = createAsyncThunk(
    "account/update_account_info",
    async (
        request_body: URLSearchParams
    ): Promise<{
        user_id: string;
        email: string;
        username: string;
        avatar_url: string | null;
    }> => {
        let response = await Utils.send_request(
            "account/update",
            "post",
            request_body
        );
        if (response && response.success) return response.data;
        else throw Error("Failed to update info");
    }
);

export const account_slice = createSlice({
    name: "account",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetch_account_info.pending, (state) => {})
            .addCase(fetch_account_info.fulfilled, (state, action) => {
                state.user_id = action.payload.user_id;
                state.email = action.payload.email;
                state.username = action.payload.username;
                state.avatar_url = action.payload.avatar_url || person_fill;
            })
            .addCase(fetch_account_info.rejected, (state) => {})

            .addCase(update_account_info.pending, (state) => {})
            .addCase(update_account_info.fulfilled, (state, action) => {
                state.user_id = action.payload.user_id;
                state.email = action.payload.email;
                state.username = action.payload.username;
                state.avatar_url = action.payload.avatar_url || person_fill;
            })
            .addCase(update_account_info.rejected, (state) => {});
    },
});

export default account_slice.reducer;
