import styles from "./Avatar.module.scss";

import React from "react";
import { connect } from "react-redux";

import { IRouter, withRouter } from "../../../../router";
import {
    Form,
    RoundButton,
    Button,
    LabeledInput,
} from "../../../../components";
import { IconArrowLeft } from "../../../../icons";
import type { RootState, AppDispatch } from "../../../../redux/store";
import {
    update_account_info,
    fetch_account_info,
} from "../../../../redux/slices/AccountSlice";
import { push_error } from "../../../../redux/slices/ErrorSlice";

function mapStateToProps(root_state: RootState) {
    let avatar_url = root_state.account.avatar_url;
    return { avatar_url };
}

interface Props extends IRouter, ReturnType<typeof mapStateToProps> {
    dispatch: AppDispatch;
}

interface State {
    avatar_url: string;
}

class Avatar extends React.Component<Props, State> {
    public state: State;
    public constructor(props: Props) {
        super(props);
        this.state = { avatar_url: "" };
    }
    public async componentDidMount(): Promise<void> {
        if (!this.props.avatar_url) {
            await this.props.dispatch(fetch_account_info());
        }
        this.setState({ avatar_url: this.props.avatar_url || "" });
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
                            <h1>頭像</h1>
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
                                onClick={this.handle_click_save_button}
                                className="primary_fill l"
                            >
                                儲存
                            </Button>
                        </>
                    }
                >
                    <LabeledInput
                        title="頭像網址"
                        name="avatar_url"
                        type="text"
                        value={this.state.avatar_url || ""}
                        onChange={this.hadle_input_change}
                    />
                    {this.state.avatar_url ? (
                        <img
                            className={styles.avatar_preview}
                            src={this.state.avatar_url}
                            alt="圖片網址有誤"
                        />
                    ) : null}
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
                        avatar_url: this.state.avatar_url,
                    })
                )
                .unwrap();
            this.props.router.navigate("/investment/account");
        } catch (rejectedValueOrSerializedError) {
            this.props.dispatch(
                push_error({
                    message:
                        (rejectedValueOrSerializedError as any).message ||
                        "Failed to update avatar url.",
                })
            );
        }
    };
}

export default connect(mapStateToProps)(withRouter(Avatar));
