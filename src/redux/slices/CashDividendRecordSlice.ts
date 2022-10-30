import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
    CreateCashDividendRecordRequestBody,
    UpdateCashDividendRecordRequestBody,
} from "../../api/CashDividendRecordApi";

import Utils from "../../util";

export type CashDividendRecord = {
    id: number;
    deal_time: string;
    sid: string;
    company_name: string;
    cash_dividend: number;
};

export interface TradeRecordState {
    record_list: CashDividendRecord[];
    is_waiting: boolean;
}

const initialState: TradeRecordState = {
    record_list: [],
    is_waiting: false,
};

export const fetch_all_cash_dividend_records = createAsyncThunk(
    "cash_dividend_record/fetch_all_cash_dividend_records",
    async (): Promise<CashDividendRecord[]> => {
        let request_body = new URLSearchParams();
        request_body.append("mode", "read");

        let response = await Utils.send_request(
            "stock/dividend",
            "post",
            request_body
        );
        if (response?.success) return response.data;
        else throw Error("Failed to fetch cash dividend record");
    }
);

export const create_record = createAsyncThunk(
    "cash_dividend_record/create_record",
    async (
        data: CreateCashDividendRecordRequestBody
    ): Promise<CashDividendRecord> => {
        let request_body = new URLSearchParams();
        request_body.append("mode", "create");
        request_body.append("sid", data.sid);
        request_body.append("deal_time", data.deal_time);
        request_body.append("cash_dividend", data.cash_dividend);
        let response = await Utils.send_request(
            "stock/dividend",
            "post",
            request_body
        );
        if (response?.success) return response.data;
        else throw Error("Failed to create cash dividend record");
    }
);

export const update_record = createAsyncThunk(
    "cash_dividend_record/update_record",
    async (
        data: UpdateCashDividendRecordRequestBody
    ): Promise<CashDividendRecord> => {
        let request_body = new URLSearchParams();
        request_body.append("mode", "update");
        request_body.append("id", data.id);
        request_body.append("sid", data.sid);
        request_body.append("deal_time", data.deal_time);
        request_body.append("cash_dividend", data.cash_dividend);
        let response = await Utils.send_request(
            "stock/dividend",
            "post",
            request_body
        );
        if (response?.success) return response.data;
        else throw Error("Failed to update cash dividend record");
    }
);

export const delete_record = createAsyncThunk(
    "cash_dividend_record/delete_record",
    async (id: string | number): Promise<string | number> => {
        let request_body = new URLSearchParams();
        request_body.append("mode", "delete");
        request_body.append("id", id.toString());

        let response = await Utils.send_request(
            "stock/dividend",
            "post",
            request_body
        );
        if (response?.success) return id;
        else throw Error("Failed to delete cash dividend record");
    }
);

export const cash_dividend_record_slice = createSlice({
    name: "cash_dividend_record",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetch_all_cash_dividend_records.pending, (state) => {
                state.is_waiting = true;
            })
            .addCase(
                fetch_all_cash_dividend_records.fulfilled,
                (state, action) => {
                    state.record_list = [...action.payload].sort(
                        (a, b) =>
                            Date.parse(b.deal_time) - Date.parse(a.deal_time)
                    );
                    state.is_waiting = false;
                }
            )
            .addCase(fetch_all_cash_dividend_records.rejected, (state) => {})

            .addCase(create_record.pending, (state) => {
                state.is_waiting = true;
            })
            .addCase(create_record.fulfilled, (state, action) => {
                state.record_list = [action.payload, ...state.record_list].sort(
                    (a, b) => Date.parse(b.deal_time) - Date.parse(a.deal_time)
                );
                state.is_waiting = false;
            })
            .addCase(create_record.rejected, (state) => {})

            .addCase(update_record.pending, (state) => {
                state.is_waiting = true;
            })
            .addCase(update_record.fulfilled, (state, action) => {
                state.record_list = state.record_list
                    .map((record) => {
                        if (record.id === action.payload.id) {
                            return action.payload;
                        }
                        return record;
                    })
                    .sort(
                        (a, b) =>
                            Date.parse(b.deal_time) - Date.parse(a.deal_time)
                    );
                state.is_waiting = false;
            })
            .addCase(update_record.rejected, (state) => {})

            .addCase(delete_record.pending, (state) => {
                state.is_waiting = true;
            })
            .addCase(delete_record.fulfilled, (state, action) => {
                state.record_list = [...state.record_list].filter(
                    (record) => record.id !== action.payload
                );
                state.is_waiting = false;
            })
            .addCase(delete_record.rejected, (state) => {});
    },
});

export const get_sid_total_cash_dividend_map = (
    record_list: CashDividendRecord[]
): { [idx: string]: number } => {
    let result: { [idx: string]: number } = {};
    for (let record of record_list) {
        let s = record.sid;
        if (result[s] === undefined) result[s] = record.cash_dividend;
        else result[s] += record.cash_dividend;
    }
    return result;
};

export default cash_dividend_record_slice.reducer;
