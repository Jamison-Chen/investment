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
    update_stock_warehouse,
    StockWarehouse,
    TradeRecord,
    get_sid_gain_map,
} from "../../../redux/slices/TradeRecordSlice";
import {
    get_sid_market_value_map,
    get_total_market_value,
} from "../../../redux/slices/StockInfoSlice";
import StretchableButton from "../../../components/StretchableButton/StretchableButton";
import Utils from "../../../util";
import { each } from "immer/dist/internal";

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
    let sid_gain_map = get_sid_gain_map(sid_trade_records_map);
    let total_market_value = get_total_market_value(
        stock_info_list,
        inventory_map
    );
    let stock_warehouse = get_stock_warehouse(
        [...trade_record_list].sort(
            (a, b) => Date.parse(a.deal_time) - Date.parse(b.deal_time)
        )
    );
    return {
        trade_record_list,
        cash_dividend_record_list,
        sid_trade_records_map,
        sid_market_value_map,
        sid_gain_map,
        total_market_value,
        stock_warehouse,
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
                                    width: "90%",
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
                            <span className={styles.number}>
                                {this.rate_of_return.toFixed(2)}%
                            </span>
                        </div>
                        <div className={styles.row}>
                            <span>現金投入</span>
                            <span className={styles.number}>
                                $
                                {Math.round(
                                    this.get_total_cash_invested()
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
                                data={this.cash_invested_chart_data}
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
                                    series: {
                                        1: {
                                            lineWidth: "0.5",
                                            color: "#888",
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
                                                    series: {
                                                        1: {
                                                            lineWidth: "0.5",
                                                            color: "#888",
                                                        },
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
        for (const [sid, market_value] of Object.entries(
            this.props.sid_market_value_map
        )) {
            result.push([sid, market_value]);
        }
        result.sort(
            (row_a, row_b) => (row_b[1] as number) - (row_a[1] as number)
        );
        result.unshift(["Sid", "Market Value"]);
        return result;
    }
    private get_total_cash_invested = (
        stock_warehouse: StockWarehouse = this.props.stock_warehouse,
        end_date?: Date
    ): number => {
        end_date?.setHours(0, 0, 0, 0);
        let result = 0;
        for (const t_map of Object.values(stock_warehouse)) {
            for (const [t, p_map] of Object.entries(t_map)) {
                let each_date = new Date(t);
                each_date.setHours(0, 0, 0, 0);
                if (each_date <= (end_date || new Date())) {
                    for (const [p, q] of Object.entries(p_map)) {
                        result += q * parseFloat(p);
                    }
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
        let result = 0;
        for (const gain of Object.values(this.props.sid_gain_map)) {
            result += gain;
        }
        return result + this.total_cash_dividend;
    }
    private get total_handling_fee(): number {
        let result = 0;
        for (let record of this.props.trade_record_list) {
            result += record.handling_fee;
        }
        return result;
    }
    private get_average_cash_invested(end_date?: Date): number {
        let min_date = new Date(
            Math.min(
                ...this.props.trade_record_list.map((record) =>
                    Date.parse(record.deal_time)
                )
            )
        );
        let date_string_list = Utils.get_date_string_list(
            min_date,
            end_date || new Date()
        );
        let num_of_days = date_string_list.length;

        let cumulative_cash_invested = 0;
        this.cash_invested_chart_data.slice(1).forEach((row) => {
            cumulative_cash_invested += row[1] as number;
        });

        return cumulative_cash_invested / num_of_days;
    }
    private get rate_of_return(): number {
        return (
            ((this.props.total_market_value -
                this.get_total_cash_invested() +
                this.total_gain -
                this.total_handling_fee) /
                this.get_average_cash_invested()) *
            100
        );
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
        } else if (date_string_list.length === 0) {
            if (
                new Date(ascending_trade_record_list[0].deal_time) <= new Date()
            ) {
                date_string_list = Utils.get_date_string_list(
                    new Date(ascending_trade_record_list[0].deal_time),
                    new Date()
                );
            } else {
                return result;
            }
        }

        let solving_date_string = date_string_list.shift();
        let solving_date: Date = new Date(
            solving_date_string!.split("-").map((e) => parseInt(e)) as any
        );
        solving_date.setHours(0, 0, 0, 0);
        let solving_list = ascending_trade_record_list.filter(
            (record) => record.deal_time === solving_date_string
        );

        ascending_trade_record_list = ascending_trade_record_list.filter(
            (record) => record.deal_time !== solving_date_string
        );
        stock_warehouse = update_stock_warehouse(solving_list, stock_warehouse);

        result.push([
            solving_date,
            Math.round(
                this.get_total_cash_invested(stock_warehouse, solving_date)
            ),
        ]);

        return this.get_cash_invested_chart_data(
            ascending_trade_record_list,
            date_string_list,
            stock_warehouse,
            result
        );
    };
    private get cash_invested_chart_data(): (Date | string | number)[][] {
        let result = this.get_cash_invested_chart_data(
            [...this.props.trade_record_list].sort(
                (a, b) => Date.parse(a.deal_time) - Date.parse(b.deal_time)
            )
        );
        result.forEach((row, idx) => {
            if (idx === 0) row.push("平均投入");
            else {
                row.push(
                    Math.round(
                        result
                            .slice(1, idx + 1)
                            .map((row) => row[1] as number)
                            .reduce((a, b) => a + b) / idx
                    )
                );
            }
        });
        return result;
    }
}

export default connect(mapStateToProps)(withRouter(Overview));
