import styles from "./Login.module.scss";
import recorder_icon from "../../assets/recorder_icon.png";

import React from "react";
import {
    Link,
    Location,
    NavigateFunction,
    Params,
    URLSearchParamsInit,
    useLocation,
    useNavigate,
    useParams,
    useSearchParams,
} from "react-router-dom";

import Form from "../../components/Form/Form";
import Utils from "../../util";
import Button from "../../components/Button/Button";
import LabeledInput from "../../components/LabeledInput/LabeledInput";

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
    password: string;
}

class Login extends React.Component<PropsInterface, StateInterface> {
    public state: StateInterface;
    public constructor(props: PropsInterface) {
        super(props);
        this.state = { email: "", password: "" };
    }
    public async componentDidMount(): Promise<void> {
        // Go home if already login
        let response: any = await Utils.check_login();
        if (response && response.success) {
            this.props.router.navigate("/investment");
        }
        window.addEventListener("keypress", this.handle_hit_enter);
    }
    public render(): React.ReactNode {
        return (
            <div className={styles.main}>
                <Form
                    header_img={<img src={recorder_icon} alt="logo" />}
                    footer_buttons={
                        <>
                            <Button
                                onClick={this.handle_click_login_button}
                                className="primary_fill l"
                            >
                                登入
                            </Button>
                        </>
                    }
                >
                    <LabeledInput
                        title="Email"
                        name="email"
                        type="email"
                        value={this.state.email}
                        onChange={this.hadle_input_change}
                    />
                    <LabeledInput
                        title="密碼"
                        name="password"
                        type="password"
                        value={this.state.password}
                        onChange={this.hadle_input_change}
                    />
                </Form>
                <div className={styles.switch}>
                    還沒有帳號嗎？請 <Link to="/investment/register">點此</Link>{" "}
                    註冊
                </div>
            </div>
        );
    }
    private hadle_input_change = (name: string, value: string): void => {
        if (name in this.state) this.setState({ [name]: value } as any);
    };
    private handle_click_login_button = async (): Promise<void> => {
        let request_body = new URLSearchParams();
        request_body.append("email", this.state.email);
        request_body.append("password", this.state.password);
        let response = await Utils.send_request(
            "account/login",
            "post",
            request_body
        );
        if (response.success) {
            let from = this.props.router.search_params.get("from");
            this.props.router.navigate(from || `/investment`);
        }
    };
    private handle_hit_enter = (e: KeyboardEvent): void => {
        if (e.key === "Enter" && this.state.email && this.state.password) {
            this.handle_click_login_button();
        }
    };
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
