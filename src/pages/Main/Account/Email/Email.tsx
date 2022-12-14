import styles from "./Email.module.scss";

import React from "react";
import { connect } from "react-redux";

import {
    Form,
    RoundButton,
    Button,
    LabeledInput,
} from "../../../../components";
import { IconArrowLeft } from "../../../../icons";
import { IRouter, withRouter } from "../../../../router";
import type { RootState, AppDispatch } from "../../../../redux/store";
import {
    update_account_info,
    fetch_account_info,
} from "../../../../redux/slices/AccountSlice";
import { push_error } from "../../../../redux/slices/ErrorSlice";

function mapStateToProps(root_state: RootState) {
    let email = root_state.account.email;
    return { email };
}

interface Props extends IRouter, ReturnType<typeof mapStateToProps> {
    dispatch: AppDispatch;
}

interface State {
    email: string;
}

class Email extends React.Component<Props, State> {
    public state: State;
    public constructor(props: Props) {
        super(props);
        this.state = { email: "" };
    }
    public async componentDidMount(): Promise<void> {
        if (!this.props.email) {
            await this.props.dispatch(fetch_account_info());
        }
        this.setState({ email: this.props.email });
    }
    public render(): React.ReactNode {
        return (
            <div className={styles.main}>
                <Form
                    header_content={
                        <div className={styles.header}>
                            <RoundButton
                                className="p-8"
                                onClick={() =>
                                    this.props.router.navigate(
                                        "/investment/account"
                                    )
                                }
                            >
                                <IconArrowLeft side_length="20" />
                            </RoundButton>
                            <h1>Email</h1>
                        </div>
                    }
                    footer_buttons={
                        <>
                            <Button
                                onClick={() =>
                                    this.props.router.navigate(
                                        "/investment/account"
                                    )
                                }
                                className="light border l"
                            >
                                ??????
                            </Button>
                            <Button
                                onClick={this.handle_click_save_button}
                                className="primary_fill l"
                                disabled={!this.is_email_valid}
                            >
                                ??????
                            </Button>
                        </>
                    }
                >
                    <LabeledInput
                        title="email"
                        name="email"
                        type="email"
                        value={this.state.email}
                        onChange={this.hadle_input_change}
                    />
                </Form>
            </div>
        );
    }
    private get is_email_valid(): boolean {
        return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/gs.test(
            this.state.email
        );
    }
    private hadle_input_change = (name: string, value: string): void => {
        if (name in this.state) this.setState({ [name]: value } as any);
    };
    private handle_click_save_button = async (): Promise<void> => {
        try {
            await this.props
                .dispatch(
                    update_account_info({
                        email: this.state.email,
                    })
                )
                .unwrap();
            this.props.router.navigate("/investment/account");
        } catch (rejectedValueOrSerializedError) {
            this.props.dispatch(
                push_error({
                    message:
                        (rejectedValueOrSerializedError as any).message ||
                        "Failed to update email.",
                })
            );
        }
    };
}

export default connect(mapStateToProps)(withRouter(Email));
