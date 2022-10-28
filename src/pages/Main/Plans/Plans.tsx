import styles from "./Plans.module.scss";

import React from "react";
import { connect } from "react-redux";

import { RouterInterface, withRouter } from "../../../router";
import { RootState, AppDispatch } from "../../../redux/store";
import Button from "../../../components/Button/Button";
import SearchKeywordInput from "../../../components/SearchKeywordInput/SearchKeywordInput";
import { TradePlan } from "../../../redux/slices/TradePlanSlice";
import {
    get_sid_stock_info_map,
    StockInfo,
} from "../../../redux/slices/StockInfoSlice";

function mapStateToProps(root_state: RootState) {
    let stock_info_list: StockInfo[] = root_state.stock_info.info_list;
    let trade_plan_list = root_state.trade_plan.trade_plan_list;
    let sid_stock_info_map = get_sid_stock_info_map(stock_info_list);
    return { trade_plan_list, sid_stock_info_map };
}

interface PropsInterface
    extends RouterInterface,
        ReturnType<typeof mapStateToProps> {
    dispatch: AppDispatch;
}

interface StateInterface {
    search_keyword: string | null;
    active_row_index: number | null;
    shown_record_number: number;
}

class Plans extends React.Component<PropsInterface, StateInterface> {
    public state: StateInterface;
    public constructor(props: PropsInterface) {
        super(props);
        this.state = {
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
                <SearchKeywordInput
                    placeholder="輸入證券代號或名稱"
                    name="search_keyword"
                    keyword={this.state.search_keyword || ""}
                    onChange={this.handle_input_change}
                />
                <div className={styles.record_list}>
                    {this.plan_divs}
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
    private handle_input_change = (name: string, value: string): void => {
        if (name in this.state) this.setState({ [name]: value } as any);
    };
    private get filtered_and_sorted_plan_list(): TradePlan[] {
        return this.props.trade_plan_list
            .filter((plan) => {
                if (
                    this.state.search_keyword &&
                    ["買", "賣"].includes(this.state.search_keyword)
                ) {
                    return (
                        plan.plan_type ===
                        (this.state.search_keyword === "買" ? "buy" : "sell")
                    );
                } else if (this.state.search_keyword) {
                    return (
                        plan.sid.includes(this.state.search_keyword) ||
                        plan.company_name.includes(this.state.search_keyword)
                    );
                }
                return true;
            })
            .sort((a, b) => {
                let pa = a.target_price;
                let pb = b.target_price;
                if (a.sid in this.props.sid_stock_info_map) {
                    pa = this.props.sid_stock_info_map[a.sid].close;
                }
                if (b.sid in this.props.sid_stock_info_map) {
                    pb = this.props.sid_stock_info_map[b.sid].close;
                }
                return (
                    Math.abs(a.target_price - pa) -
                    Math.abs(b.target_price - pb)
                );
            });
    }
    private get plan_divs(): React.ReactNode {
        return (this.filtered_and_sorted_plan_list as TradePlan[])
            .slice(0, this.state.shown_record_number)
            .map((plan: TradePlan, idx) => {
                return (
                    <div
                        key={idx}
                        className={styles.row}
                        onClick={() => this.handle_click_row(idx)}
                    >
                        <span
                            className={styles.company}
                        >{`${plan.sid} ${plan.company_name}`}</span>
                        <span className={styles.price}>
                            ${plan.target_price.toLocaleString()}
                        </span>
                        <span
                            className={this.get_plan_type_class(plan.plan_type)}
                        >
                            {plan.plan_type === "buy" ? "買" : "賣"}
                        </span>
                        <span className={styles.quantity}>
                            {plan.target_quantity} 股
                        </span>
                        <span className={this.get_action_bar_outer_class(idx)}>
                            {/* <TradeRecordActionBar record={plan} /> */}
                        </span>
                    </div>
                );
            });
    }
    private get_plan_type_class(plan_type: "buy" | "sell"): string {
        return (
            styles.trade_type +
            " " +
            (plan_type === "buy" ? styles.buy : styles.sell)
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
            this.filtered_and_sorted_plan_list.length >
            this.state.shown_record_number
        );
    }
}

export default connect(mapStateToProps)(withRouter(Plans));
