import styles from "./StockMemoModal.module.scss";
import waiting_spinner from "../../assets/loading.svg";

import React, { ChangeEvent } from "react";
import { connect } from "react-redux";

import { Modal, Button, AutoResizeTextarea } from "..";
import type { RootState, AppDispatch } from "../../redux/store";
import { update_or_create_memo } from "../../redux/slices/MemoSlice";

function mapStateToProps(root_state: RootState) {
    let is_waiting = root_state.trade_plan.is_waiting;
    return { is_waiting };
}

interface Props extends ReturnType<typeof mapStateToProps> {
    sid: string;
    field_name: "business" | "strategy" | "note";
    field_default_value: string;
    hide_modal: Function;
    dispatch: AppDispatch;
}

interface State {
    sid: string;
    field_value: string;
}

class StockMemoModal extends React.Component<Props, State> {
    public state: State;
    public constructor(props: Props) {
        super(props);
        this.state = {
            sid: "",
            field_value: "",
        };
    }
    public componentDidMount(): void {
        this.setState((state, props) => {
            return {
                sid: props.sid,
                field_value: props.field_default_value,
            };
        });
    }
    public render(): React.ReactNode {
        return (
            <Modal
                header_title={`${
                    this.props.field_name === "business"
                        ? "主要業務"
                        : this.props.field_name === "strategy"
                        ? "投資策略"
                        : this.props.field_name === "note"
                        ? "備註"
                        : null
                }`}
                hide_modal={this.props.hide_modal}
                no_x
                silent_background
                footer={
                    <>
                        <Button
                            className="light border l"
                            onClick={() => this.props.hide_modal()}
                        >
                            捨棄
                        </Button>
                        <Button
                            className="primary_fill l"
                            onClick={this.handle_click_submit}
                            disabled={!this.can_submit}
                        >
                            {this.props.is_waiting ? (
                                <img
                                    className={styles.waiting}
                                    src={waiting_spinner}
                                    alt=""
                                />
                            ) : (
                                "送出"
                            )}
                        </Button>
                    </>
                }
            >
                <div className={styles.modal_inner}>
                    <AutoResizeTextarea
                        value={this.state.field_value}
                        onChange={this.handle_value_change}
                        auto_focus
                    />
                </div>
            </Modal>
        );
    }
    private get can_submit(): boolean {
        return !this.props.is_waiting;
    }
    private handle_value_change = (
        e: ChangeEvent<HTMLTextAreaElement>
    ): void => {
        this.setState({ field_value: e.target.value });
    };
    private handle_click_submit = async (): Promise<void> => {
        if (this.can_submit) {
            this.props
                .dispatch(
                    update_or_create_memo({
                        sid: this.state.sid,
                        [this.props.field_name]: this.state.field_value.trim(),
                    })
                )
                .unwrap()
                .then((response) => {
                    if (response) this.props.hide_modal();
                });
        }
    };
}

export default connect(mapStateToProps)(StockMemoModal);
