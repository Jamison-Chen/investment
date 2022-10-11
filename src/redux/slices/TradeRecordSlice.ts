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

export interface StockWarehouse {
    [sid: string]: {
        [date: string]: {
            [price: string]: number;
        };
    };
}

export interface TradeRecordState {
    record_list: TradeRecord[];
}

const initialState: TradeRecordState = {
    record_list: [],
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

export const trade_record_slice = createSlice({
    name: "trade_record",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetch_all_trade_records.pending, (state) => {})
            .addCase(fetch_all_trade_records.fulfilled, (state, action) => {
                state.record_list = [...action.payload];
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

export const get_sid_trade_records_map = (
    record_list: TradeRecord[]
): {
    [idx: string]: TradeRecord[];
} => {
    let reversed_records = [...record_list].reverse();
    let result: { [idx: string]: TradeRecord[] } = {};
    for (let record of reversed_records) {
        let s = record.sid;
        if (result[s] === undefined) result[s] = [record];
        else result[s].push(record);
    }
    return result;
};

export const get_inventory_map = (sid_trade_records_map: {
    [idx: string]: TradeRecord[];
}): { [idx: string]: number } => {
    let result: { [idx: string]: number } = {};
    for (let sid in sid_trade_records_map) {
        for (let record of sid_trade_records_map[sid]) {
            if (result[sid] === undefined) result[sid] = record.deal_quantity;
            else result[sid] += record.deal_quantity;
        }
    }
    for (let sid in result) if (result[sid] === 0) delete result[sid];
    return result;
};

export const get_stock_warehouse = (
    ascending_trade_record_list: TradeRecord[],
    result: StockWarehouse = {}
): StockWarehouse => {
    for (let record of ascending_trade_record_list) {
        let s = record.sid;
        let t = record.deal_time;
        let p = record.deal_price.toFixed(2);
        let q = record.deal_quantity;
        if (!(s in result)) result[s] = {};
        if (!(t in result[s])) result[s][t] = {};
        if (q >= 0) {
            if (!(p in result[s][t])) result[s][t][p] = q;
            else result[s][t][p] += q;
        } else {
            for (let old_t in result[s]) {
                if (Object.keys(result[s][old_t]).length === 0) {
                    delete result[s][old_t];
                    continue;
                }
                if (q === 0) break;
                for (let old_p in result[s][old_t]) {
                    let old_q = result[s][old_t][old_p];
                    let unresolved_q = q + old_q;
                    if (unresolved_q < 0) {
                        q = unresolved_q;
                        delete result[s][old_t][old_p];
                    } else {
                        if (unresolved_q === 0) delete result[s][old_t][old_p];
                        else result[s][old_t][old_p] = unresolved_q;
                        q = 0;
                        break;
                    }
                }
                if (
                    old_t in result[s] &&
                    Object.keys(result[s][old_t]).length === 0
                ) {
                    delete result[s][old_t];
                }
            }
            if (Object.keys(result[s]).length === 0) delete result[s];
        }
    }
    return result;
};

export const get_sid_cash_invested_map = (
    stock_warehouse: StockWarehouse
): { [idx: string]: number } => {
    let result: { [idx: string]: number } = {};
    for (let sid in stock_warehouse) {
        result[sid] = 0;
        for (let t in stock_warehouse[sid]) {
            for (let p in stock_warehouse[sid][t]) {
                result[sid] += stock_warehouse[sid][t][p] * parseFloat(p);
            }
        }
    }
    return result;
};

export default trade_record_slice.reducer;
