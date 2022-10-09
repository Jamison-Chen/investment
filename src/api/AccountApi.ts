export interface UpdateAccountInfoRequestBody {
    id: string;
    email?: string;
    username?: string;
    avatar_url?: string;
    old_password?: string;
    new_password?: string;
}
