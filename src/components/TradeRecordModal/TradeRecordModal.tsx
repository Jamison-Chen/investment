import styles from "./TradeRecordModal.module.scss";

import React from "react";

import Modal from "../Modal/Modal";
import Button from "../Button/Button";
import LabeledInput from "../LabeledInput/LabeledInput";
import IconToggleOn from "../Icons/IconToggleOn";
import Utils from "../../util";

interface PropsInterface {
    record_id?: string | null;
    deal_time?: string;
    sid?: string;
    deal_price?: number;
    is_buying?: boolean;
    abs_deal_quantity?: number;
    handling_fee?: number;
    hide_modal: Function;
}

interface StateInterface {
    record_id: string | null;
    deal_time: string;
    sid: string;
    deal_price: number;
    is_buying: boolean;
    abs_deal_quantity: number;
    handling_fee: number;
}

export default class TradeRecordModal extends React.Component<
    PropsInterface,
    StateInterface
> {
    public state: StateInterface;
    public constructor(props: PropsInterface) {
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
            if (
                props.record_id !== undefined &&
                props.deal_time !== undefined &&
                props.sid !== undefined &&
                props.deal_price !== undefined &&
                props.is_buying !== undefined &&
                props.abs_deal_quantity !== undefined &&
                props.handling_fee !== undefined
            ) {
                return {
                    record_id: props.record_id,
                    deal_time: props.deal_time,
                    sid: props.sid,
                    deal_price: props.deal_price,
                    is_buying: props.is_buying,
                    abs_deal_quantity: props.abs_deal_quantity,
                    handling_fee: props.handling_fee,
                };
            }
        });
    }
    public render(): React.ReactNode {
        return (
            <Modal
                header_title="新增交易紀錄"
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
                        >
                            送出
                        </Button>
                    </>
                }
            >
                <div className={styles.modal_inner}>
                    <LabeledInput
                        title="交易日期"
                        type="date"
                        name="deal_time"
                        value={this.state.deal_time}
                        onChange={this.handle_input_change}
                    />
                    <LabeledInput
                        title="證券代號"
                        name="sid"
                        value={this.state.sid}
                        onChange={this.handle_input_change}
                    />

                    <div className={styles.row}>
                        <LabeledInput
                            title="成交單價"
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
                            <span>買</span>
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
                                <IconToggleOn side_length="26" />
                            </span>
                            <span>賣</span>
                        </div>
                        <LabeledInput
                            title="成交股數"
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
                        title="手續費用"
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
        if (
            this.state.deal_time &&
            this.state.sid &&
            !Object.is(this.state.deal_price, NaN) &&
            !Object.is(this.state.abs_deal_quantity, NaN) &&
            !Object.is(this.state.handling_fee, NaN)
        ) {
            if (this.state.record_id) {
                // Update Mode
            } else {
                // Create Mode
                let request_body = new URLSearchParams();
                request_body.append("mode", "create");
                request_body.append("sid", this.state.sid);
                request_body.append("deal_time", this.state.deal_time);
                request_body.append(
                    "deal_price",
                    this.state.deal_price.toString()
                );
                request_body.append(
                    "deal_quantity",
                    (this.state.is_buying
                        ? this.state.abs_deal_quantity
                        : -1 * this.state.abs_deal_quantity
                    ).toString()
                );
                request_body.append(
                    "handling_fee",
                    this.state.handling_fee.toString()
                );
                let response = await Utils.send_request(
                    "stock/trade",
                    "post",
                    request_body
                );
                if (response && response.success) this.props.hide_modal();
            }
        }
    };
}
