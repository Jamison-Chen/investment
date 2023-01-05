import styles from "./DetailCard.module.scss";

import { connect } from "react-redux";
import React from "react";

import type { StockInfo } from "../../types";
import {
    get_sid_market_value_map,
    get_sid_stock_info_map,
} from "../../redux/slices/StockInfoSlice";
import {
    get_inventory_map,
    get_sid_cash_invested_map,
    get_sid_gain_map,
    get_sid_handling_fee_map,
    get_sid_trade_records_map,
    get_stock_warehouse,
} from "../../redux/slices/TradeRecordSlice";
import type { RootState } from "../../redux/store";
import { get_sid_total_cash_dividend_map } from "../../redux/slices/CashDividendRecordSlice";

function mapStateToProps(root_state: RootState) {
    let stock_info_list: StockInfo[] = root_state.stock_info.info_list;
    let sid_stock_info_map = get_sid_stock_info_map(stock_info_list);
    let trade_record_list = root_state.trade_record.record_list;
    let sid_trade_records_map = get_sid_trade_records_map(trade_record_list);
    let inventory_map = get_inventory_map(sid_trade_records_map);
    let stock_warehouse = get_stock_warehouse(
        [...trade_record_list].sort(
            (a, b) => Date.parse(a.deal_time) - Date.parse(b.deal_time)
        )
    );
    let sid_cash_invested_map = get_sid_cash_invested_map(stock_warehouse);
    let sid_handling_fee_map = get_sid_handling_fee_map(sid_trade_records_map);
    let sid_gain_map = get_sid_gain_map(sid_trade_records_map);
    let cash_dividend_list = root_state.cash_dividend.record_list;
    let sid_total_cash_dividend_map =
        get_sid_total_cash_dividend_map(cash_dividend_list);
    let sid_market_value_map = get_sid_market_value_map(
        stock_info_list,
        inventory_map
    );
    return {
        sid_stock_info_map,
        inventory_map,
        sid_cash_invested_map,
        sid_handling_fee_map,
        sid_gain_map,
        sid_total_cash_dividend_map,
        sid_market_value_map,
    };
}

interface Props extends ReturnType<typeof mapStateToProps> {
    sid: string;
    onClick?: (sid: string) => void;
}

interface State {}

class DetailCard extends React.Component<Props, State> {
    public state: State;
    public constructor(props: Props) {
        super(props);
        this.state = {};
    }
    public render(): React.ReactNode {
        if (this.props.sid_stock_info_map[this.props.sid]) {
            return (
                <div
                    className={this.get_card_class_name(
                        this.props.sid_stock_info_map[this.props.sid]
                            .fluct_price
                    )}
                    onClick={() => {
                        if (this.props.onClick) {
                            this.props.onClick(this.props.sid);
                        }
                    }}
                >
                    <div className={styles.upper}>
                        <div className={styles.company}>
                            {`${this.props.sid} ${
                                this.props.sid_stock_info_map[this.props.sid]
                                    .name
                            }`}
                        </div>
                        <div className={styles.mid}>
                            <div className={styles.trade_quantity}>
                                {`成交${this.props.sid_stock_info_map[
                                    this.props.sid
                                ].quantity.toLocaleString()}張`}
                            </div>
                            <div className={styles.price_fluctuation}>
                                {`${
                                    this.props.sid_stock_info_map[
                                        this.props.sid
                                    ].fluct_price > 0
                                        ? "▲"
                                        : this.props.sid_stock_info_map[
                                              this.props.sid
                                          ].fluct_price < 0
                                        ? "▼"
                                        : "-"
                                }
                            ${
                                this.props.sid_stock_info_map[this.props.sid]
                                    .fluct_price !== 0
                                    ? Math.abs(
                                          this.props.sid_stock_info_map[
                                              this.props.sid
                                          ].fluct_price
                                      )
                                    : ""
                            }
                            ${
                                this.props.sid_stock_info_map[this.props.sid]
                                    .fluct_price !== 0
                                    ? "(" +
                                      (
                                          Math.abs(
                                              this.props.sid_stock_info_map[
                                                  this.props.sid
                                              ].fluct_rate
                                          ) * 100
                                      ).toFixed(1) +
                                      "%)"
                                    : ""
                            }`}
                            </div>
                        </div>
                        <div className={styles.price}>
                            {`$${
                                this.props.sid_stock_info_map[this.props.sid]
                                    .close
                            }`}
                        </div>
                    </div>
                    <div className={styles.lower}>
                        <div className={styles.inventory}>
                            {`庫存 ${
                                this.props.inventory_map[this.props.sid]
                            } 股`}
                        </div>
                        <div className={styles.average_cost}>{`平均成本 $${(
                            this.props.sid_cash_invested_map[this.props.sid] /
                            this.props.inventory_map[this.props.sid]
                        ).toFixed(2)}`}</div>
                        <div className={styles.rate_of_return}>
                            {`報酬率 ${this.rate_of_return.toFixed(2)}%`}
                        </div>
                    </div>
                </div>
            );
        }
        return null;
    }
    private get_card_class_name(fluct_price: number): string {
        return (
            styles.card +
            " " +
            (fluct_price > 0
                ? styles.red
                : fluct_price < 0
                ? styles.green
                : styles.gray)
        );
    }
    private get rate_of_return(): number {
        return (
            ((this.props.sid_market_value_map[this.props.sid] -
                this.props.sid_cash_invested_map[this.props.sid] +
                this.props.sid_gain_map[this.props.sid] +
                (this.props.sid_total_cash_dividend_map[this.props.sid] || 0) -
                this.props.sid_handling_fee_map[this.props.sid]) /
                this.props.sid_cash_invested_map[this.props.sid]) *
            100
        );
    }
}

export default connect(mapStateToProps)(DetailCard);
