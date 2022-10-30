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
        if (response?.success) return response.data;
        else throw Error("Failed to fetch stock info");
    }
);

export const fetch_single_stock_info = createAsyncThunk(
    "stock_info/fetch_single_stock_info",
    async (sid: string): Promise<StockInfo> => {
        let response = await Utils.send_request(
            `stock/info?sid-list=${sid}`,
            "get"
        );
        if (response?.success) return response.data;
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
            .addCase(fetch_all_stock_info.rejected, (state) => {})

            .addCase(fetch_single_stock_info.pending, (state) => {})
            .addCase(fetch_single_stock_info.fulfilled, (state, action) => {
                state.info_list = [
                    action.payload,
                    ...state.info_list.filter(
                        (each) => each.sid !== action.payload.sid
                    ),
                ];
            })
            .addCase(fetch_single_stock_info.rejected, (state) => {});
    },
});

export const get_sid_stock_info_map = (
    stock_info_list: StockInfo[]
): { [idx: string]: StockInfo } => {
    let result: { [idx: string]: StockInfo } = {};
    stock_info_list.forEach((each) => (result[each.sid] = each));
    return result;
};

export const get_sid_market_value_map = (
    stock_info_list: StockInfo[],
    inventory_map: { [idx: string]: number }
) => {
    let result: { [idx: string]: number } = {};
    for (const [sid, inventory] of Object.entries(inventory_map)) {
        result[sid] =
            stock_info_list.find((info) => info.sid === sid)!.close * inventory;
    }
    return result;
};

export const get_total_market_value = (
    stock_info_list: StockInfo[],
    inventory_map: { [idx: string]: number }
): number => {
    let result = 0;
    for (const [sid, inventory] of Object.entries(inventory_map)) {
        result +=
            stock_info_list.find((info) => info.sid === sid)!.close * inventory;
    }
    return result;
};

export default stock_info_slice.reducer;
