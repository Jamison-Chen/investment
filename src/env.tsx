export default class Env {
    public static get backend_url(): string {
        if (
            window.location.href.includes("localhost") ||
            window.location.href.includes("127.0.0.1")
        ) {
            return "https://investment-backend.herokuapp.com/api/";
        } else {
            return "https://investment-backend.herokuapp.com/api/";
        }
    }
}
