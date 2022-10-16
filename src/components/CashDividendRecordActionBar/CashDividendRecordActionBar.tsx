import styles from "./CashDividendRecordActionBar.module.scss";
import waiting_spinner from "../../assets/loading.svg";

import React, { MouseEvent } from "react";
import { connect } from "react-redux";

import IconPencilSquare from "../Icons/IconPencilSquare";
import Modal from "../Modal/Modal";
import RoundButton from "../RoundButton/RoundButton";
import IconTrash from "../Icons/IconTrash";
import Button from "../Button/Button";
import { RootState, AppDispatch } from "../../redux/store";
import {
    delete_record,
    CashDividendRecord,
} from "../../redux/slices/CashDividendRecordSlice";
import CashDividendRecordModal from "../CashDividendRecordModal/CashDividendRecordModal";

function mapStateToProps(root_state: RootState) {
    let is_waiting = root_state.cash_dividend.is_waiting;
    return { is_waiting };
}

interface PropsInterface extends ReturnType<typeof mapStateToProps> {
    record: CashDividendRecord;
    dispatch: AppDispatch;
}

interface StateInterface {
    active_modal_name: "edit" | "check_delete" | null;
}

class CashDividendRecordActionBar extends React.Component<
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
                <CashDividendRecordModal
                    record={this.props.record}
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
                            >{`${this.props.record.sid} ${this.props.record.company_name}`}</span>
                            <span className={styles.price}>
                                $
                                {this.props.record.cash_dividend.toLocaleString()}
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
            .dispatch(delete_record(this.props.record.id))
            .unwrap()
            .then((response) => {
                if (response) this.setState({ active_modal_name: null });
            });
    };
}

export default connect(mapStateToProps)(CashDividendRecordActionBar);
