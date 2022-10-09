import styles from "./Login.module.scss";

import React from "react";
import { Link } from "react-router-dom";

import Form from "../../components/Form/Form";
import Utils from "../../util";
import Button from "../../components/Button/Button";
import LabeledInput from "../../components/LabeledInput/LabeledInput";
import FullLogo from "../../components/FullLogo/FullLogo";
import { RouterInterface, withRouter } from "../../router";

interface PropsInterface extends RouterInterface {}

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
                    header_content={<FullLogo size="m" />}
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

export default withRouter(Login);
