import styles from "./StretchableButton.module.scss";
import quill_pen from "../../assets/quill_pen.png";

import React, { MouseEvent } from "react";

import IconPencilSquare from "../Icons/IconPencilSquare";
import IconPiggyBank from "../Icons/IconPiggyBank";
import Modal from "../Modal/Modal";
import TradeRecordModal from "../TradeRecordModal/TradeRecordModal";

interface PropsInterface {}

interface StateInterface {
    is_active: boolean;
    active_modal_name:
        | "create_trade_record"
        | "create_cash_dividend_record"
        | null;
}

export default class StretchableButton extends React.Component<
    PropsInterface,
    StateInterface
> {
    public state: StateInterface;
    public constructor(props: PropsInterface) {
        super(props);
        this.state = {
            is_active: false,
            active_modal_name: null,
        };
    }
    public componentDidMount(): void {
        window.addEventListener("click", () =>
            this.setState({ is_active: false })
        );
    }
    public render(): React.ReactNode {
        return (
            <div className={this.main_class_name} onClick={this.toggle}>
                {this.active_modal}
                <img className={styles.button_image} src={quill_pen} alt="" />
                <div className={styles.button_container}>
                    <div
                        className={styles.button}
                        onClick={() =>
                            this.setState({
                                active_modal_name: "create_trade_record",
                            })
                        }
                    >
                        <IconPencilSquare side_length="20" />
                        <div className={styles.hint_text}>交易紀錄</div>
                    </div>
                    <div
                        className={styles.button}
                        onClick={() =>
                            this.setState({
                                active_modal_name:
                                    "create_cash_dividend_record",
                            })
                        }
                    >
                        <IconPiggyBank side_length="23" />
                        <div className={styles.hint_text}>現金股利</div>
                    </div>
                </div>
            </div>
        );
    }
    private get main_class_name(): string {
        return styles.main + (this.state.is_active ? " " + styles.active : "");
    }
    private get active_modal(): React.ReactElement<Modal> | null {
        if (this.state.active_modal_name === "create_trade_record") {
            return <TradeRecordModal hide_modal={this.hide_modal} />;
        } else if (
            this.state.active_modal_name === "create_cash_dividend_record"
        ) {
            return null;
        }
        return null;
    }
    private hide_modal = (): void => {
        this.setState({ active_modal_name: null });
    };
    private toggle = (e: MouseEvent): void => {
        e.stopPropagation();
        this.setState((state, props) => {
            return { is_active: !state.is_active };
        });
    };
}
