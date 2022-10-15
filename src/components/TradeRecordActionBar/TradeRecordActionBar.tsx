import styles from "./TradeRecordActionBar.module.scss";

import React from "react";

import IconPencilSquare from "../Icons/IconPencilSquare";
import Modal from "../Modal/Modal";
import RoundButton from "../RoundButton/RoundButton";
import IconTrash from "../Icons/IconTrash";
import Button from "../Button/Button";
import { AppDispatch } from "../../redux/store";
import {
    TradeRecord,
    delete_record,
} from "../../redux/slices/TradeRecordSlice";

interface PropsInterface {
    record: TradeRecord;
    dispatch: AppDispatch;
}

interface StateInterface {
    active_modal_name: "edit" | "check_delete" | null;
}

export default class TradeRecordActionBar extends React.Component<
    PropsInterface,
    StateInterface
> {
    public state: StateInterface;
    public constructor(props: PropsInterface) {
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
                <RoundButton className="p-8" hint_text="編輯">
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
                            >
                                刪除
                            </Button>
                        </>
                    }
                >
                    <div className={styles.modal_inner}>
                        <div className={styles.row}>
                            <span
                                className={styles.company}
                            >{`${this.props.record.sid} ${this.props.record.company_name}`}</span>
                            <span className={styles.price}>
                                ${this.props.record.deal_price.toLocaleString()}
                            </span>
                            <span
                                className={this.get_trade_type_class(
                                    this.props.record.deal_quantity
                                )}
                            >
                                {this.props.record.deal_quantity > 0
                                    ? "買"
                                    : "賣"}
                            </span>
                            <span className={styles.quantity}>
                                {Math.abs(this.props.record.deal_quantity)} 股
                            </span>
                            <span className={styles.date}>
                                {this.props.record.deal_time}
                            </span>
                        </div>
                        <div>您確定要刪除此筆紀錄嗎？</div>
                    </div>
                </Modal>
            );
        }
        return null;
    }
    private get_trade_type_class(quantity: number): string {
        return (
            styles.trade_type + " " + (quantity > 0 ? styles.buy : styles.sell)
        );
    }
    private hide_modal = (): void => {
        this.setState({ active_modal_name: null });
    };
    private handle_click_trash_can = (): void => {
        this.setState({ active_modal_name: "check_delete" });
    };
    private handle_click_check_delete = (): void => {
        this.props
            .dispatch(delete_record(this.props.record.id))
            .unwrap()
            .then((response) => {
                if (response) this.setState({ active_modal_name: null });
            });
    };
}