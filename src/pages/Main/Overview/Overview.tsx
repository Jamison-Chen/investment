import styles from "./Overview.module.scss";

import React from "react";
import { connect } from "react-redux";
import { Chart } from "react-google-charts";

import StretchableButton from "../../../components/StretchableButton/StretchableButton";
import { RouterInterface, withRouter } from "../../../router";
import { RootState } from "../../../redux/store";

function mapStateToProps(root_state: RootState) {
    let trade_record_list = root_state.trade_record.record_list;
    let sid_trade_records_map = root_state.trade_record.sid_records_map;
    let stock_info_list = root_state.stock_info.info_list;
    return { trade_record_list, sid_trade_records_map, stock_info_list };
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
                    </div>
                </div>
                <div className={styles.block}>
                    <h2 className={styles.title}>投資績效</h2>
                    <div className={styles.body}></div>
                </div>
                <div className={styles.block}>
                    <h2 className={styles.title}>投資金額</h2>
                    <div className={styles.body}></div>
                </div>
                <StretchableButton />
            </div>
        );
    }
    private get inventory_map(): { [idx: string]: number } {
        let result: { [idx: string]: number } = {};
        for (let sid in this.props.sid_trade_records_map) {
            for (let record of this.props.sid_trade_records_map[sid]) {
                if (result[sid] === undefined) {
                    result[sid] = record.deal_quantity;
                } else result[sid] += record.deal_quantity;
            }
        }
        for (let sid in result) if (result[sid] === 0) delete result[sid];
        return result;
    }
    private get sid_market_value_map(): { [idx: string]: number } {
        let result: { [idx: string]: number } = {};
        for (let sid in this.inventory_map) {
            result[sid] =
                this.props.stock_info_list.find((info) => info.sid === sid)!
                    .close * this.inventory_map[sid];
        }
        return result;
    }
    private get total_market_value(): number {
        let result = 0;
        for (let sid in this.inventory_map) {
            result +=
                this.props.stock_info_list.find((info) => info.sid === sid)!
                    .close * this.inventory_map[sid];
        }
        return result;
    }
    private get market_value_pie_chart_data(): (string | number)[][] {
        let result: (string | number)[][] = [["Sid", "Market Value"]];
        for (let sid in this.sid_market_value_map) {
            result.push([sid, this.sid_market_value_map[sid]]);
        }
        return result;
    }
}

export default connect(mapStateToProps)(withRouter(Overview));
