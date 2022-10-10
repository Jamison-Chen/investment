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
import { CashDividendRecord } from "../../../redux/slices/CashDividendRecordSlice";
import {
    get_sid_market_value_map,
    get_total_market_value,
} from "../../../redux/slices/StockInfoSlice";
import StretchableButton from "../../../components/StretchableButton/StretchableButton";

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
    let stock_warehouse = get_stock_warehouse(trade_record_list);
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
                    <div className={styles.body}>
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
                                    width: "80%",
                                    height: "60%",
                                },
                            }}
                            width={"100%"}
                            height={"100%"}
                        />
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
                    </div>
                </div>
                <div className={styles.block}>
                    <h2 className={styles.title}>投資績效</h2>
                    <div className={styles.body}>
                        <Chart
                            chartType="ColumnChart"
                            data={this.bar_chart_data}
                            options={{
                                vAxis: {
                                    minValue: 0,
                                    scaleType: "mirrorLog",
                                    textPosition: "none",
                                    gridlines: { count: 0 },
                                },
                                bar: { groupWidth: "61.8%" },
                                legend: { position: "none" },
                                chartArea: {
                                    left: "8%",
                                    top: "0%",
                                    width: "84%",
                                    height: "85%",
                                },

                                backgroundColor: "transparent",
                                pieSliceText: "none",
                            }}
                            width={"100%"}
                            height={"100%"}
                        />
                    </div>
                </div>
                <div className={styles.block}>
                    <h2 className={styles.title}>投資金額</h2>
                    <div className={styles.body}></div>
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
    private get_total_cash_dividend = (
        cash_dividend_record_list: CashDividendRecord[]
    ): number => {
        let result = 0;
        for (let record of cash_dividend_record_list) {
            result += record.cash_dividend;
        }
        return result;
    };
    private get_total_gain(
        sid_trade_records_map: { [sid: string]: TradeRecord[] },
        total_cash_dividend: number
    ): number {
        let total_gain = 0;
        let sid_gain_map: { [sid: string]: number } = {};

        for (let sid in sid_trade_records_map) {
            // `queue` can only contain elements with all positive q or all negative q
            let queue: { q: number; p: number }[] = [];
            sid_gain_map[sid] = 0;

            for (let record of sid_trade_records_map[sid]) {
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

        return total_gain + total_cash_dividend;
    }
    private get_total_handling_fee(trade_record_list: TradeRecord[]): number {
        let result = 0;
        for (let record of trade_record_list) result += record.handling_fee;
        return result;
    }
    private get bar_chart_data(): any[][] {
        let total_cash_invested = this.get_total_cash_invested(
            get_stock_warehouse(this.props.trade_record_list)
        );
        let total_gain = this.get_total_gain(
            this.props.sid_trade_records_map,
            this.get_total_cash_dividend(this.props.cash_dividend_record_list)
        );
        return [
            ["Assets", "", { role: "style" }],
            ["現金投入", total_cash_invested, "#FBBC05"],
            [
                "證券市值",
                this.props.total_market_value,
                this.props.total_market_value > total_cash_invested
                    ? "#DE5246"
                    : "#1AA260",
            ],
            ["實現損益", total_gain, total_gain > 0 ? "#DE5246" : "#000"],
            [
                "費用",
                this.get_total_handling_fee(this.props.trade_record_list),
                "#aaa",
            ],
        ];
    }
}

export default connect(mapStateToProps)(withRouter(Overview));
