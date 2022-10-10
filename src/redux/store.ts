import { configureStore } from "@reduxjs/toolkit";
import account_reducer from "./slices/AccountSlice";
import trade_record_reducer from "./slices/TradeRecordSlice";
import fetch_all_cash_dividend_reducer from "./slices/CashDividendRecordSlice";
import stock_info_reducer from "./slices/StockInfoSlice";

export const store = configureStore({
    reducer: {
        account: account_reducer,
        trade_record: trade_record_reducer,
        cash_dividend: fetch_all_cash_dividend_reducer,
        stock_info: stock_info_reducer,
    },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
