import styles from "./DeleteAccount.module.scss";

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
import { delete_account } from "../../../../redux/slices/AccountSlice";
import { push_error } from "../../../../redux/slices/ErrorSlice";

function mapStateToProps(root_state: RootState) {
    return {};
}

interface Props extends IRouter, ReturnType<typeof mapStateToProps> {
    dispatch: AppDispatch;
}

interface State {
    password: string;
}

class DeleteAccount extends React.Component<Props, State> {
    public state: State;
    public constructor(props: Props) {
        super(props);
        this.state = { password: "" };
    }
    public async componentDidMount(): Promise<void> {}
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
                            <h1>刪除帳號</h1>
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
                                捨棄
                            </Button>
                            <Button
                                onClick={this.handle_click_delete}
                                className="dangerous_fill l"
                            >
                                確認刪除
                            </Button>
                        </>
                    }
                >
                    <div className={styles.description}>
                        提醒您，帳號刪除後即無法復原。
                    </div>
                    <LabeledInput
                        title="密碼"
                        name="password"
                        type="password"
                        value={this.state.password}
                        onChange={this.hadle_input_change}
                    />
                </Form>
            </div>
        );
    }
    private hadle_input_change = (name: string, value: string): void => {
        if (name in this.state) this.setState({ [name]: value } as any);
    };
    private handle_click_delete = async (): Promise<void> => {
        try {
            await this.props
                .dispatch(
                    delete_account({
                        password: this.state.password,
                    })
                )
                .unwrap();
            this.props.router.navigate("/investment/login");
        } catch (rejectedValueOrSerializedError) {
            this.props.dispatch(
                push_error({
                    message:
                        (rejectedValueOrSerializedError as any).message ||
                        "Failed to delete account.",
                })
            );
        }
    };
}

export default connect(mapStateToProps)(withRouter(DeleteAccount));
