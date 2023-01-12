import Env from "./env";
import Nav from "./nav";
import Util from "./util";

export default class Api {
    public static async send_request(
        endpoint: string,
        method: string,
        request_body?: URLSearchParams | string
    ): Promise<any> {
        if (method === "post" && request_body === undefined) {
            throw Error("request_body is needed in POST request");
        }

        let header = new Headers();
        header.append("Accept", "application/json");

        if (typeof request_body === "string") {
            header.append("Content-Type", "application/json");
        }

        let options: RequestInit = {
            method: method,
            headers: header,
            body: request_body,
            credentials: "include",
        };

        return await fetch(`${Env.backend_url}${endpoint}`, options).then(
            Api.handle_response
        );
    }
    private static async handle_response(r: Response): Promise<void> {
        if (r.status === 404) {
            Nav.go_to_404_page();
        } else if (r.status === 401) {
            Util.delete_cookie("token");
            Nav.go_to_login_page();
        } else return r.json();
    }
    public static async check_login(): Promise<any> {
        return await Api.send_request(
            "account/check-login",
            "post",
            new URLSearchParams()
        );
    }
}
