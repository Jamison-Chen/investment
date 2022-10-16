export interface CreateCashDividendRecordRequestBody {
    sid: string;
    deal_time: string;
    cash_dividend: string;
}

export interface UpdateCashDividendRecordRequestBody {
    id: string;
    sid: string;
    deal_time: string;
    cash_dividend: string;
}
