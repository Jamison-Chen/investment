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
    get_total_cash_invested,
} from "../../../redux/slices/TradeRecordSlice";
import {
    get_sid_market_value_map,
    get_total_market_value,
} from "../../../redux/slices/StockInfoSlice";
import StretchableButton from "../../../components/StretchableButton/StretchableButton";

function mapStateToProps(root_state: RootState) {
    let trade_record_list = root_state.trade_record.record_list;
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
    let total_cash_invested = get_total_cash_invested(stock_warehouse);
    return {
        trade_record_list,
        stock_info_list,
        sid_trade_records_map,
        inventory_map,
        sid_market_value_map,
        total_market_value,
        stock_warehouse,
        sid_cash_invested_map,
        total_cash_invested,
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
                        {this.props.total_cash_invested}
                        {/* <Chart
                            chartType="ColumnChart"
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
                        /> */}
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
}

export default connect(mapStateToProps)(withRouter(Overview));
