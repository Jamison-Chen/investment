export interface CreateTradeRecordRequestBody {
    sid: string;
    deal_time: string;
    deal_price: string;
    deal_quantity: string;
    handling_fee: string;
}

export interface UpdateTradeRecordRequestBody {
    id: string;
    sid: string;
    deal_time: string;
    deal_price: string;
    deal_quantity: string;
    handling_fee: string;
}
