import styles from "./TradePlanModal.module.scss";
import waiting_spinner from "../../assets/loading.svg";

import React from "react";
import { connect } from "react-redux";

import { Modal, Button, LabeledInput } from "../../components";
import { IconToggleOn } from "../../icons";
import type { TradePlan } from "../../types";
import type { RootState, AppDispatch } from "../../redux/store";
import { create_plan, update_plan } from "../../redux/slices/TradePlanSlice";

function mapStateToProps(root_state: RootState) {
    let is_waiting = root_state.trade_plan.is_waiting;
    return { is_waiting };
}

interface Props extends ReturnType<typeof mapStateToProps> {
    default_sid?: string;
    plan?: TradePlan;
    hide_modal: Function;
    dispatch: AppDispatch;
}

interface State {
    plan_id: string | null;
    sid: string;
    target_price: number;
    plan_type: "buy" | "sell";
    target_quantity: number;
}

class TradePlanModal extends React.Component<Props, State> {
    public state: State;
    public constructor(props: Props) {
        super(props);
        this.state = {
            plan_id: null,
            sid: "",
            target_price: NaN,
            plan_type: "buy",
            target_quantity: NaN,
        };
    }
    public componentDidMount(): void {
        this.setState((state, props) => {
            if (props.plan) {
                return {
                    plan_id: props.plan.id.toString(),
                    sid: props.plan.sid,
                    target_price: props.plan.target_price,
                    plan_type: props.plan.plan_type,
                    target_quantity: props.plan.target_quantity,
                } as State;
            } else if (props.default_sid) {
                return { sid: props.default_sid } as State;
            }
            return {};
        });
    }
    public render(): React.ReactNode {
        return (
            <Modal
                header_title={`${this.props.plan ? "編輯" : "新增"}買賣計畫`}
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
                    <LabeledInput
                        title="證券代號"
                        name="sid"
                        value={this.state.sid}
                        onChange={this.handle_input_change}
                    />
                    <div className={styles.row}>
                        <LabeledInput
                            title="目標價格"
                            type="number"
                            name="target_price"
                            value={
                                this.state.target_price ||
                                this.state.target_price === 0
                                    ? this.state.target_price.toString()
                                    : ""
                            }
                            onChange={this.handle_input_change}
                        />
                        <div className={styles.buy_or_sell}>
                            <span>買</span>
                            <span
                                className={
                                    styles.toggle_outer +
                                    " " +
                                    (this.state.plan_type === "buy"
                                        ? styles.buy
                                        : styles.sell)
                                }
                                onClick={this.handle_click_toggle}
                            >
                                <IconToggleOn side_length="28" />
                            </span>
                            <span>賣</span>
                        </div>
                        <LabeledInput
                            title="目標股數"
                            type="number"
                            name="target_quantity"
                            value={
                                this.state.target_quantity ||
                                this.state.target_quantity === 0
                                    ? this.state.target_quantity.toString()
                                    : ""
                            }
                            onChange={this.handle_input_change}
                        />
                    </div>
                </div>
            </Modal>
        );
    }
    private get can_submit(): boolean {
        if (
            this.state.sid &&
            !Object.is(this.state.target_price, NaN) &&
            !Object.is(this.state.target_quantity, NaN) &&
            !this.props.is_waiting
        ) {
            return true;
        }
        return false;
    }
    private handle_input_change = (name: string, value: string): void => {
        if (name === "target_quantity" && parseInt(value) < 0) value = "0";

        if (name === "target_price" || name === "target_quantity") {
            if (value === "") {
                this.setState({ [name]: NaN } as any);
            } else {
                if (name === "target_price") {
                    this.setState({ [name]: parseFloat(value) } as any);
                } else this.setState({ [name]: parseInt(value) } as any);
            }
        } else if (name in this.state) this.setState({ [name]: value } as any);
    };
    private handle_click_toggle = (): void => {
        this.setState((state, props) => {
            return { plan_type: state.plan_type === "buy" ? "sell" : "buy" };
        });
    };
    private handle_click_submit = async (): Promise<void> => {
        if (this.can_submit) {
            if (this.props.plan) {
                // Update
                this.props
                    .dispatch(
                        update_plan({
                            id: this.state.plan_id!,
                            sid: this.state.sid,
                            target_price: this.state.target_price.toString(),
                            plan_type: this.state.plan_type,
                            target_quantity:
                                this.state.target_quantity.toString(),
                        })
                    )
                    .unwrap()
                    .then((response) => {
                        if (response) this.props.hide_modal();
                    });
            } else {
                // Create
                this.props
                    .dispatch(
                        create_plan({
                            sid: this.state.sid,
                            target_price: this.state.target_price.toString(),
                            target_quantity:
                                this.state.target_quantity.toString(),
                            plan_type: this.state.plan_type,
                        })
                    )
                    .unwrap()
                    .then((response) => {
                        if (response) this.props.hide_modal();
                    });
            }
        }
    };
}

export default connect(mapStateToProps)(TradePlanModal);
