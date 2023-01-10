import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import type { Account, UpdateAccountInfoRequestBody } from "../../types";
import Api from "../../utils/api";

interface AccountState extends Account {}

const initialState: AccountState = {
    id: "",
    email: "",
    username: "",
    avatar_url: "",
};

export const fetch_account_info = createAsyncThunk(
    "account/fetch_account_info",
    async (): Promise<Account> => {
        let response = await Api.check_login();
        if (response?.success) return response.data;
        else throw Error("Failed to fetch info");
    }
);

export const update_account_info = createAsyncThunk(
    "account/update_account_info",
    async (request_body: UpdateAccountInfoRequestBody): Promise<Account> => {
        let response = await Api.send_request(
            "account/update",
            "post",
            JSON.stringify(request_body)
        );
        if (response?.success) return response.data;
        else throw Error(response?.error || "Failed to update account info.");
    }
);

export const delete_account = createAsyncThunk(
    "account/delete_account",
    async (request_body: { password: string }): Promise<void> => {
        let response = await Api.send_request(
            "account/delete",
            "post",
            JSON.stringify(request_body)
        );
        if (!response?.success) {
            throw Error(response?.error || "Failed to delete account.");
        }
    }
);

// export const update_rate_of_return = createAsyncThunk(
//     "account/update_rate_of_return",
//     async (arg, { getState }): Promise<void> => {
//         const state: RootState = getState() as RootState;
//         let response = await Api.send_request(
//             "account/delete",
//             "post",
//             JSON.stringify(request_body)
//         );
//         if (!response?.success) {
//             throw Error(response?.error || "Failed to update info");
//         }
//     }
// );

export const account_slice = createSlice({
    name: "account",
    initialState,
    reducers: {
        // update_local_rate_of_return(state, action: PayloadAction<number>) {
        //     state.rate_of_return = action.payload;
        // },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetch_account_info.pending, (state) => {})
            .addCase(fetch_account_info.fulfilled, (state, action) => {
                state.id = action.payload.id;
                state.email = action.payload.email;
                state.username = action.payload.username;
                state.avatar_url = action.payload.avatar_url;
            })
            .addCase(fetch_account_info.rejected, (state) => {})

            .addCase(update_account_info.pending, (state) => {})
            .addCase(update_account_info.fulfilled, (state, action) => {
                state.id = action.payload.id;
                state.email = action.payload.email;
                state.username = action.payload.username;
                state.avatar_url = action.payload.avatar_url;
            })
            .addCase(update_account_info.rejected, (state) => {})

            .addCase(delete_account.pending, (state) => {})
            .addCase(delete_account.fulfilled, (state, action) => {})
            .addCase(delete_account.rejected, (state) => {});
    },
});

// export const { update_local_rate_of_return } = account_slice.actions;
export default account_slice.reducer;
