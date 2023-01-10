import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import type { UpdateOrCreateMemoRequestBody, Memo } from "../../types";
import Api from "../../utils/api";

interface MemoState {
    sid_memo_map: { [sid: string]: Memo };
    is_waiting: boolean;
}

const initialState: MemoState = {
    sid_memo_map: {},
    is_waiting: false,
};

export const fetch_all_memo = createAsyncThunk(
    "memo/fetch_all_memo",
    async (): Promise<Memo[]> => {
        let request_body = new URLSearchParams();

        let response = await Api.send_request(
            "memo/stock-memo/read",
            "post",
            request_body
        );
        if (response?.success) return response.data;
        else throw Error("Failed to fetch memo");
    }
);

export const update_or_create_memo = createAsyncThunk(
    "memo/update_or_create_memo",
    async (data: UpdateOrCreateMemoRequestBody): Promise<Memo> => {
        let request_body = new URLSearchParams();
        request_body.append("sid", data.sid);
        if (data.business !== undefined) {
            request_body.append("business", data.business);
        }
        if (data.strategy !== undefined) {
            request_body.append("strategy", data.strategy);
        }
        if (data.note !== undefined) request_body.append("note", data.note);

        let response = await Api.send_request(
            "memo/stock-memo/update-or-create",
            "post",
            request_body
        );

        if (response?.success) return response.data;
        else throw Error("Failed to update or create memo");
    }
);

export const memo_slice = createSlice({
    name: "memo",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetch_all_memo.pending, (state) => {
                state.is_waiting = true;
            })
            .addCase(fetch_all_memo.fulfilled, (state, action) => {
                for (let memo of action.payload) {
                    state.sid_memo_map[memo.sid] = memo;
                }
                state.is_waiting = false;
            })
            .addCase(fetch_all_memo.rejected, (state) => {})

            .addCase(update_or_create_memo.pending, (state) => {
                state.is_waiting = true;
            })
            .addCase(update_or_create_memo.fulfilled, (state, action) => {
                state.sid_memo_map[action.payload.sid] = action.payload;
                state.is_waiting = false;
            })
            .addCase(update_or_create_memo.rejected, (state) => {});
    },
});

export default memo_slice.reducer;
