export default class Env {
    public static get backend_url(): string {
        if (
            window.location.href.includes("localhost") ||
            window.location.href.includes("127.0.0.1")
        ) {
            return "http://127.0.0.1:8000/api/";
        } else {
            return "https://investment-backend.herokuapp.com/api/";
        }
    }
}
