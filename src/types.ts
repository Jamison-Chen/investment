export type UpdateAccountInfoRequestBody = {
    id: string;
    email?: string;
    username?: string;
    avatar_url?: string;
    old_password?: string;
    new_password?: string;
};

export type CreateCashDividendRecordRequestBody = {
    sid: string;
    deal_time: string;
    cash_dividend: string;
};

export type UpdateCashDividendRecordRequestBody = {
    id: string;
    sid: string;
    deal_time: string;
    cash_dividend: string;
};

export type UpdateOrCreateMemoRequestBody = {
    sid: string;
    business?: string;
    strategy?: string;
    note?: string;
};

export type CreateTradePlanRequestBody = {
    sid: string;
    plan_type: "buy" | "sell";
    target_price: string;
    target_quantity: string;
};

export type UpdateTradePlanRequestBody = {
    id: string;
    sid: string;
    plan_type: "buy" | "sell";
    target_price: string;
    target_quantity: string;
};

export type CreateTradeRecordRequestBody = {
    sid: string;
    deal_time: string;
    deal_price: string;
    deal_quantity: string;
    handling_fee: string;
};

export type UpdateTradeRecordRequestBody = {
    id: string;
    sid: string;
    deal_time: string;
    deal_price: string;
    deal_quantity: string;
    handling_fee: string;
};

export type StockWarehouse = {
    [sid: string]: {
        [date: string]: {
            [price: string]: number;
        };
    };
};

export type CashDividendRecord = {
    id: number;
    deal_time: string;
    sid: string;
    company_name: string;
    cash_dividend: number;
};

export type Error = {
    message: string;
};

export type Memo = {
    id: string;
    sid: string;
    company_name: string;
    business: string;
    strategy: string;
    note: string;
};

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

export type TradePlan = {
    id: string;
    sid: string;
    company_name: string;
    plan_type: "buy" | "sell";
    target_price: number;
    target_quantity: number;
};

export type TradeRecord = {
    id: number;
    deal_time: string;
    sid: string;
    company_name: string;
    deal_price: number;
    deal_quantity: number;
    handling_fee: number;
};

export type GQLInterface = {
    query: string;
    variables?: { [key: string]: any };
};
