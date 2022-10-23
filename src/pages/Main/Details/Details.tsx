import styles from "./Details.module.scss";

import React from "react";
import { connect } from "react-redux";

import { RouterInterface, withRouter } from "../../../router";
import { RootState } from "../../../redux/store";
import {
    get_sid_stock_info_map,
    StockInfo,
} from "../../../redux/slices/StockInfoSlice";
import Button from "../../../components/Button/Button";
import {
    get_inventory_map,
    get_sid_trade_records_map,
} from "../../../redux/slices/TradeRecordSlice";

function mapStateToProps(root_state: RootState) {
    let stock_info_list: StockInfo[] = root_state.stock_info.info_list;
    let sid_stock_info_map = get_sid_stock_info_map(stock_info_list);
    let trade_record_list = root_state.trade_record.record_list;
    let sid_trade_records_map = get_sid_trade_records_map(trade_record_list);
    let inventory_map = get_inventory_map(sid_trade_records_map);
    return { sid_stock_info_map, sid_trade_records_map, inventory_map };
}

interface PropsInterface
    extends RouterInterface,
        ReturnType<typeof mapStateToProps> {}

interface StateInterface {
    active_subpage_name: "stock_list" | "stock_details";
}

class Details extends React.Component<PropsInterface, StateInterface> {
    public state: StateInterface;
    public constructor(props: PropsInterface) {
        super(props);
        this.state = {
            active_subpage_name: "stock_list",
        };
    }
    public async componentDidMount(): Promise<void> {}
    public render(): React.ReactNode {
        return (
            <div className={styles.main}>
                <div className={styles.background} />
                <div className={styles.switch_button_container}>
                    <Button
                        className={this.get_switch_button_class("stock_list")}
                        onClick={() =>
                            this.handle_click_switch_button("stock_list")
                        }
                    >
                        持股列表
                    </Button>
                    <hr />
                    <Button
                        className={this.get_switch_button_class(
                            "stock_details"
                        )}
                        onClick={() =>
                            this.handle_click_switch_button("stock_details")
                        }
                    >
                        個股細節
                    </Button>
                </div>
                <div className={styles.subpage_outer}>
                    {this.active_subpage}
                </div>
            </div>
        );
    }
    private get_switch_button_class(
        name: "stock_list" | "stock_details"
    ): string {
        if (this.state.active_subpage_name === name) return "white xs";
        return "transparent xs";
    }
    private handle_click_switch_button = (
        name: "stock_list" | "stock_details"
    ): void => {
        this.setState({ active_subpage_name: name });
    };
    private get active_subpage(): React.ReactNode {
        if (this.state.active_subpage_name === "stock_list") {
            return (
                <div className={styles.stock_list}>
                    {Object.keys(this.props.inventory_map).map((sid, idx) => {
                        return (
                            <div key={idx} className={styles.card}>
                                <div className={styles.upper}>
                                    <div className={styles.company}>
                                        {`${sid} ${this.props.sid_stock_info_map[sid].name}`}
                                    </div>
                                    <div className={styles.mid}>
                                        <div className={styles.trade_quantity}>
                                            {`成交 ${this.props.sid_stock_info_map[
                                                sid
                                            ].quantity.toLocaleString()} 張`}
                                        </div>
                                        <div
                                            className={styles.price_fluctuation}
                                        >
                                            {`${
                                                this.props.sid_stock_info_map[
                                                    sid
                                                ].fluct_price > 0
                                                    ? "▲"
                                                    : this.props
                                                          .sid_stock_info_map[
                                                          sid
                                                      ].fluct_price < 0
                                                    ? "▼"
                                                    : "-"
                                            }
                                            ${
                                                this.props.sid_stock_info_map[
                                                    sid
                                                ].fluct_price != 0
                                                    ? Math.abs(
                                                          this.props
                                                              .sid_stock_info_map[
                                                              sid
                                                          ].fluct_price
                                                      )
                                                    : ""
                                            }
                                            ${
                                                this.props.sid_stock_info_map[
                                                    sid
                                                ].fluct_price != 0
                                                    ? "(" +
                                                      (
                                                          Math.abs(
                                                              this.props
                                                                  .sid_stock_info_map[
                                                                  sid
                                                              ].fluct_rate
                                                          ) * 100
                                                      ).toFixed(2) +
                                                      "%)"
                                                    : ""
                                            }`}
                                        </div>
                                    </div>
                                    <div className={styles.price}>
                                        {`$${this.props.sid_stock_info_map[sid].close}`}
                                    </div>
                                </div>
                                <div className={styles.lower}></div>
                            </div>
                        );
                    })}
                </div>
            );
        } else {
            return <div></div>;
        }
    }
    // private get stock_info_
}

export default connect(mapStateToProps)(withRouter(Details));
