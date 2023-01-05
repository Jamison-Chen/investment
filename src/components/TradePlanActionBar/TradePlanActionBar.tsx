import styles from "./TradePlanActionBar.module.scss";
import waiting_spinner from "../../assets/loading.svg";

import React, { MouseEvent } from "react";
import { connect } from "react-redux";

import { IconPencilSquare, IconTrash } from "../../icons";
import { Modal, RoundButton, Button, TradePlanModal } from "../../components";
import type { TradePlan } from "../../types";
import type { RootState, AppDispatch } from "../../redux/store";
import { delete_plan } from "../../redux/slices/TradePlanSlice";

function mapStateToProps(root_state: RootState) {
    let is_waiting = root_state.trade_plan.is_waiting;
    return { is_waiting };
}

interface Props extends ReturnType<typeof mapStateToProps> {
    plan: TradePlan;
    dispatch: AppDispatch;
}

interface State {
    active_modal_name: "edit" | "check_delete" | null;
}

class TradePlanActionBar extends React.Component<Props, State> {
    public state: State;
    public constructor(props: Props) {
        super(props);
        this.state = {
            active_modal_name: null,
        };
    }
    public componentDidMount(): void {}
    public render(): React.ReactNode {
        return (
            <span className={styles.main}>
                {this.active_modal}
                <RoundButton
                    className="p-8"
                    hint_text="編輯"
                    onClick={this.handle_click_pencil}
                >
                    <IconPencilSquare side_length="16" />
                </RoundButton>
                <RoundButton
                    className="p-8"
                    hint_text="刪除"
                    onClick={this.handle_click_trash_can}
                >
                    <IconTrash side_length="16" />
                </RoundButton>
            </span>
        );
    }
    private get active_modal(): React.ReactElement<Modal> | null {
        if (this.state.active_modal_name === "edit") {
            return (
                <TradePlanModal
                    plan={this.props.plan}
                    hide_modal={this.hide_modal}
                />
            );
        } else if (this.state.active_modal_name === "check_delete") {
            return (
                <Modal
                    hide_modal={this.hide_modal}
                    header_title="刪除"
                    no_x
                    footer={
                        <>
                            <Button
                                className="light l"
                                onClick={this.hide_modal}
                            >
                                取消
                            </Button>
                            <Button
                                className="dangerous_fill l"
                                onClick={this.handle_click_check_delete}
                                disabled={this.props.is_waiting}
                            >
                                {this.props.is_waiting ? (
                                    <img
                                        className={styles.waiting}
                                        src={waiting_spinner}
                                        alt=""
                                    />
                                ) : (
                                    "刪除"
                                )}
                            </Button>
                        </>
                    }
                >
                    <div className={styles.modal_inner}>
                        <div className={styles.row}>
                            <span
                                className={styles.company}
                            >{`${this.props.plan.sid} ${this.props.plan.company_name}`}</span>
                            <span className={styles.price}>
                                ${this.props.plan.target_price.toLocaleString()}
                            </span>
                            <span
                                className={this.get_plan_type_class(
                                    this.props.plan.plan_type
                                )}
                            >
                                {this.props.plan.plan_type === "buy"
                                    ? "買"
                                    : "賣"}
                            </span>
                            <span className={styles.quantity}>
                                {this.props.plan.target_quantity} 股
                            </span>
                        </div>
                        <div>您確定要刪除此筆買賣計畫嗎？</div>
                    </div>
                </Modal>
            );
        }
        return null;
    }
    private get_plan_type_class(plan_type: "buy" | "sell"): string {
        return (
            styles.trade_type +
            " " +
            (plan_type === "buy" ? styles.buy : styles.sell)
        );
    }
    private hide_modal = (): void => {
        this.setState({ active_modal_name: null });
    };
    private handle_click_pencil = (e: MouseEvent): void => {
        e.stopPropagation();
        this.setState({ active_modal_name: "edit" });
    };
    private handle_click_trash_can = (e: MouseEvent): void => {
        e.stopPropagation();
        this.setState({ active_modal_name: "check_delete" });
    };
    private handle_click_check_delete = (): void => {
        this.props
            .dispatch(delete_plan(this.props.plan.id))
            .unwrap()
            .then((response) => {
                if (response) this.setState({ active_modal_name: null });
            });
    };
}

export default connect(mapStateToProps)(TradePlanActionBar);
