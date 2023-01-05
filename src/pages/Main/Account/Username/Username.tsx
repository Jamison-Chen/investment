import styles from "./Username.module.scss";

import React from "react";
import { connect } from "react-redux";

import {
    Form,
    RoundButton,
    Button,
    LabeledInput,
} from "../../../../components";
import { IconArrowLeft } from "../../../../icons";
import { RouterInterface, withRouter } from "../../../../router";
import type { RootState, AppDispatch } from "../../../../redux/store";
import {
    update_account_info,
    fetch_account_info,
} from "../../../../redux/slices/AccountSlice";

function mapStateToProps(root_state: RootState) {
    let user_id = root_state.account.user_id;
    let username = root_state.account.username;
    return { user_id, username };
}

interface Props extends RouterInterface, ReturnType<typeof mapStateToProps> {
    dispatch: AppDispatch;
}

interface State {
    username: string;
}

class Username extends React.Component<Props, State> {
    public state: State;
    public constructor(props: Props) {
        super(props);
        this.state = { username: "" };
    }
    public async componentDidMount(): Promise<void> {
        try {
            await this.props.dispatch(fetch_account_info());
            this.setState({ username: this.props.username });
        } catch {}
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
                            <h1>姓名</h1>
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
                                className="light border"
                            >
                                捨棄
                            </Button>
                            <Button
                                onClick={this.handle_click_save_button}
                                className="primary_fill"
                            >
                                儲存
                            </Button>
                        </>
                    }
                >
                    <LabeledInput
                        title="姓名"
                        name="username"
                        type="text"
                        value={this.state.username}
                        onChange={this.hadle_input_change}
                    />
                </Form>
            </div>
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
                        id: this.props.user_id,
                        username: this.state.username,
                    })
                )
                .unwrap();
            this.props.router.navigate("/investment/account");
        } catch (rejectedValueOrSerializedError) {
            console.log(rejectedValueOrSerializedError);
        }
    };
}

export default connect(mapStateToProps)(withRouter(Username));
