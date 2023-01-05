export default class Nav {
    public static get is_at_404_page(): boolean {
        return /^\/investment\/404[\/]?$/gs.test(window.location.pathname);
    }
    public static go_to_404_page(): void {
        if (!Nav.is_at_404_page) window.location.pathname = "/investment/404";
    }
    public static get is_at_login_page(): boolean {
        return /^\/investment\/login[\/]?$/gs.test(window.location.pathname);
    }
    public static go_to_login_page(from?: string): void {
        if (!Nav.is_at_login_page) {
            if (from) {
                window.localStorage.setItem("path_and_query_string", from);
            }
            window.location.pathname = "/investment/login";
        }
    }
}
