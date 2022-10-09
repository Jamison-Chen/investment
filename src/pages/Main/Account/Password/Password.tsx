import styles from "./Password.module.scss";

import React from "react";
import { connect } from "react-redux";

import Form from "../../../../components/Form/Form";
import RoundButton from "../../../../components/RoundButton/RoundButton";
import IconArrowLeft from "../../../../components/Icons/IconArrowLeft";
import Button from "../../../../components/Button/Button";
import LabeledInput from "../../../../components/LabeledInput/LabeledInput";
import { RouterInterface, withRouter } from "../../../../router";
import { RootState, AppDispatch } from "../../../../redux/store";
import { update_account_info } from "../../../../redux/AccountSlice";

function mapStateToProps(root_state: RootState) {
    let user_id = root_state.account.user_id;
    return { user_id };
}

interface PropsInterface
    extends RouterInterface,
        ReturnType<typeof mapStateToProps> {
    dispatch: AppDispatch;
}

interface StateInterface {
    old_password: string;
    new_password: string;
}

class Password extends React.Component<PropsInterface, StateInterface> {
    public state: StateInterface;
    public constructor(props: PropsInterface) {
        super(props);
        this.state = { old_password: "", new_password: "" };
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
                            <h1>更新密碼</h1>
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
                                更新密碼
                            </Button>
                        </>
                    }
                >
                    <LabeledInput
                        title="原密碼"
                        name="old_password"
                        type="password"
                        value={this.state.old_password}
                        onChange={this.hadle_input_change}
                    />
                    <LabeledInput
                        title="新密碼"
                        name="new_password"
                        type="password"
                        value={this.state.new_password}
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
                        old_password: this.state.old_password,
                        new_password: this.state.new_password,
                    })
                )
                .unwrap();
            this.props.router.navigate("/investment/account");
        } catch (rejectedValueOrSerializedError) {
            console.log(rejectedValueOrSerializedError);
        }
    };
}

export default connect(mapStateToProps)(withRouter(Password));
