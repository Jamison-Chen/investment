import styles from "./Login.module.scss";

import React from "react";
import {
    Location,
    NavigateFunction,
    Params,
    URLSearchParamsInit,
    useLocation,
    useNavigate,
    useParams,
    useSearchParams,
} from "react-router-dom";

// import Button from "../../components/Button/Button";

interface PropsInterface {
    router: {
        location: Location;
        params: Params;
        navigate: NavigateFunction;
        search_params: URLSearchParams;
        set_search_params: (
            nextInit: URLSearchParamsInit,
            navigateOptions?:
                | {
                      replace?: boolean | undefined;
                      state?: any;
                  }
                | undefined
        ) => void;
    };
}

interface StateInterface {
    email: string;
    username: string;
    avatar_url: string;
    fb_access_token: string;
}

class Login extends React.Component<PropsInterface, StateInterface> {
    public state: StateInterface;
    public constructor(props: PropsInterface) {
        super(props);
        this.state = {
            email: "",
            username: "",
            avatar_url: "",
            fb_access_token: "",
        };
    }
    public componentDidMount(): void {
        // this.go_home_if_already_login();
    }
    public render(): React.ReactNode {
        return <main className={styles.main}></main>;
    }
    // private login = async () => {
    //     let request_body = new URLSearchParams();
    //     request_body.append("fb_id", this.state.fb_id);
    //     request_body.append("email", this.state.email);
    //     request_body.append("username", this.state.username);
    //     request_body.append("avatar_url", this.state.avatar_url);
    //     request_body.append("fb_access_token", this.state.fb_access_token);

    //     let response = await Utils.send_request(
    //         "account/login_or_register/",
    //         "post",
    //         request_body,
    //         Env.tenant_id,
    //         false
    //     );
    //     if (response.success) {
    //         let from = this.props.router.search_params.get("from");
    //         this.props.router.navigate(from || `/${Env.tenant_id}/`);
    //     }
    // };
    // private async go_home_if_already_login(): Promise<void> {
    //     let response: any = await Utils.check_login();
    //     try {
    //         if (response.data.me) window.location.href = `/${Env.tenant_id}/`;
    //         else throw Error("Got `data` but no `me`");
    //     } catch {}
    // }
}

export default function ComponentWithRouterProp(
    props: any = {}
): React.ReactElement {
    let location = useLocation();
    let navigate = useNavigate();
    let params = useParams();
    let [search_params, set_search_params] = useSearchParams();
    return (
        <Login
            {...props}
            router={{
                location,
                navigate,
                params,
                search_params,
                set_search_params,
            }}
        />
    );
}
