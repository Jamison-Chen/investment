import styles from "./Records.module.scss";

import React from "react";
import { connect } from "react-redux";

import StretchableButton from "../../../components/StretchableButton/StretchableButton";
import { RouterInterface, withRouter } from "../../../router";
import { RootState } from "../../../redux/store";
import Button from "../../../components/Button/Button";
import SearchKeywordInput from "../../../components/SearchKeywordInput/SearchKeywordInput";
import { TradeRecord } from "../../../redux/slices/TradeRecordSlice";
import TradeRecordActionBar from "../../../components/TradeRecordActionBar/TradeRecordActionBar";
import { CashDividendRecord } from "../../../redux/slices/CashDividendRecordSlice";
import CashDividendRecordActionBar from "../../../components/CashDividendRecordActionBar/CashDividendRecordActionBar";

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
    active_row_index: number | null;
    shown_record_number: number;
}

class Records extends React.Component<PropsInterface, StateInterface> {
    public state: StateInterface;
    public constructor(props: PropsInterface) {
        super(props);
        this.state = {
            active_subpage_name: "trade",
            search_keyword: null,
            active_row_index: null,
            shown_record_number: 15,
        };
    }
    public async componentDidMount(): Promise<void> {}
    public render(): React.ReactNode {
        return (
            <div className={styles.main}>
                <div className={styles.background} />
                <div className={styles.switch_button_container}>
                    <Button
                        className={this.get_switch_button_class("trade")}
                        onClick={() => this.handle_click_switch_button("trade")}
                    >
                        交易紀錄
                    </Button>
                    <hr />
                    <Button
                        className={this.get_switch_button_class(
                            "cash_dividend"
                        )}
                        onClick={() =>
                            this.handle_click_switch_button("cash_dividend")
                        }
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
                    {this.record_divs}
                    <div className={styles.show_more_button_outer}>
                        <Button
                            className="transparent"
                            onClick={this.handle_click_show_more}
                            disabled={!this.has_more_to_show}
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
    private handle_click_switch_button = (
        name: "trade" | "cash_dividend"
    ): void => {
        this.setState({
            active_subpage_name: name,
            search_keyword: null,
            shown_record_number: 15,
        });
    };
    private handle_input_change = (name: string, value: string): void => {
        if (name in this.state) this.setState({ [name]: value } as any);
    };
    private get filtered_record_list(): TradeRecord[] | CashDividendRecord[] {
        if (this.state.active_subpage_name === "trade") {
            return this.props.trade_record_list.filter((record) => {
                if (this.state.search_keyword) {
                    return (
                        record.sid.includes(this.state.search_keyword) ||
                        record.company_name.includes(
                            this.state.search_keyword
                        ) ||
                        record.deal_time.includes(this.state.search_keyword)
                    );
                }
                return true;
            });
        } else {
            return this.props.cash_dividend_record_list.filter((record) => {
                if (this.state.search_keyword) {
                    return (
                        record.sid.includes(this.state.search_keyword) ||
                        record.company_name.includes(
                            this.state.search_keyword
                        ) ||
                        record.deal_time.includes(this.state.search_keyword)
                    );
                }
                return true;
            });
        }
    }
    private get record_divs(): React.ReactNode {
        if (this.state.active_subpage_name === "trade") {
            return (this.filtered_record_list as TradeRecord[])
                .slice(0, this.state.shown_record_number)
                .map((record: TradeRecord, idx) => {
                    return (
                        <div
                            key={idx}
                            className={styles.row}
                            onClick={() => this.handle_click_row(idx)}
                        >
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
                            <span
                                className={this.get_action_bar_outer_class(idx)}
                            >
                                <TradeRecordActionBar record={record} />
                            </span>
                        </div>
                    );
                });
        } else if (this.state.active_subpage_name === "cash_dividend") {
            return (this.filtered_record_list as CashDividendRecord[])
                .slice(0, this.state.shown_record_number)
                .map((record: CashDividendRecord, idx) => {
                    return (
                        <div
                            key={idx}
                            className={styles.row}
                            onClick={() => this.handle_click_row(idx)}
                        >
                            <span
                                className={styles.company}
                            >{`${record.sid} ${record.company_name}`}</span>
                            <span className={styles.price}>
                                ${record.cash_dividend.toLocaleString()}
                            </span>
                            <span className={styles.date}>
                                {record.deal_time}
                            </span>
                            <span
                                className={this.get_action_bar_outer_class(idx)}
                            >
                                <CashDividendRecordActionBar record={record} />
                            </span>
                        </div>
                    );
                });
        }
        return null;
    }
    private get_trade_type_class(quantity: number): string {
        return (
            styles.trade_type + " " + (quantity > 0 ? styles.buy : styles.sell)
        );
    }
    private get_action_bar_outer_class(idx: number): string {
        if (this.state.active_row_index === idx) {
            return styles.action_bar_outer + " " + styles.active;
        } else return styles.action_bar_outer;
    }
    private handle_click_row = (idx: number): void => {
        this.setState((state, props) => {
            if (state.active_row_index !== null) {
                return { active_row_index: null };
            } else return { active_row_index: idx };
        });
    };
    private handle_click_show_more = (): void => {
        this.setState((state, props) => {
            return { shown_record_number: state.shown_record_number * 2 };
        });
    };
    private get has_more_to_show(): boolean {
        return (
            this.filtered_record_list.length > this.state.shown_record_number
        );
    }
}

export default connect(mapStateToProps)(withRouter(Records));
