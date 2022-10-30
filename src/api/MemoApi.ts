export interface CreateMemoRequestBody {
    sid: string;
    business: string;
    strategy: string;
    note: string;
}

export interface UpdateMemoRequestBody {
    id: string;
    business: string;
    strategy: string;
    note: string;
}
