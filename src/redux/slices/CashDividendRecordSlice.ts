import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

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
}

const initialState: TradeRecordState = {
    record_list: [],
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
        if (response && response.success) return response.data;
        else throw Error("Failed to fetch trade record");
    }
);

export const cash_dividend_record_slice = createSlice({
    name: "cash_dividend_record",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetch_all_cash_dividend_records.pending, (state) => {})
            .addCase(
                fetch_all_cash_dividend_records.fulfilled,
                (state, action) => {
                    state.record_list = [...action.payload];
                }
            )
            .addCase(fetch_all_cash_dividend_records.rejected, (state) => {});
    },
});

export default cash_dividend_record_slice.reducer;
