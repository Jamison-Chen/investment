import { configureStore } from "@reduxjs/toolkit";
import account_reducer from "../pages/Main/Account/AccountSlice";

export const store = configureStore({
    reducer: {
        account: account_reducer,
    },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
