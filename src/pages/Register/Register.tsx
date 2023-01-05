import styles from "./Register.module.scss";

import React from "react";
import { Link } from "react-router-dom";

import { Form, Button, LabeledInput, FullLogo } from "../../components";
import { RouterInterface, withRouter } from "../../router";
import Api from "../../utils/api";

interface Props extends RouterInterface {}

interface State {
    email: string;
    username: string;
    password: string;
}

class Register extends React.Component<Props, State> {
    public state: State;
    public constructor(props: Props) {
        super(props);
        this.state = { email: "", username: "", password: "" };
    }
    public async componentDidMount(): Promise<void> {}
    public render(): React.ReactNode {
        return (
            <div className={styles.main}>
                <Form
                    header_img={<FullLogo size="m" />}
                    footer_buttons={
                        <>
                            <Button
                                onClick={this.handle_click_register_button}
                                className="primary_fill l"
                            >
                                註冊
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
                        title="姓名"
                        name="username"
                        type="text"
                        value={this.state.username}
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
                    已經有帳號了嗎？請 <Link to="/investment/login">點此</Link>{" "}
                    登入
                </div>
            </div>
        );
    }
    private hadle_input_change = (name: string, value: string): void => {
        if (name in this.state) this.setState({ [name]: value } as any);
    };
    private handle_click_register_button = async (): Promise<void> => {
        let request_body = new URLSearchParams();
        request_body.append("email", this.state.email);
        request_body.append("username", this.state.username);
        request_body.append("password", this.state.password);
        let response = await Api.send_request(
            "account/register",
            "post",
            request_body
        );
        if (response?.success) {
            this.props.router.navigate("/investment/login");
        }
    };
}

export default withRouter(Register);
