import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import type {
    CreateTradePlanRequestBody,
    UpdateTradePlanRequestBody,
    TradePlan,
} from "../../types";
import Api from "../../utils/api";

export interface TradePlanState {
    trade_plan_list: TradePlan[];
    is_waiting: boolean;
}

const initialState: TradePlanState = {
    trade_plan_list: [],
    is_waiting: false,
};

export const fetch_all_trade_plans = createAsyncThunk(
    "trade_plan/fetch_all_trade_plans",
    async (): Promise<TradePlan[]> => {
        let request_body = new URLSearchParams();
        request_body.append("mode", "read");

        let response = await Api.send_request(
            "stock/plan",
            "post",
            request_body
        );
        if (response?.success) return response.data;
        else throw Error("Failed to fetch trade plans");
    }
);

export const create_plan = createAsyncThunk(
    "trade_plan/create_plan",
    async (data: CreateTradePlanRequestBody): Promise<TradePlan> => {
        let request_body = new URLSearchParams();
        request_body.append("mode", "create");
        request_body.append("sid", data.sid);
        request_body.append("plan_type", data.plan_type);
        request_body.append("target_price", data.target_price);
        request_body.append("target_quantity", data.target_quantity);
        let response = await Api.send_request(
            "stock/plan",
            "post",
            request_body
        );
        if (response?.success) return response.data;
        else throw Error("Failed to create trade plan");
    }
);

export const update_plan = createAsyncThunk(
    "trade_plan/update_plan",
    async (data: UpdateTradePlanRequestBody): Promise<TradePlan> => {
        let request_body = new URLSearchParams();
        request_body.append("mode", "update");
        request_body.append("id", data.id);
        request_body.append("sid", data.sid);
        request_body.append("plan_type", data.plan_type);
        request_body.append("target_price", data.target_price);
        request_body.append("target_quantity", data.target_quantity);
        let response = await Api.send_request(
            "stock/plan",
            "post",
            request_body
        );
        if (response?.success) return response.data;
        else throw Error("Failed to update trade plan");
    }
);

export const delete_plan = createAsyncThunk(
    "trade_plan/delete_plan",
    async (id: string | number): Promise<string | number> => {
        let request_body = new URLSearchParams();
        request_body.append("mode", "delete");
        request_body.append("id", id.toString());

        let response = await Api.send_request(
            "stock/plan",
            "post",
            request_body
        );
        if (response?.success) return id;
        else throw Error("Failed to delete trade plan");
    }
);

export const trade_plan_slice = createSlice({
    name: "trade_plan",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetch_all_trade_plans.pending, (state) => {
                state.is_waiting = true;
            })
            .addCase(fetch_all_trade_plans.fulfilled, (state, action) => {
                state.trade_plan_list = action.payload;
                state.is_waiting = false;
            })
            .addCase(fetch_all_trade_plans.rejected, (state) => {})

            .addCase(create_plan.pending, (state) => {
                state.is_waiting = true;
            })
            .addCase(create_plan.fulfilled, (state, action) => {
                state.trade_plan_list = [
                    action.payload,
                    ...state.trade_plan_list,
                ];
                state.is_waiting = false;
            })
            .addCase(create_plan.rejected, (state) => {})

            .addCase(update_plan.pending, (state) => {
                state.is_waiting = true;
            })
            .addCase(update_plan.fulfilled, (state, action) => {
                state.trade_plan_list = state.trade_plan_list.map((plan) => {
                    if (plan.id === action.payload.id) {
                        return action.payload;
                    }
                    return plan;
                });
                state.is_waiting = false;
            })
            .addCase(update_plan.rejected, (state) => {})

            .addCase(delete_plan.pending, (state) => {
                state.is_waiting = true;
            })
            .addCase(delete_plan.fulfilled, (state, action) => {
                state.trade_plan_list = [...state.trade_plan_list].filter(
                    (plan) => plan.id !== action.payload
                );
                state.is_waiting = false;
            })
            .addCase(delete_plan.rejected, (state) => {});
    },
});

export const get_sid_trade_plans_map = (
    trade_plan_list: TradePlan[]
): { [idx: string]: TradePlan[] } => {
    let result: { [idx: string]: TradePlan[] } = {};
    for (let plan of trade_plan_list) {
        let s = plan.sid;
        if (result[s] === undefined) result[s] = [plan];
        else result[s].push(plan);
    }
    return result;
};

export default trade_plan_slice.reducer;
