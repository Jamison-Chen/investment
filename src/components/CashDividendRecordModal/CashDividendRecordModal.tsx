import styles from "./CashDividendRecordModal.module.scss";
import waiting_spinner from "../../assets/loading.svg";

import React from "react";
import { connect } from "react-redux";

import Modal from "../Modal/Modal";
import Button from "../Button/Button";
import LabeledInput from "../LabeledInput/LabeledInput";
import {
    create_record,
    update_record,
    CashDividendRecord,
} from "../../redux/slices/CashDividendRecordSlice";
import { RootState, AppDispatch } from "../../redux/store";

function mapStateToProps(root_state: RootState) {
    let is_waiting = root_state.cash_dividend.is_waiting;
    return { is_waiting };
}

interface PropsInterface extends ReturnType<typeof mapStateToProps> {
    record?: CashDividendRecord;
    hide_modal: Function;
    dispatch: AppDispatch;
}

interface StateInterface {
    record_id: string | null;
    deal_time: string;
    sid: string;
    cash_dividend: number;
}

class CashDividendRecordModal extends React.Component<
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
            if (props.record) {
                return {
                    record_id: props.record.id.toString(),
                    deal_time: props.record.deal_time,
                    sid: props.record.sid,
                    cash_dividend: props.record.cash_dividend,
                } as StateInterface;
            }
            return {};
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
            !Object.is(this.state.cash_dividend, NaN) &&
            !this.props.is_waiting
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
                // Update
                this.props
                    .dispatch(
                        update_record({
                            id: this.state.record_id!,
                            sid: this.state.sid,
                            deal_time: this.state.deal_time,
                            cash_dividend: this.state.cash_dividend.toString(),
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
                        create_record({
                            sid: this.state.sid,
                            deal_time: this.state.deal_time,
                            cash_dividend: this.state.cash_dividend.toString(),
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

export default connect(mapStateToProps)(CashDividendRecordModal);
