import styles from "./Records.module.scss";

import React from "react";
import { connect } from "react-redux";

import StretchableButton from "../../../components/StretchableButton/StretchableButton";
import { RouterInterface, withRouter } from "../../../router";
import { RootState } from "../../../redux/store";
import Button from "../../../components/Button/Button";
import SearchKeywordInput from "../../../components/SearchKeywordInput/SearchKeywordInput";
import { TradeRecord } from "../../../redux/slices/TradeRecordSlice";
import RoundButton from "../../../components/RoundButton/RoundButton";
import IconTrash from "../../../components/Icons/IconTrash";
import IconPencilSquare from "../../../components/Icons/IconPencilSquare";

function mapStateToProps(root_state: RootState) {
    let trade_record_list = root_state.trade_record.record_list;
    let cash_dividend_record_list = root_state.cash_dividend.record_list;
    return { trade_record_list, cash_dividend_record_list };
}

interface PropsInterface
    extends RouterInterface,
        ReturnType<typeof mapStateToProps> {}

interface StateInterface {
    active_subpage_name: "trade" | "cash_dividend";
    search_keyword: string | null;
    shown_record_number: number;
}

class Records extends React.Component<PropsInterface, StateInterface> {
    public state: StateInterface;
    public constructor(props: PropsInterface) {
        super(props);
        this.state = {
            active_subpage_name: "trade",
            search_keyword: null,
            shown_record_number: 15,
        };
    }
    public async componentDidMount(): Promise<void> {}
    public render(): React.ReactNode {
        return (
            <div className={styles.main}>
                <div className={styles.background}></div>
                <div className={styles.switch_button_container}>
                    <Button
                        className={this.get_switch_button_class("trade")}
                        onClick={() => {
                            this.setState({ active_subpage_name: "trade" });
                        }}
                    >
                        交易紀錄
                    </Button>
                    <hr />
                    <Button
                        className={this.get_switch_button_class(
                            "cash_dividend"
                        )}
                        onClick={() => {
                            this.setState({
                                active_subpage_name: "cash_dividend",
                            });
                        }}
                    >
                        現金股利
                    </Button>
                </div>
                <SearchKeywordInput
                    placeholder="輸入證券代號或名稱"
                    name="search_keyword"
                    keyword={this.state.search_keyword || ""}
                    onChange={this.handle_input_change}
                />
                <StretchableButton />
                <div className={styles.record_list}>
                    {this.record_list}
                    <div className={styles.show_more_button_outer}>
                        <Button
                            className="transparent"
                            onClick={this.handle_click_show_more}
                        >
                            顯示更多
                        </Button>
                    </div>
                </div>
            </div>
        );
    }
    private get_switch_button_class(name: "trade" | "cash_dividend"): string {
        if (this.state.active_subpage_name === name) return "white xs";
        return "transparent xs";
    }
    private handle_input_change = (name: string, value: string): void => {
        if (name in this.state) this.setState({ [name]: value } as any);
    };
    private get record_list(): React.ReactNode {
        if (this.state.active_subpage_name === "trade") {
            return this.props.trade_record_list
                .slice(0, this.state.shown_record_number)
                .map((record: TradeRecord, idx) => {
                    return (
                        <div key={idx} className={styles.row}>
                            <span
                                className={styles.company}
                            >{`${record.sid} ${record.company_name}`}</span>
                            <span className={styles.price}>
                                ${record.deal_price.toLocaleString()}
                            </span>
                            <span
                                className={this.get_trade_type_class(
                                    record.deal_quantity
                                )}
                            >
                                {record.deal_quantity > 0 ? "買" : "賣"}
                            </span>
                            <span className={styles.quantity}>
                                {Math.abs(record.deal_quantity)} 股
                            </span>
                            <span className={styles.date}>
                                {record.deal_time}
                            </span>
                            <span className={styles.action_outer}>
                                <RoundButton className="p-8">
                                    <IconPencilSquare side_length="16" />
                                </RoundButton>
                                <RoundButton className="p-8">
                                    <IconTrash side_length="16" />
                                </RoundButton>
                            </span>
                        </div>
                    );
                });
        } else if (this.state.active_subpage_name === "cash_dividend") {
            return <></>;
        }
        return null;
    }
    private get_trade_type_class(quantity: number): string {
        return (
            styles.trade_type + " " + (quantity > 0 ? styles.buy : styles.sell)
        );
    }
    private handle_click_show_more = (): void => {
        this.setState((state, props) => {
            return { shown_record_number: state.shown_record_number * 2 };
        });
    };
}

export default connect(mapStateToProps)(withRouter(Records));
