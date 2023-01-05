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
        let loading_root = document.getElementById("loading-root")!;

        if (!document.getElementById("loading_img")) {
            let loading_img = document.createElement("img");
            loading_img.id = "loading_img";
            loading_img.src = logo;

            loading_root.appendChild(loading_img);
        }

        loading_root.className = "active";
    }
    public static remove_loading_screen(): void {
        document.getElementById("loading-root")!.className = "hidden";
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
            // e.g. 2022-01-01
            result.push(date.toLocaleDateString("af"));
        }
        return result;
    }
}
