import styles from "./TradeRecordModal.module.scss";
import waiting_spinner from "../../assets/loading.svg";

import React from "react";
import { connect } from "react-redux";

import { Modal, Button, LabeledInput } from "../../components";
import { IconToggleOn } from "../../icons";
import {
    create_record,
    update_record,
} from "../../redux/slices/TradeRecordSlice";
import type { TradeRecord } from "../../types";
import type { RootState, AppDispatch } from "../../redux/store";
import { fetch_single_stock_info } from "../../redux/slices/StockInfoSlice";

function mapStateToProps(root_state: RootState) {
    let is_waiting = root_state.trade_record.is_waiting;
    return { is_waiting };
}

interface Props extends ReturnType<typeof mapStateToProps> {
    default_sid?: string;
    record?: TradeRecord;
    hide_modal: Function;
    on_save?: () => void;
    dispatch: AppDispatch;
}

interface State {
    record_id: string | null;
    deal_time: string;
    sid: string;
    deal_price: number;
    is_buying: boolean;
    abs_deal_quantity: number;
    handling_fee: number;
}

class TradeRecordModal extends React.Component<Props, State> {
    public state: State;
    public constructor(props: Props) {
        super(props);
        this.state = {
            record_id: null,
            deal_time: new Date().toLocaleDateString("af"),
            sid: "",
            deal_price: NaN,
            is_buying: true,
            abs_deal_quantity: NaN,
            handling_fee: 0,
        };
    }
    public componentDidMount(): void {
        this.setState((state, props) => {
            if (props.record) {
                return {
                    record_id: props.record.id.toString(),
                    deal_time: props.record.deal_time,
                    sid: props.record.sid,
                    deal_price: props.record.deal_price,
                    is_buying: props.record.deal_quantity > 0 ? true : false,
                    abs_deal_quantity: Math.abs(props.record.deal_quantity),
                    handling_fee: props.record.handling_fee,
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
                header_title={`${this.props.record ? "??????" : "??????"}????????????`}
                hide_modal={this.props.hide_modal}
                no_x
                silent_background
                footer={
                    <>
                        <Button
                            className="light border l"
                            onClick={() => this.props.hide_modal()}
                        >
                            ??????
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
                                "??????"
                            )}
                        </Button>
                    </>
                }
            >
                <div className={styles.modal_inner}>
                    <LabeledInput
                        title="????????????"
                        type="date"
                        name="deal_time"
                        value={this.state.deal_time}
                        onChange={this.handle_input_change}
                    />
                    <LabeledInput
                        title="????????????"
                        name="sid"
                        value={this.state.sid}
                        onChange={this.handle_input_change}
                    />
                    <div className={styles.row}>
                        <LabeledInput
                            title="????????????"
                            type="number"
                            name="deal_price"
                            value={
                                this.state.deal_price ||
                                this.state.deal_price === 0
                                    ? this.state.deal_price.toString()
                                    : ""
                            }
                            onChange={this.handle_input_change}
                        />
                        <div className={styles.buy_or_sell}>
                            <span>???</span>
                            <span
                                className={
                                    styles.toggle_outer +
                                    " " +
                                    (this.state.is_buying
                                        ? styles.buy
                                        : styles.sell)
                                }
                                onClick={this.handle_click_toggle}
                            >
                                <IconToggleOn side_length="28" />
                            </span>
                            <span>???</span>
                        </div>
                        <LabeledInput
                            title="????????????"
                            type="number"
                            name="abs_deal_quantity"
                            value={
                                this.state.abs_deal_quantity ||
                                this.state.abs_deal_quantity === 0
                                    ? this.state.abs_deal_quantity.toString()
                                    : ""
                            }
                            onChange={this.handle_input_change}
                        />
                    </div>
                    <LabeledInput
                        title="????????????"
                        type="number"
                        name="handling_fee"
                        value={
                            this.state.handling_fee ||
                            this.state.handling_fee === 0
                                ? this.state.handling_fee.toString()
                                : ""
                        }
                        onChange={this.handle_input_change}
                    />
                </div>
            </Modal>
        );
    }
    private get default_handling_fee(): number {
        let fee: number;
        if (this.state.is_buying) {
            fee = Math.floor(
                this.state.deal_price * this.state.abs_deal_quantity * 0.001425
            );
        } else {
            fee = Math.floor(
                this.state.deal_price * this.state.abs_deal_quantity * 0.004425
            );
        }
        return Math.max(1, fee);
    }
    private get can_submit(): boolean {
        if (
            this.state.deal_time &&
            this.state.sid &&
            !Object.is(this.state.deal_price, NaN) &&
            !Object.is(this.state.abs_deal_quantity, NaN) &&
            !Object.is(this.state.handling_fee, NaN) &&
            !this.props.is_waiting
        ) {
            return true;
        }
        return false;
    }
    private handle_input_change = (name: string, value: string): void => {
        if (name === "abs_deal_quantity" && parseInt(value) < 0) {
            value = "0";
        }

        if (
            name === "deal_price" ||
            name === "abs_deal_quantity" ||
            name === "handling_fee"
        ) {
            if (value === "") {
                this.setState({ [name]: NaN } as any);
            } else {
                if (name === "deal_price") {
                    this.setState({ [name]: parseFloat(value) } as any);
                } else this.setState({ [name]: parseInt(value) } as any);
            }
        } else if (name in this.state) this.setState({ [name]: value } as any);

        if (name !== "handling_fee") {
            setTimeout(() => {
                this.setState({ handling_fee: this.default_handling_fee });
            });
        }
    };
    private handle_click_toggle = (): void => {
        this.setState((state, props) => {
            return { is_buying: !state.is_buying };
        });
        setTimeout(() => {
            this.setState({ handling_fee: this.default_handling_fee });
        });
    };
    private handle_click_submit = async (): Promise<void> => {
        if (this.can_submit) {
            if (this.props.record) {
                // Update
                this.props
                    .dispatch(
                        update_record({
                            id: this.state.record_id!,
                            sid: this.state.sid,
                            deal_time: this.state.deal_time,
                            deal_price: this.state.deal_price.toString(),
                            deal_quantity: (this.state.is_buying
                                ? this.state.abs_deal_quantity
                                : -1 * this.state.abs_deal_quantity
                            ).toString(),
                            handling_fee: this.state.handling_fee.toString(),
                        })
                    )
                    .unwrap()
                    .then((response) => {
                        if (response) {
                            this.props.hide_modal();
                            if (this.props.on_save) this.props.on_save();
                        }
                    });
            } else {
                // Create
                this.props
                    .dispatch(
                        create_record({
                            sid: this.state.sid,
                            deal_time: this.state.deal_time,
                            deal_price: this.state.deal_price.toString(),
                            deal_quantity: (this.state.is_buying
                                ? this.state.abs_deal_quantity
                                : -1 * this.state.abs_deal_quantity
                            ).toString(),
                            handling_fee: this.state.handling_fee.toString(),
                        })
                    )
                    .unwrap()
                    .then((response) => {
                        if (response) {
                            this.props.hide_modal();
                            if (this.props.on_save) this.props.on_save();
                        }
                    });
                this.props.dispatch(fetch_single_stock_info(this.state.sid));
            }
        }
    };
}

export default connect(mapStateToProps)(TradeRecordModal);
