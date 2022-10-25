import styles from "./DetailCard.module.scss";

import React from "react";
import { StockInfo } from "../../redux/slices/StockInfoSlice";

interface PropsInterface {
    stock_info: StockInfo;
    inventory: number;
    cash_invested: number;
    rate_of_return: number;
    onClick?: (sid: string) => void;
}

interface StateInterface {}

export default class DetailCard extends React.Component<
    PropsInterface,
    StateInterface
> {
    public state: StateInterface;
    public constructor(props: PropsInterface) {
        super(props);
        this.state = {};
    }
    public render(): React.ReactNode {
        return (
            <div
                className={this.get_card_class_name(
                    this.props.stock_info.fluct_price
                )}
                onClick={() => {
                    if (this.props.onClick) {
                        this.props.onClick(this.props.stock_info.sid);
                    }
                }}
            >
                <div className={styles.upper}>
                    <div className={styles.company}>
                        {`${this.props.stock_info.sid} ${this.props.stock_info.name}`}
                    </div>
                    <div className={styles.mid}>
                        <div className={styles.trade_quantity}>
                            {`成交${this.props.stock_info.quantity.toLocaleString()}張`}
                        </div>
                        <div className={styles.price_fluctuation}>
                            {`${
                                this.props.stock_info.fluct_price > 0
                                    ? "▲"
                                    : this.props.stock_info.fluct_price < 0
                                    ? "▼"
                                    : "-"
                            }
                            ${
                                this.props.stock_info.fluct_price !== 0
                                    ? Math.abs(
                                          this.props.stock_info.fluct_price
                                      )
                                    : ""
                            }
                            ${
                                this.props.stock_info.fluct_price !== 0
                                    ? "(" +
                                      (
                                          Math.abs(
                                              this.props.stock_info.fluct_rate
                                          ) * 100
                                      ).toFixed(1) +
                                      "%)"
                                    : ""
                            }`}
                        </div>
                    </div>
                    <div className={styles.price}>
                        {`$${this.props.stock_info.close}`}
                    </div>
                </div>
                <div className={styles.lower}>
                    <div className={styles.inventory}>
                        {`庫存 ${this.props.inventory} 股`}
                    </div>
                    <div className={styles.average_cost}>{`平均成本 $${(
                        this.props.cash_invested / this.props.inventory
                    ).toFixed(2)}`}</div>
                    <div className={styles.rate_of_return}>
                        {`報酬率 ${this.props.rate_of_return.toFixed(2)}%`}
                    </div>
                </div>
            </div>
        );
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
}
