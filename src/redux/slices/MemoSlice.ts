import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import type {
    CreateMemoRequestBody,
    UpdateMemoRequestBody,
    Memo,
} from "../../types";
import Api from "../../utils/api";

export interface MemoState {
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
        request_body.append("mode", "read");

        let response = await Api.send_request(
            "stock/memo",
            "post",
            request_body
        );
        if (response?.success) return response.data;
        else throw Error("Failed to fetch memo");
    }
);

export const create_memo = createAsyncThunk(
    "memo/create_memo",
    async (data: CreateMemoRequestBody): Promise<Memo> => {
        let request_body = new URLSearchParams();
        request_body.append("mode", "create");
        request_body.append("sid", data.sid);
        request_body.append("business", data.business);
        request_body.append("strategy", data.strategy);
        request_body.append("note", data.note);
        let response = await Api.send_request(
            "stock/memo",
            "post",
            request_body
        );
        if (response?.success) return response.data;
        else throw Error("Failed to create memo");
    }
);

export const update_memo = createAsyncThunk(
    "memo/update_memo",
    async (data: UpdateMemoRequestBody): Promise<Memo> => {
        let request_body = new URLSearchParams();
        request_body.append("mode", "update");
        request_body.append("id", data.id);
        request_body.append("business", data.business);
        request_body.append("strategy", data.strategy);
        request_body.append("note", data.note);
        let response = await Api.send_request(
            "stock/memo",
            "post",
            request_body
        );
        if (response?.success) return response.data;
        else throw Error("Failed to update memo");
    }
);

export const delete_memo = createAsyncThunk(
    "memo/delete_memo",
    async (id: string | number): Promise<string | number> => {
        let request_body = new URLSearchParams();
        request_body.append("mode", "delete");
        request_body.append("id", id.toString());

        let response = await Api.send_request(
            "stock/memo",
            "post",
            request_body
        );
        if (response?.success) return id;
        else throw Error("Failed to delete memo");
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

            .addCase(create_memo.pending, (state) => {
                state.is_waiting = true;
            })
            .addCase(create_memo.fulfilled, (state, action) => {
                state.sid_memo_map[action.payload.sid] = action.payload;
                state.is_waiting = false;
            })
            .addCase(create_memo.rejected, (state) => {})

            .addCase(update_memo.pending, (state) => {
                state.is_waiting = true;
            })
            .addCase(update_memo.fulfilled, (state, action) => {
                state.sid_memo_map[action.payload.sid] = action.payload;
                state.is_waiting = false;
            })
            .addCase(update_memo.rejected, (state) => {})

            .addCase(delete_memo.pending, (state) => {
                state.is_waiting = true;
            })
            .addCase(delete_memo.fulfilled, (state, action) => {
                delete state.sid_memo_map[action.payload];
                state.is_waiting = false;
            })
            .addCase(delete_memo.rejected, (state) => {});
    },
});

export default memo_slice.reducer;
