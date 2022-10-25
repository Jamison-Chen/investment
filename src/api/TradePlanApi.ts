export interface CreateTradePlanRequestBody {
    sid: string;
    plan_type: "buy" | "sell";
    target_price: string;
    target_quantity: string;
}

export interface UpdateTradePlanRequestBody {
    id: string;
    sid: string;
    plan_type: "buy" | "sell";
    target_price: string;
    target_quantity: string;
}
