import loading from "./assets/recorder_icon.png";
import Env from "./env";

export default class Utils {
    private static async handle_response(r: Response): Promise<void> {
        Utils.remove_loading_screen();
        if (r.status === 404) Utils.go_to_404_page();
        else if (r.status === 401 || r.status === 403) Utils.sign_out();
        else return r.json();
    }
    public static sign_out(): void {}
    public static get_cookie(key: string): string | null {
        let divider = key + "=";
        let decodedCookie = decodeURIComponent(document.cookie);
        let ca = decodedCookie.split(";");
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === " ") c = c.substring(1);
            if (c.indexOf(divider) === 0) {
                return c.substring(divider.length, c.length);
            }
        }
        return null;
    }
    public static delete_cookie(key: string): void {
        if (Utils.get_cookie(key)) {
            let d = new Date();
            d.setTime(d.getTime() - 10);
            document.cookie = `${key}=;expires=${d.toUTCString()};path=/investment`;
        }
    }
    public static is_at_404_page(): boolean {
        return window.location.href.includes("/404");
    }
    public static go_to_404_page(): void {
        if (!Utils.is_at_404_page()) window.location.href = "/404";
    }
    public static go_to_login_page(from?: string): void {
        if (!Utils.is_at_login_page()) {
            window.location.href = `/login${from ? `?from=${from}` : ""}`;
        }
    }
    public static is_at_login_page(): boolean {
        return window.location.href.includes(`/login`);
    }
    public static async check_login(): Promise<any> {
        return await fetch(`${Env.backend_url}account/check-login`, {
            method: "post",
            body: new URLSearchParams(),
            credentials: "include",
        }).then(Utils.handle_response);
    }
    public static render_loading_screen(): void {
        if (!document.getElementById("loading_screen")) {
            let root = document.getElementById("root") as HTMLElement;
            let loading_screen = document.createElement("div");
            loading_screen.id = "loading_screen";

            let loading_img_outer = document.createElement("img");
            loading_img_outer.id = "loading_img_outer";

            let loading_img = loading;
            loading_img_outer.src = loading_img;
            loading_screen.appendChild(loading_img_outer);

            root.appendChild(loading_screen);
        }
    }
    public static remove_loading_screen(): void {
        let loading_screen = document.getElementById(
            "loading_screen"
        ) as HTMLElement;
        if (loading_screen) loading_screen.remove();
    }
    public static format_date(
        date_string: string,
        options: Intl.DateTimeFormatOptions = {
            weekday: "short",
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
        }
    ): string {
        return new Date(date_string).toLocaleString("en-US", options);
    }
    public static are_arrays_equal(a1: any[], a2: any[]): boolean {
        return a1.length === a2.length && a1.every((e) => a2.includes(e));
    }
}

export interface GQLInterface {
    query: string;
    variables?: { [key: string]: any };
}
