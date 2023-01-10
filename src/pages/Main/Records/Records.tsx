import styles from "./Records.module.scss";

import React from "react";
import { connect } from "react-redux";

import {
    StretchableButton,
    Button,
    SearchKeywordInput,
    TradeRecordActionBar,
    CashDividendRecordActionBar,
    ColorBackground,
    ActionMenu,
} from "../../../components";
import { IRouter, withRouter } from "../../../router";
import type { RootState } from "../../../redux/store";
import type { CashDividendRecord, TradeRecord } from "../../../types";

function mapStateToProps(root_state: RootState) {
    let trade_record_list = root_state.trade_record.record_list;
    let cash_dividend_record_list = root_state.cash_dividend.record_list;
    return { trade_record_list, cash_dividend_record_list };
}

interface Props extends IRouter, ReturnType<typeof mapStateToProps> {}

interface State {
    active_subpage_name: "trade" | "cash_dividend";
    search_keyword: string | null;
    active_record: TradeRecord | CashDividendRecord | null;
    number_to_show: number;
}

class Records extends React.Component<Props, State> {
    public state: State;
    private timer?: ReturnType<typeof setTimeout>;
    public constructor(props: Props) {
        super(props);
        this.state = {
            active_subpage_name: "trade",
            search_keyword: this.props.router.search_params.get("sid"),
            active_record: null,
            number_to_show: 15,
        };
    }
    public async componentDidMount(): Promise<void> {}
    public render(): React.ReactNode {
        return (
            <div className={styles.main}>
                <ColorBackground />
                {this.action_menu}
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
    private get action_menu(): React.ReactNode {
        if (this.state.active_record) {
            if (this.is_trade_record(this.state.active_record)) {
                return (
                    <ActionMenu hide_modal={this.deactivate_record}>
                        <TradeRecordActionBar
                            record={this.state.active_record}
                            is_mobile
                            on_delete={this.deactivate_record}
                            on_save={this.deactivate_record}
                        />
                    </ActionMenu>
                );
            } else {
                return (
                    <ActionMenu hide_modal={this.deactivate_record}>
                        <CashDividendRecordActionBar
                            record={this.state.active_record}
                            is_mobile
                            on_delete={this.deactivate_record}
                            on_save={this.deactivate_record}
                        />
                    </ActionMenu>
                );
            }
        }
        return null;
    }
    private activate_record = (
        record: TradeRecord | CashDividendRecord
    ): void => {
        this.setState({ active_record: record });
    };
    private deactivate_record = (): void => {
        this.setState({ active_record: null });
    };
    private is_trade_record(
        record: TradeRecord | CashDividendRecord
    ): record is TradeRecord {
        return !record.hasOwnProperty("cash_dividend");
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
            number_to_show: 15,
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
                .slice(0, this.state.number_to_show)
                .map((record: TradeRecord, idx) => {
                    return (
                        <div
                            key={idx}
                            className={styles.row}
                            onTouchStart={() =>
                                (this.timer = setTimeout(
                                    () => this.activate_record(record),
                                    500
                                ))
                            }
                            onTouchEnd={() => clearTimeout(this.timer)}
                            onTouchMove={() => clearTimeout(this.timer)}
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
                            <span className={styles.action_bar_outer}>
                                <TradeRecordActionBar record={record} />
                            </span>
                        </div>
                    );
                });
        } else if (this.state.active_subpage_name === "cash_dividend") {
            return (this.filtered_record_list as CashDividendRecord[])
                .slice(0, this.state.number_to_show)
                .map((record: CashDividendRecord, idx) => {
                    return (
                        <div
                            key={idx}
                            className={styles.row}
                            onTouchStart={() =>
                                (this.timer = setTimeout(
                                    () => this.activate_record(record),
                                    500
                                ))
                            }
                            onTouchEnd={() => clearTimeout(this.timer)}
                            onTouchMove={() => clearTimeout(this.timer)}
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
                            <span className={styles.action_bar_outer}>
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
    private handle_click_show_more = (): void => {
        this.setState((state, props) => {
            return { number_to_show: state.number_to_show * 2 };
        });
    };
    private get has_more_to_show(): boolean {
        return this.filtered_record_list.length > this.state.number_to_show;
    }
}

export default connect(mapStateToProps)(withRouter(Records));
