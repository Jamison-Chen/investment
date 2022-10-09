import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import Utils from "../../util";
// import { UpdateAccountInfoRequestBody } from "../../api/AccountApi";

export type TradeRecord = {
    id: number;
    deal_time: string;
    sid: string;
    company_name: string;
    deal_price: number;
    deal_quantity: number;
    handling_fee: number;
};

export interface TradeRecordState {
    record_list: TradeRecord[];
    sid_records_map: { [idx: string]: TradeRecord[] };
}

const initialState: TradeRecordState = {
    record_list: [],
    sid_records_map: {},
};

export const fetch_all_trade_records = createAsyncThunk(
    "trade_record/fetch_all_trade_records",
    async (): Promise<TradeRecord[]> => {
        let request_body = new URLSearchParams();
        request_body.append("mode", "read");

        let response = await Utils.send_request(
            "stock/trade",
            "post",
            request_body
        );
        if (response && response.success) return response.data;
        else throw Error("Failed to fetch trade record");
    }
);

// export const update_account_info = createAsyncThunk(
//     "trade_record/update_account_info",
//     async (
//         request_body: UpdateAccountInfoRequestBody
//     ): Promise<{
//         id: string;
//         email: string;
//         username: string;
//         avatar_url: string | null;
//     }> => {
//         let response = await Utils.send_request(
//             "account/update",
//             "post",
//             JSON.stringify(request_body)
//         );
//         if (response && response.success) return response.data;
//         else throw Error("Failed to update info");
//     }
// );

export const trade_record_slice = createSlice({
    name: "trade_record",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetch_all_trade_records.pending, (state) => {})
            .addCase(fetch_all_trade_records.fulfilled, (state, action) => {
                state.record_list = [...action.payload];
                state.sid_records_map = get_sid_trade_records_map([
                    ...action.payload,
                ]);
            })
            .addCase(fetch_all_trade_records.rejected, (state) => {});

        // .addCase(update_account_info.pending, (state) => {})
        // .addCase(update_account_info.fulfilled, (state, action) => {
        //     state.user_id = action.payload.id;
        //     state.email = action.payload.email;
        //     state.username = action.payload.username;
        //     state.avatar_url = action.payload.avatar_url;
        // })
        // .addCase(update_account_info.rejected, (state) => {});
    },
});

function get_sid_trade_records_map(all_records: TradeRecord[]): {
    [idx: string]: TradeRecord[];
} {
    let reversed_records = [...all_records].reverse();
    let result: { [idx: string]: TradeRecord[] } = {};
    for (let record of reversed_records) {
        let s = record["sid"];
        if (result[s] === undefined) result[s] = [record];
        else result[s].push(record);
    }
    return result;
}

export default trade_record_slice.reducer;
