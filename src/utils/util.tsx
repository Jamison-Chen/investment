import { MouseEventHandler } from "react";
import logo from "../assets/logo.png";

export default class Util {
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
        if (Util.get_cookie(key)) {
            let d = new Date();
            d.setTime(d.getTime() - 10);
            document.cookie = `${key}=;expires=${d.toUTCString()};path=/investment`;
            document.cookie = `${key}=;expires=${d.toUTCString()};path=/`;
        }
    }
    public static render_loading_screen(): void {
        if (!document.getElementById("loading_screen")) {
            let root = document.getElementById("root") as HTMLElement;
            let loading_screen = document.createElement("div");
            loading_screen.id = "loading_screen";

            let loading_img_outer = document.createElement("img");
            loading_img_outer.id = "loading_img_outer";

            loading_img_outer.src = logo;
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
    public static get_date_string_list(
        start_date: Date,
        end_date: Date
    ): string[] {
        let result = [];
        for (
            let date = new Date(start_date);
            date <= end_date;
            date.setDate(date.getDate() + 1)
        ) {
            // Do not drop weekend because sometimes the market would open on weekend
            result.push(date.toLocaleDateString("af"));
        }
        return result;
    }
    public static hide_modal =
        (component: React.Component): MouseEventHandler =>
        (): void => {
            component.setState({ active_modal_name: null });
        };
}
