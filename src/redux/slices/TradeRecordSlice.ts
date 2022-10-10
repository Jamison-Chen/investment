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
    trade_record_list: TradeRecord[]
): StockWarehouse => {
    let result: StockWarehouse = {};
    let ascending_trade_record_list = [...trade_record_list].sort((a, b) => {
        return Date.parse(a.deal_time) - Date.parse(b.deal_time);
    });
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

// export const get_cash_invested_chart_data = (
//     trade_record_list: TradeRecord[]
// ): (string | number)[][] => {
//     let ascending_trade_record_list = [...trade_record_list].sort((a, b) => {
//         return Date.parse(a.deal_time) - Date.parse(b.deal_time);
//     });
//     let non_zero_inventory_sid_list: string[] = [
//         ...new Set(trade_record_list.map((record) => record.sid)),
//     ];

//     // To be returned
//     let cash_invested_chart_data: (string | number)[][] = [
//         ["日期", "投入金額"],
//     ];
//     let everydate_to_sid_to_p_to_q: {
//         [date: string]: {
//             [sid: string]: { [p_string: string]: { q: number; sold: number } };
//         };
//     } = {};

//     if (ascending_trade_record_list.length > 0) {
//         let start_date_string = ascending_trade_record_list[0].deal_time;
//         let date_string_list = Utils.get_date_string_list(
//             new Date(start_date_string),
//             new Date()
//         );
//         let sid_column_idx_map: { [idx: string]: number } = {};
//         non_zero_inventory_sid_list.forEach(
//             (sid, idx) => (sid_column_idx_map[sid] = idx + 1)
//         );
//         for (let date_string of date_string_list) {
//             everydate_to_sid_to_p_to_q[date_string] = {};
//             let date = new Date(date_string);
//             date.setDate(date.getDate() - 1);
//             if (date.toLocaleDateString("af") in everydate_to_sid_to_p_to_q) {
//                 for (let sid of non_zero_inventory_sid_list) {
//                     everydate_to_sid_to_p_to_q[date_string][sid] = JSON.parse(
//                         JSON.stringify(
//                             everydate_to_sid_to_p_to_q[
//                                 date.toLocaleDateString("af")
//                             ][sid]
//                         )
//                     );
//                 }
//             } else {
//                 for (let sid of non_zero_inventory_sid_list) {
//                     everydate_to_sid_to_p_to_q[date_string][sid] = {};
//                 }
//             }

//             ascending_trade_record_list
//                 .filter((record: TradeRecord) => {
//                     return record.deal_time === date_string;
//                 })
//                 .forEach((record: TradeRecord) => {
//                     let s: string = record.sid;
//                     let t: string = record.deal_time;
//                     let p: number = record.deal_price;
//                     let q: number = record.deal_quantity;
//                     if (q >= 0) {
//                         // buying
//                         if (p in everydate_to_sid_to_p_to_q[t][s]) {
//                             everydate_to_sid_to_p_to_q[t][s][p].q += q;
//                         } else {
//                             everydate_to_sid_to_p_to_q[t][s][p] = {
//                                 q: q,
//                                 sold: 0,
//                             };
//                         }
//                     } else {
//                         // selling
//                         for (let old_date in everydate_to_sid_to_p_to_q) {
//                             if (q === 0) break;
//                             for (let each_p in everydate_to_sid_to_p_to_q[
//                                 old_date
//                             ][s]) {
//                                 let unsold: number =
//                                     everydate_to_sid_to_p_to_q[old_date][s][
//                                         each_p
//                                     ].q -
//                                     everydate_to_sid_to_p_to_q[old_date][s][
//                                         each_p
//                                     ].sold;
//                                 let unresolved_q = q + unsold;
//                                 if (unresolved_q < 0) {
//                                     q = unresolved_q;
//                                     delete everydate_to_sid_to_p_to_q[t][s][
//                                         each_p
//                                     ];
//                                 } else {
//                                     if (unresolved_q === 0) {
//                                         delete everydate_to_sid_to_p_to_q[t][s][
//                                             each_p
//                                         ];
//                                     } else {
//                                         // everydate_to_sid_to_p_to_q[t][s][
//                                         //     each_p
//                                         // ] = unsold + q;
//                                     }
//                                     q = 0;
//                                     break;
//                                 }
//                             }
//                         }
//                     }
//                 });
//             ascending_trade_record_list = ascending_trade_record_list.filter(
//                 (record: TradeRecord) => record.deal_time !== date_string
//             );
//         }

//         // Complete cash_invested_chart_data
//         for (let t of date_string_list) {
//             let cash_invested = 0;
//             // for (let s in everydate_to_sid_to_p_to_q[t]) {
//             //     for (let p in everydate_to_sid_to_p_to_q[t][s]) {
//             //         cash_invested +=
//             //             everydate_to_sid_to_p_to_q[t][s][p] * parseFloat(p);
//             //     }
//             // }
//             cash_invested_chart_data.push([t, cash_invested]);
//         }
//     } else {
//         cash_invested_chart_data = [["Date", "Cash Invested"]];
//     }

//     return cash_invested_chart_data;
// };

export default trade_record_slice.reducer;

// if (trade_record_list.length > 0) {
//     let ascending_trade_record_list = [...trade_record_list].sort(
//         (a, b) => {
//             return Date.parse(a.deal_time) - Date.parse(b.deal_time);
//         }
//     );
//     let start_date_string = ascending_trade_record_list[0].deal_time;
//     let date_string_list = Utils.get_date_string_list(
//         new Date(start_date_string),
//         new Date()
//     );
//     let sid_column_idx_map: { [idx: string]: number } = {};
//     non_zero_inventory_sid_list.forEach(
//         (sid, idx) => (sid_column_idx_map[sid] = idx + 1)
//     );
//     for (let date_string of date_string_list) {
//         // [
//         //  [Date, 2330, 2317, ..., Sum],
//         //  [1/1, $100, $120, ..., $xxx], <= This is a row
//         //          .
//         //          .
//         //          .
//         // ]
//         let row: (string | number)[];
//         // Create a new row whose values is the copy of the previous row.
//         if (cash_invested_chart_data.length > 0) {
//             row = [
//                 date_string,
//                 ...cash_invested_chart_data[
//                     cash_invested_chart_data.length - 1
//                 ].slice(1, -1),
//             ];
//         } else
//             row = [
//                 date_string,
//                 ...non_zero_inventory_sid_list.map(() => 0),
//             ];

//         ascending_trade_record_list
//             .filter((record: TradeRecord) => {
//                 return record.deal_time === date_string;
//             })
//             .forEach((record: TradeRecord) => {
//                 let s: string = record.sid;
//                 let t: string = record.deal_time;
//                 let p: number = record.deal_price;
//                 let q: number = record.deal_quantity;
//                 let column_idx = sid_column_idx_map[s];
//                 if (q >= 0) {
//                     // buying
//                     row[column_idx] =
//                         Math.round(
//                             ((row[column_idx] as number) + p * q) * 100
//                         ) / 100;
//                 } else {
//                     // selling
//                     let is_the_sell_record_resolved = false;
//                     for (let each_t in stock_warehouse[s]) {
//                         if (is_the_sell_record_resolved) break;
//                         else if (Date.parse(each_t) < Date.parse(t)) {
//                             for (let each_p in stock_warehouse[s][each_t]) {
//                                 let cost = parseFloat(each_p);
//                                 let each_q =
//                                     stock_warehouse[s][each_t][each_p];
//                                 row[column_idx] =
//                                     Math.round(
//                                         ((row[column_idx] as number) -
//                                             cost *
//                                                 Math.min(-1 * q, each_q)) *
//                                             100
//                                     ) / 100;
//                                 let remain = each_q + q;
//                                 stock_warehouse[s][each_t][each_p] =
//                                     Math.max(0, remain);
//                                 q = Math.min(0, remain);
//                                 if (remain >= 0) {
//                                     is_the_sell_record_resolved = true;
//                                     break;
//                                 }
//                             }
//                         }
//                     }
//                     stock_warehouse[s][t][p.toFixed(2)] = q;
//                 }
//             });
//         // calculate the sum of cash invested of this date
//         let total = [...row]
//             .slice(1)
//             .reduce((a, b) => (a as number) + (b as number), 0);
//         row.push(total);
//         cash_invested_chart_data.push(row);
//         ascending_trade_record_list = ascending_trade_record_list.filter(
//             (record: TradeRecord) => record.deal_time !== date_string
//         );
//     }
//     // Complete sid_cash_invested_map
//     cash_invested_chart_data[cash_invested_chart_data.length - 1]
//         .slice(1)
//         .forEach((balance, idx) => {
//             sid_cash_invested_map[non_zero_inventory_sid_list[idx]] =
//                 balance as number;
//         });
//     // Only use the "date" field and the "total" field of cash_invested_chart_data
//     cash_invested_chart_data = [
//         ["Date", "Cash Invested"],
//         ...cash_invested_chart_data.map((i) => [i[0], i[i.length - 1]]),
//     ];
//     // Complete total_cash_invested
//     total_cash_invested = cash_invested_chart_data[
//         cash_invested_chart_data.length - 1
//     ][1] as number;
// } else {
//     cash_invested_chart_data = [["Date", "Cash Invested"]];
// }
