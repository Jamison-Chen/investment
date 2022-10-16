import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import Utils from "../../util";
import {
    CreateTradeRecordRequestBody,
    UpdateTradeRecordRequestBody,
} from "../../api/TradeRecordApi";

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
    is_waiting: boolean;
}

const initialState: TradeRecordState = {
    record_list: [],
    is_waiting: false,
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

export const create_record = createAsyncThunk(
    "trade_record/create_record",
    async (data: CreateTradeRecordRequestBody): Promise<TradeRecord> => {
        let request_body = new URLSearchParams();
        request_body.append("mode", "create");
        request_body.append("sid", data.sid);
        request_body.append("deal_time", data.deal_time);
        request_body.append("deal_price", data.deal_price);
        request_body.append("deal_quantity", data.deal_quantity);
        request_body.append("handling_fee", data.handling_fee);
        let response = await Utils.send_request(
            "stock/trade",
            "post",
            request_body
        );
        if (response && response.success) return response.data;
        else throw Error("Failed to create trade record");
    }
);

export const update_record = createAsyncThunk(
    "trade_record/update_record",
    async (data: UpdateTradeRecordRequestBody): Promise<TradeRecord> => {
        let request_body = new URLSearchParams();
        request_body.append("mode", "update");
        request_body.append("id", data.id);
        request_body.append("sid", data.sid);
        request_body.append("deal_time", data.deal_time);
        request_body.append("deal_price", data.deal_price);
        request_body.append("deal_quantity", data.deal_quantity);
        request_body.append("handling_fee", data.handling_fee);
        let response = await Utils.send_request(
            "stock/trade",
            "post",
            request_body
        );
        if (response && response.success) return response.data;
        else throw Error("Failed to update trade record");
    }
);

export const delete_record = createAsyncThunk(
    "trade_record/delete_record",
    async (id: string | number): Promise<string | number> => {
        let request_body = new URLSearchParams();
        request_body.append("mode", "delete");
        request_body.append("id", id.toString());

        let response = await Utils.send_request(
            "stock/trade",
            "post",
            request_body
        );
        if (response && response.success) return id;
        else throw Error("Failed to delete trade record");
    }
);

export const trade_record_slice = createSlice({
    name: "trade_record",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetch_all_trade_records.pending, (state) => {
                state.is_waiting = true;
            })
            .addCase(fetch_all_trade_records.fulfilled, (state, action) => {
                state.record_list = [...action.payload].sort(
                    (a, b) => Date.parse(b.deal_time) - Date.parse(a.deal_time)
                );
                state.is_waiting = false;
            })
            .addCase(fetch_all_trade_records.rejected, (state) => {})

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
