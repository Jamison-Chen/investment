import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import Utils from "../../util";

export type StockInfo = {
    date: string;
    sid: string;
    name: string;
    trade_type: string;
    quantity: number;
    open: number;
    close: number;
    highest: number;
    lowest: number;
    fluct_price: number;
    fluct_rate: number;
};

export interface StockInfoState {
    info_list: StockInfo[];
}

const initialState: StockInfoState = {
    info_list: [],
};

export const fetch_all_stock_info = createAsyncThunk(
    "stock_info/fetch_all_stock_info",
    async (sid_list: string[] = []): Promise<StockInfo[]> => {
        let response = await Utils.send_request(
            `stock/info${
                sid_list.length > 0 ? `?sid-list=${sid_list.join(",")}` : ""
            }`,
            "get"
        );
        if (response && response.success) return response.data;
        else throw Error("Failed to fetch stock info");
    }
);

export const stock_info_slice = createSlice({
    name: "stock_info",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetch_all_stock_info.pending, (state) => {})
            .addCase(fetch_all_stock_info.fulfilled, (state, action) => {
                state.info_list = [...action.payload];
            })
            .addCase(fetch_all_stock_info.rejected, (state) => {});
    },
});

export default stock_info_slice.reducer;
