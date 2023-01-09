import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import type {
    CreateTradeRecordRequestBody,
    UpdateTradeRecordRequestBody,
    TradeRecord,
    StockWarehouse,
} from "../../types";
import Api from "../../utils/api";

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

        let response = await Api.send_request(
            "stock/trade",
            "post",
            request_body
        );
        if (response?.success) return response.data;
        else throw Error("Failed to fetch trade records");
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
        let response = await Api.send_request(
            "stock/trade",
            "post",
            request_body
        );
        if (response?.success) return response.data;
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
        let response = await Api.send_request(
            "stock/trade",
            "post",
            request_body
        );
        if (response?.success) return response.data;
        else throw Error("Failed to update trade record");
    }
);

export const delete_record = createAsyncThunk(
    "trade_record/delete_record",
    async (id: string | number): Promise<string | number> => {
        let request_body = new URLSearchParams();
        request_body.append("mode", "delete");
        request_body.append("id", id.toString());

        let response = await Api.send_request(
            "stock/trade",
            "post",
            request_body
        );
        if (response?.success) return id;
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
): { [idx: string]: TradeRecord[] } => {
    let reversed_records = [...record_list].reverse();
    let result: { [idx: string]: TradeRecord[] } = {};
    for (let record of reversed_records) {
        let s = record.sid;
        if (result[s] === undefined) result[s] = [record];
        else result[s].push(record);
    }
    return result;
};

export const get_inventory_map = (
    sid_trade_records_map: ReturnType<typeof get_sid_trade_records_map>
): { [idx: string]: number } => {
    let result: { [idx: string]: number } = {};
    for (const [sid, trade_record_list] of Object.entries(
        sid_trade_records_map
    )) {
        for (let record of trade_record_list) {
            if (result[sid] === undefined) result[sid] = record.deal_quantity;
            else result[sid] += record.deal_quantity;
        }
    }
    for (let sid in result) if (result[sid] === 0) delete result[sid];
    return result;
};

export const get_stock_warehouse = (
    ascending_trade_record_list: TradeRecord[]
): StockWarehouse => {
    return update_stock_warehouse(ascending_trade_record_list, {});
};

export const update_stock_warehouse = (
    ascending_trade_record_list: TradeRecord[],
    before: StockWarehouse = {}
): StockWarehouse => {
    for (let record of ascending_trade_record_list) {
        let s = record.sid;
        let t = record.deal_time;
        let p = record.deal_price.toFixed(2);
        let q = record.deal_quantity;
        if (!(s in before)) before[s] = {};
        if (!(t in before[s])) before[s][t] = {};
        if (q >= 0) {
            if (!(p in before[s][t])) before[s][t][p] = q;
            else before[s][t][p] += q;
        } else {
            for (let old_t in before[s]) {
                if (Object.keys(before[s][old_t]).length === 0) {
                    delete before[s][old_t];
                    continue;
                }
                if (q === 0) break;
                for (let old_p in before[s][old_t]) {
                    let old_q = before[s][old_t][old_p];
                    let unresolved_q = q + old_q;
                    if (unresolved_q < 0) {
                        q = unresolved_q;
                        delete before[s][old_t][old_p];
                    } else {
                        if (unresolved_q === 0) delete before[s][old_t][old_p];
                        else before[s][old_t][old_p] = unresolved_q;
                        q = 0;
                        break;
                    }
                }
                if (
                    old_t in before[s] &&
                    Object.keys(before[s][old_t]).length === 0
                ) {
                    delete before[s][old_t];
                }
            }
            if (Object.keys(before[s]).length === 0) delete before[s];
        }
    }
    return before;
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

export const get_sid_handling_fee_map = (
    sid_trade_records_map: ReturnType<typeof get_sid_trade_records_map>
): { [idx: string]: number } => {
    let result: { [idx: string]: number } = {};
    for (let sid in sid_trade_records_map) {
        for (let record of sid_trade_records_map[sid]) {
            if (result[sid] === undefined) result[sid] = record.handling_fee;
            else result[sid] += record.handling_fee;
        }
    }
    return result;
};

export const get_sid_gain_map = (
    sid_trade_records_map: ReturnType<typeof get_sid_trade_records_map>
): { [sid: string]: number } => {
    let sid_gain_map: { [sid: string]: number } = {};

    for (let sid in sid_trade_records_map) {
        // `queue` can only contain elements with all positive q or all negative q
        let queue: { q: number; p: number }[] = [];
        sid_gain_map[sid] = 0;

        for (let record of sid_trade_records_map[sid]) {
            let q = record.deal_quantity;
            let p = record.deal_price;
            if (queue.length === 0) queue.push({ q: q, p: p });
            else {
                // Check if the last q in `queue` is of the same sign as the incoming q
                if (queue[queue.length - 1].q * q > 0) {
                    queue.push({ q: q, p: p });
                } else {
                    while (queue.length > 0 && q !== 0) {
                        // Check if there's remaining q after eliminating the first
                        // element in `queue` with the incoming q
                        if ((queue[0].q + q) * queue[0].q > 0) {
                            queue[0].q += q;
                            sid_gain_map[sid] += (p - queue[0].p) * -q;
                            q = 0;
                        } else {
                            q += queue[0].q;
                            sid_gain_map[sid] += (p - queue[0].p) * queue[0].q;
                            queue.shift();
                        }
                    }
                }
            }
        }
    }

    return sid_gain_map;
};

export default trade_record_slice.reducer;
