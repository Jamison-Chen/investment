import styles from "./CashDividendRecordModal.module.scss";

import React from "react";

import Modal from "../Modal/Modal";
import Button from "../Button/Button";
import LabeledInput from "../LabeledInput/LabeledInput";
import Utils from "../../util";

interface PropsInterface {
    record_id?: string | null;
    deal_time?: string;
    sid?: string;
    cash_dividend?: number;
    hide_modal: Function;
}

interface StateInterface {
    record_id: string | null;
    deal_time: string;
    sid: string;
    cash_dividend: number;
}

export default class CashDividendRecordModal extends React.Component<
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
            cash_dividend: NaN,
        };
    }
    public componentDidMount(): void {
        this.setState((state, props) => {
            if (
                props.record_id !== undefined &&
                props.deal_time !== undefined &&
                props.sid !== undefined &&
                props.cash_dividend !== undefined
            ) {
                return {
                    record_id: props.record_id,
                    deal_time: props.deal_time,
                    sid: props.sid,
                    cash_dividend: props.cash_dividend,
                };
            }
        });
    }
    public render(): React.ReactNode {
        return (
            <Modal
                header_title="新增現金股利"
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
                    <LabeledInput
                        title="現金股利"
                        type="number"
                        name="cash_dividend"
                        value={
                            this.state.cash_dividend ||
                            this.state.cash_dividend === 0
                                ? this.state.cash_dividend.toString()
                                : ""
                        }
                        onChange={this.handle_input_change}
                    />
                </div>
            </Modal>
        );
    }
    private get can_submit(): boolean {
        if (
            this.state.deal_time &&
            this.state.sid &&
            !Object.is(this.state.cash_dividend, NaN)
        ) {
            return true;
        }
        return false;
    }
    private handle_input_change = (name: string, value: string): void => {
        if (name === "cash_dividend") {
            if (value === "") this.setState({ [name]: NaN } as any);
            else this.setState({ [name]: parseInt(value) } as any);
        } else if (name in this.state) this.setState({ [name]: value } as any);
    };
    private handle_click_submit = async (): Promise<void> => {
        if (this.can_submit) {
            if (this.state.record_id) {
                // Update Mode
            } else {
                // Create Mode
                let request_body = new URLSearchParams();
                request_body.append("mode", "create");
                request_body.append("sid", this.state.sid);
                request_body.append("deal_time", this.state.deal_time);
                request_body.append(
                    "cash_dividend",
                    this.state.cash_dividend.toString()
                );
                let response = await Utils.send_request(
                    "stock/dividend",
                    "post",
                    request_body
                );
                if (response && response.success) this.props.hide_modal();
            }
        }
    };
}
