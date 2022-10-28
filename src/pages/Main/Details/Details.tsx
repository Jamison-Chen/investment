import styles from "./Details.module.scss";

import React, { ChangeEvent } from "react";
import { connect } from "react-redux";

import { RouterInterface, withRouter } from "../../../router";
import { RootState } from "../../../redux/store";
import {
    get_sid_market_value_map,
    get_sid_stock_info_map,
    StockInfo,
} from "../../../redux/slices/StockInfoSlice";
import Button from "../../../components/Button/Button";
import {
    get_inventory_map,
    get_sid_cash_invested_map,
    get_sid_gain_map,
    get_sid_handling_fee_map,
    get_sid_trade_records_map,
    get_stock_warehouse,
} from "../../../redux/slices/TradeRecordSlice";
import Chart from "react-google-charts";
import DetailCard from "../../../components/DetailCard/DetailCard";
import RoundButton from "../../../components/RoundButton/RoundButton";
import IconPencilSquare from "../../../components/Icons/IconPencilSquare";
import IconWatch from "../../../components/Icons/IconWatch";
import IconPiggyBank from "../../../components/Icons/IconPiggyBank";
import Modal from "../../../components/Modal/Modal";
import TradeRecordModal from "../../../components/TradeRecordModal/TradeRecordModal";
import CashDividendRecordModal from "../../../components/CashDividendRecordModal/CashDividendRecordModal";
import { get_sid_total_cash_dividend_map } from "../../../redux/slices/CashDividendRecordSlice";

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
        sid_trade_records_map,
        inventory_map,
        sid_cash_invested_map,
        sid_handling_fee_map,
        sid_gain_map,
        sid_total_cash_dividend_map,
        sid_market_value_map,
    };
}

interface PropsInterface
    extends RouterInterface,
        ReturnType<typeof mapStateToProps> {}

interface StateInterface {
    active_subpage_name: "stock_list" | "stock_details";
    active_modal_name:
        | "create_trade_record"
        | "create_cash_dividend_record"
        | "create_trade_plan"
        | null;
}

class Details extends React.Component<PropsInterface, StateInterface> {
    public state: StateInterface;
    public constructor(props: PropsInterface) {
        super(props);
        this.state = {
            active_subpage_name: "stock_list",
            active_modal_name: null,
        };
    }
    public async componentDidMount(): Promise<void> {}
    public render(): React.ReactNode {
        return (
            <div className={styles.main}>
                {this.active_modal}
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
                {this.state.active_subpage_name === "stock_details" ? (
                    <div className={styles.upper}>
                        <select
                            className={styles.menu}
                            value={
                                this.props.router.search_params.get("sid") || ""
                            }
                            onChange={this.handle_change_selected_menu_item}
                        >
                            <option defaultChecked hidden>
                                請選擇標的
                            </option>
                            {Object.keys(this.props.inventory_map).map(
                                (sid, idx) => {
                                    return (
                                        <option
                                            key={idx}
                                            value={sid}
                                        >{`${sid} ${this.props.sid_stock_info_map[sid].name}`}</option>
                                    );
                                }
                            )}
                        </select>
                        {this.props.router.search_params.get("sid") ? (
                            <>
                                <RoundButton
                                    className="p-8"
                                    hint_text="新增交易紀錄"
                                    onClick={() => {
                                        this.setState({
                                            active_modal_name:
                                                "create_trade_record",
                                        });
                                    }}
                                >
                                    <IconPencilSquare side_length="16" />
                                </RoundButton>
                                <RoundButton
                                    className="p-8"
                                    hint_text="新增現金股利"
                                    onClick={() => {
                                        this.setState({
                                            active_modal_name:
                                                "create_cash_dividend_record",
                                        });
                                    }}
                                >
                                    <IconPiggyBank side_length="16" />
                                </RoundButton>
                                <RoundButton
                                    className="p-8"
                                    hint_text="新增買賣計畫"
                                    onClick={() => {
                                        this.setState({
                                            active_modal_name:
                                                "create_trade_plan",
                                        });
                                    }}
                                >
                                    <IconWatch side_length="16" />
                                </RoundButton>
                            </>
                        ) : null}
                    </div>
                ) : null}
                {this.active_subpage}
            </div>
        );
    }
    private get active_modal(): React.ReactElement<Modal> | null {
        if (this.state.active_modal_name === "create_trade_record") {
            return (
                <TradeRecordModal
                    default_sid={this.props.router.search_params.get("sid")!}
                    hide_modal={this.hide_modal}
                />
            );
        }
        if (this.state.active_modal_name === "create_cash_dividend_record") {
            return (
                <CashDividendRecordModal
                    default_sid={this.props.router.search_params.get("sid")!}
                    hide_modal={this.hide_modal}
                />
            );
        }
        if (this.state.active_modal_name === "create_trade_plan") {
        }
        return null;
    }
    private hide_modal = (): void => {
        this.setState({ active_modal_name: null });
    };
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
                            <DetailCard
                                key={idx}
                                stock_info={this.props.sid_stock_info_map[sid]}
                                inventory={this.props.inventory_map[sid]}
                                cash_invested={
                                    this.props.sid_cash_invested_map[sid]
                                }
                                rate_of_return={this.get_rate_of_return(sid)}
                                onClick={this.handle_click_card}
                            />
                        );
                    })}
                </div>
            );
        } else {
            return (
                <div className={styles.details}>
                    {this.props.router.search_params.get("sid") ? (
                        <>
                            <DetailCard
                                stock_info={
                                    this.props.sid_stock_info_map[
                                        this.props.router.search_params.get(
                                            "sid"
                                        )!
                                    ]
                                }
                                inventory={
                                    this.props.inventory_map[
                                        this.props.router.search_params.get(
                                            "sid"
                                        )!
                                    ]
                                }
                                cash_invested={
                                    this.props.sid_cash_invested_map[
                                        this.props.router.search_params.get(
                                            "sid"
                                        )!
                                    ]
                                }
                                rate_of_return={this.get_rate_of_return(
                                    this.props.router.search_params.get("sid")!
                                )}
                            />
                            <div className={styles.block}>
                                <h2 className={styles.title}>庫存成本</h2>
                                <div
                                    className={
                                        styles.body + " " + styles.histogram
                                    }
                                >
                                    <Chart
                                        chartType="Histogram"
                                        data={this.histogram_chart_data}
                                        options={{
                                            legend: { position: "none" },
                                            colors: ["#444"],
                                            chartArea: {
                                                left: "10%",
                                                top: "15%",
                                                width: "85%",
                                                height: "70%",
                                            },
                                        }}
                                        width={"100%"}
                                        height={"100%"}
                                    />
                                </div>
                            </div>
                            <div className={styles.block}>
                                <h2 className={styles.title}>投資績效</h2>
                                <div
                                    className={
                                        styles.body + " " + styles.performance
                                    }
                                >
                                    <div className={styles.row}>
                                        <span>現金投入</span>
                                        <span className={styles.number}>
                                            $
                                            {Math.round(
                                                this.props
                                                    .sid_cash_invested_map[
                                                    this.props.router.search_params.get(
                                                        "sid"
                                                    )!
                                                ]
                                            ).toLocaleString()}
                                        </span>
                                    </div>
                                    <div className={styles.row}>
                                        <span>證券市值</span>
                                        <span className={styles.number}>
                                            $
                                            {this.props.sid_market_value_map[
                                                this.props.router.search_params.get(
                                                    "sid"
                                                )!
                                            ].toLocaleString()}
                                        </span>
                                    </div>
                                    <div className={styles.row}>
                                        <span>實現損益</span>
                                        <span className={styles.number}>
                                            $
                                            {Math.round(
                                                this.props.sid_gain_map[
                                                    this.props.router.search_params.get(
                                                        "sid"
                                                    )!
                                                ] +
                                                    (this.props
                                                        .sid_total_cash_dividend_map[
                                                        this.props.router.search_params.get(
                                                            "sid"
                                                        )!
                                                    ] || 0)
                                            ).toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className={styles.block}>
                                <h2 className={styles.title}>基本資訊</h2>
                            </div>
                        </>
                    ) : null}
                </div>
            );
        }
    }
    private get_rate_of_return(
        sid: string = this.props.router.search_params.get("sid")!
    ): number {
        return (
            ((this.props.sid_market_value_map[sid] -
                this.props.sid_cash_invested_map[sid] +
                this.props.sid_gain_map[sid] +
                (this.props.sid_total_cash_dividend_map[sid] || 0) -
                this.props.sid_handling_fee_map[sid]) /
                this.props.sid_cash_invested_map[sid]) *
            100
        );
    }
    private handle_click_card = (sid: string) => {
        this.setState({ active_subpage_name: "stock_details" });
        this.props.router.set_search_params({ sid: sid });
    };
    private handle_change_selected_menu_item = (
        e: ChangeEvent<HTMLSelectElement>
    ) => {
        this.props.router.set_search_params({ sid: e.target.value });
    };
    private get histogram_chart_data(): (string | number)[][] {
        let result: (string | number)[][] = [];
        let sid = this.props.router.search_params.get("sid");
        if (sid) {
            for (let record of this.props.sid_trade_records_map[sid]) {
                let p = record.deal_price;
                let q = record.deal_quantity;
                let t = record.deal_time;
                if (q >= 0) {
                    for (let i = 0; i < q; i++) result.push([t, p]);
                } else for (let i = 0; i < -q; i++) result.shift();
            }
        }
        result.splice(0, 0, ["日期", "價格"]);
        return result;
    }
}

export default connect(mapStateToProps)(withRouter(Details));
