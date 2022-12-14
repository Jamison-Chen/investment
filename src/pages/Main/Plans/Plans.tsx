import styles from "./Plans.module.scss";

import React from "react";
import { connect } from "react-redux";

import { IRouter, withRouter } from "../../../router";
import type { RootState, AppDispatch } from "../../../redux/store";
import {
    Button,
    SearchKeywordInput,
    TradePlanActionBar,
    StretchableButton,
    ColorBackground,
    ActionMenu,
} from "../../../components";
import type { TradePlan, StockInfo } from "../../../types";
import { get_sid_stock_info_map } from "../../../redux/slices/StockInfoSlice";

function mapStateToProps(root_state: RootState) {
    let stock_info_list: StockInfo[] = root_state.stock_info.info_list;
    let trade_plan_list = root_state.trade_plan.trade_plan_list;
    let sid_stock_info_map = get_sid_stock_info_map(stock_info_list);
    return { trade_plan_list, sid_stock_info_map };
}

interface Props extends IRouter, ReturnType<typeof mapStateToProps> {
    dispatch: AppDispatch;
}

interface State {
    search_keyword: string | null;
    number_to_show: number;
    active_plan: TradePlan | null;
}

class Plans extends React.Component<Props, State> {
    public state: State;
    private timer?: ReturnType<typeof setTimeout>;
    public constructor(props: Props) {
        super(props);
        this.state = {
            search_keyword: this.props.router.search_params.get("sid"),
            number_to_show: 15,
            active_plan: null,
        };
    }
    public async componentDidMount(): Promise<void> {}
    public render(): React.ReactNode {
        return (
            <div className={styles.main}>
                <ColorBackground />
                {this.action_menu}
                <SearchKeywordInput
                    placeholder="輸入證券代號或名稱"
                    name="search_keyword"
                    keyword={this.state.search_keyword || ""}
                    onChange={this.handle_input_change}
                />
                <StretchableButton />
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
    private get action_menu(): React.ReactNode {
        if (this.state.active_plan) {
            return (
                <ActionMenu hide_modal={this.deactivate_plan}>
                    <TradePlanActionBar
                        plan={this.state.active_plan}
                        is_mobile
                        on_delete={this.deactivate_plan}
                        on_save={this.deactivate_plan}
                    />
                </ActionMenu>
            );
        }
        return null;
    }
    private activate_plan = (plan: TradePlan): void => {
        this.setState({ active_plan: plan });
    };
    private deactivate_plan = (): void => {
        this.setState({ active_plan: null });
    };
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
                    Math.abs(a.target_price - pa) / pa -
                    Math.abs(b.target_price - pb) / pb
                );
            });
    }
    private get plan_divs(): React.ReactNode {
        return this.filtered_and_sorted_plan_list
            .slice(0, this.state.number_to_show)
            .map((plan: TradePlan, idx) => {
                return (
                    <div
                        key={idx}
                        className={styles.row}
                        onTouchStart={() =>
                            (this.timer = setTimeout(
                                () => this.activate_plan(plan),
                                500
                            ))
                        }
                        onTouchEnd={() => clearTimeout(this.timer)}
                        onTouchMove={() => clearTimeout(this.timer)}
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
                        <span className={styles.action_bar_outer}>
                            <TradePlanActionBar plan={plan} />
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
    private handle_click_show_more = (): void => {
        this.setState((state, props) => {
            return { number_to_show: state.number_to_show * 2 };
        });
    };
    private get has_more_to_show(): boolean {
        return (
            this.filtered_and_sorted_plan_list.length >
            this.state.number_to_show
        );
    }
}

export default connect(mapStateToProps)(withRouter(Plans));
