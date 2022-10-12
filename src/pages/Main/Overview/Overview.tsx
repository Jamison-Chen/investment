import styles from "./Overview.module.scss";

import React from "react";
import { connect } from "react-redux";
import { Chart } from "react-google-charts";

import { RouterInterface, withRouter } from "../../../router";
import { RootState } from "../../../redux/store";
import {
    get_sid_trade_records_map,
    get_inventory_map,
    get_stock_warehouse,
    get_sid_cash_invested_map,
    StockWarehouse,
    TradeRecord,
} from "../../../redux/slices/TradeRecordSlice";
import {
    get_sid_market_value_map,
    get_total_market_value,
} from "../../../redux/slices/StockInfoSlice";
import StretchableButton from "../../../components/StretchableButton/StretchableButton";
import Utils from "../../../util";

function mapStateToProps(root_state: RootState) {
    let trade_record_list = root_state.trade_record.record_list;
    let cash_dividend_record_list = root_state.cash_dividend.record_list;
    let stock_info_list = root_state.stock_info.info_list;
    let sid_trade_records_map = get_sid_trade_records_map(trade_record_list);
    let inventory_map = get_inventory_map(sid_trade_records_map);
    let sid_market_value_map = get_sid_market_value_map(
        stock_info_list,
        inventory_map
    );
    let total_market_value = get_total_market_value(
        stock_info_list,
        inventory_map
    );
    let stock_warehouse = get_stock_warehouse(
        [...trade_record_list].sort(
            (a, b) => Date.parse(a.deal_time) - Date.parse(b.deal_time)
        )
    );
    let sid_cash_invested_map = get_sid_cash_invested_map(stock_warehouse);
    return {
        trade_record_list,
        cash_dividend_record_list,
        stock_info_list,
        sid_trade_records_map,
        inventory_map,
        sid_market_value_map,
        total_market_value,
        stock_warehouse,
        sid_cash_invested_map,
    };
}

interface PropsInterface
    extends RouterInterface,
        ReturnType<typeof mapStateToProps> {}

interface StateInterface {}

class Overview extends React.Component<PropsInterface, StateInterface> {
    public state: StateInterface;
    public constructor(props: PropsInterface) {
        super(props);
        this.state = {};
    }
    public async componentDidMount(): Promise<void> {}
    public render(): React.ReactNode {
        return (
            <div className={styles.main}>
                <div className={styles.background}></div>
                <div className={styles.block}>
                    <h2 className={styles.title}>投資組合</h2>
                    <div className={styles.body + " " + styles.portfolio}>
                        <Chart
                            chartType="PieChart"
                            data={this.market_value_pie_chart_data}
                            options={{
                                sliceVisibilityThreshold: 0.05,
                                backgroundColor: "transparent",
                                pieHole: 0.7,
                                pieSliceText: "none",
                                chartArea: {
                                    left: "10%",
                                    top: "20%",
                                    width: "85%",
                                    height: "60%",
                                },
                            }}
                            width={"100%"}
                            height={"100%"}
                        />
                        {this.market_value_pie_chart_data.length > 1 ? (
                            <div className={styles.chart_center}>
                                <div className={styles.upper}>今日市值</div>
                                <hr />
                                <div className={styles.lower}>
                                    $
                                    {Math.round(
                                        this.props.total_market_value
                                    ).toLocaleString()}
                                </div>
                            </div>
                        ) : null}
                    </div>
                </div>
                <div className={styles.block}>
                    <h2 className={styles.title}>投資績效</h2>
                    <div className={styles.body + " " + styles.performance}>
                        <div className={styles.row}>
                            <span>報酬率</span>
                            <span className={styles.number}>{0}</span>
                        </div>
                        <div className={styles.row}>
                            <span>現金投入</span>
                            <span className={styles.number}>
                                $
                                {Math.round(
                                    this.get_total_cash_invested(
                                        this.props.stock_warehouse
                                    )
                                ).toLocaleString()}
                            </span>
                        </div>
                        <div className={styles.row}>
                            <span>實現損益</span>
                            <span className={styles.number}>
                                ${Math.round(this.total_gain).toLocaleString()}
                            </span>
                        </div>
                        <div className={styles.row}>
                            <span>手續費用</span>
                            <span className={styles.number}>
                                ${this.total_handling_fee.toLocaleString()}
                            </span>
                        </div>
                    </div>
                </div>
                <div className={styles.block}>
                    <h2 className={styles.title}>投資金額</h2>
                    <div className={styles.body + " " + styles.cash_invested}>
                        {this.props.trade_record_list.length > 0 ? (
                            <Chart
                                chartType="LineChart"
                                data={this.get_cash_invested_chart_data(
                                    [...this.props.trade_record_list].sort(
                                        (a, b) =>
                                            Date.parse(a.deal_time) -
                                            Date.parse(b.deal_time)
                                    )
                                )}
                                options={{
                                    legend: { position: "none" },
                                    backgroundColor: "transparent",
                                    hAxis: {
                                        textPosition: "none",
                                        gridlines: {
                                            color: "none",
                                        },
                                    },
                                    vAxis: {
                                        textPosition: "none",
                                        gridlines: {
                                            color: "none",
                                        },
                                    },
                                    chartArea: {
                                        left: "0%",
                                        top: "0%",
                                        width: "100%",
                                        height: "90%",
                                    },
                                }}
                                width={"100%"}
                                height={"220px"}
                                chartPackages={["corechart", "controls"]}
                                controls={[
                                    {
                                        controlType: "ChartRangeFilter",
                                        options: {
                                            filterColumnIndex: 0,
                                            ui: {
                                                chartType: "LineChart",
                                                chartOptions: {
                                                    chartArea: {
                                                        width: "95%",
                                                        height: "10%",
                                                    },
                                                    backgroundColor:
                                                        "transparent",
                                                    hAxis: {
                                                        baselineColor: "none",
                                                        textPosition: "none",
                                                        gridlines: {
                                                            color: "none",
                                                        },
                                                    },
                                                    vAxis: {
                                                        textPosition: "none",
                                                        gridlines: {
                                                            color: "none",
                                                        },
                                                        baselineColor: "none",
                                                    },
                                                },
                                            },
                                        },
                                        controlPosition: "bottom",
                                        controlWrapperParams: {
                                            state: {
                                                range: {
                                                    start: new Date(
                                                        Math.min(
                                                            ...this.props.trade_record_list.map(
                                                                (record) =>
                                                                    Date.parse(
                                                                        record.deal_time
                                                                    )
                                                            )
                                                        )
                                                    ),
                                                    end: new Date(),
                                                },
                                            },
                                        },
                                    },
                                ]}
                            />
                        ) : null}
                    </div>
                </div>
                <StretchableButton />
            </div>
        );
    }
    private get market_value_pie_chart_data(): (string | number)[][] {
        let result: (string | number)[][] = [];
        for (let sid in this.props.sid_market_value_map) {
            result.push([sid, this.props.sid_market_value_map[sid]]);
        }
        result.sort(
            (row_a, row_b) => (row_b[1] as number) - (row_a[1] as number)
        );
        result.unshift(["Sid", "Market Value"]);
        return result;
    }
    private get_total_cash_invested = (
        stock_warehouse: StockWarehouse
    ): number => {
        let result = 0;
        for (let sid in stock_warehouse) {
            for (let t in stock_warehouse[sid]) {
                for (let p in stock_warehouse[sid][t]) {
                    result += stock_warehouse[sid][t][p] * parseFloat(p);
                }
            }
        }
        return result;
    };
    private get total_cash_dividend(): number {
        let result = 0;
        for (let record of this.props.cash_dividend_record_list) {
            result += record.cash_dividend;
        }
        return result;
    }
    private get total_gain(): number {
        let total_gain = 0;
        let sid_gain_map: { [sid: string]: number } = {};

        for (let sid in this.props.sid_trade_records_map) {
            // `queue` can only contain elements with all positive q or all negative q
            let queue: { q: number; p: number }[] = [];
            sid_gain_map[sid] = 0;

            for (let record of this.props.sid_trade_records_map[sid]) {
                let q = record.deal_quantity;
                let p = record.deal_price;
                if (queue.length === 0) queue.push({ q: q, p: p });
                else {
                    // Check if the last q in `queue` is of the same sign as the incoming q
                    if (queue[queue.length - 1].q * q > 0) {
                        queue.push({ q: q, p: p });
                    } else {
                        while (queue.length > 0 && q !== 0) {
                            // Check if there's remaining q after eliminating the first
                            // element in `queue` with the incoming q
                            if ((queue[0].q + q) * queue[0].q > 0) {
                                queue[0].q += q;
                                sid_gain_map[sid] += (p - queue[0].p) * -q;
                                q = 0;
                            } else {
                                q += queue[0].q;
                                sid_gain_map[sid] +=
                                    (p - queue[0].p) * queue[0].q;
                                queue.shift();
                            }
                        }
                    }
                }
            }
        }
        for (let sid in sid_gain_map) total_gain += sid_gain_map[sid];

        return total_gain + this.total_cash_dividend;
    }
    private get total_handling_fee(): number {
        let result = 0;
        for (let record of this.props.trade_record_list) {
            result += record.handling_fee;
        }
        return result;
    }
    private get_cash_invested_chart_data = (
        ascending_trade_record_list: TradeRecord[],
        date_string_list: string[] = [],
        stock_warehouse: StockWarehouse = {},
        result: (Date | string | number)[][] = [["日期", "現金投入"]]
    ): (Date | string | number)[][] => {
        if (
            ascending_trade_record_list.length === 0 &&
            date_string_list.length === 0
        ) {
            return result;
        }
        if (date_string_list.length === 0) {
            date_string_list = Utils.get_date_string_list(
                new Date(ascending_trade_record_list[0].deal_time),
                new Date()
            );
        }
        let solving_date_string = date_string_list.shift();
        let solving_date: Date = new Date(
            solving_date_string!.split("-").map((e) => parseInt(e)) as any
        );

        let solving_list = ascending_trade_record_list.filter(
            (record) => record.deal_time === solving_date_string
        );
        ascending_trade_record_list = ascending_trade_record_list.filter(
            (record) => record.deal_time !== solving_date_string
        );
        stock_warehouse = get_stock_warehouse(solving_list, stock_warehouse);
        result.push([
            solving_date,
            Math.round(this.get_total_cash_invested(stock_warehouse)),
        ]);
        return this.get_cash_invested_chart_data(
            ascending_trade_record_list,
            date_string_list,
            stock_warehouse,
            result
        );
    };
}

export default connect(mapStateToProps)(withRouter(Overview));
