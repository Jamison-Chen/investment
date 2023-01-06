import styles from "./Details.module.scss";

import React, { ChangeEvent } from "react";
import { connect } from "react-redux";
import { Chart } from "react-google-charts";
import { Link } from "react-router-dom";

import { RouterInterface, withRouter } from "../../../router";
import type { RootState } from "../../../redux/store";
import type { StockInfo, TradeRecord } from "../../../types";
import {
    get_sid_market_value_map,
    get_sid_stock_info_map,
} from "../../../redux/slices/StockInfoSlice";
import {
    Button,
    DetailCard,
    RoundButton,
    Modal,
    TradeRecordModal,
    CashDividendRecordModal,
    TradePlanModal,
    BeautifulRow,
    StockMemoModal,
} from "../../../components";
import {
    get_inventory_map,
    get_sid_cash_invested_map,
    get_sid_gain_map,
    get_sid_trade_records_map,
    get_stock_warehouse,
} from "../../../redux/slices/TradeRecordSlice";
import { IconPencilSquare, IconWatch, IconPiggyBank } from "../../../icons";
import { get_sid_total_cash_dividend_map } from "../../../redux/slices/CashDividendRecordSlice";
import Util from "../../../utils/util";

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
    let sid_gain_map = get_sid_gain_map(sid_trade_records_map);
    let cash_dividend_list = root_state.cash_dividend.record_list;
    let sid_total_cash_dividend_map =
        get_sid_total_cash_dividend_map(cash_dividend_list);
    let sid_market_value_map = get_sid_market_value_map(
        stock_info_list,
        inventory_map
    );
    let sid_memo_map = root_state.memo.sid_memo_map;
    return {
        sid_stock_info_map,
        sid_trade_records_map,
        inventory_map,
        sid_cash_invested_map,
        sid_gain_map,
        sid_total_cash_dividend_map,
        sid_market_value_map,
        sid_memo_map,
    };
}

interface Props extends RouterInterface, ReturnType<typeof mapStateToProps> {}

interface State {
    active_modal_name:
        | "create_trade_record"
        | "create_cash_dividend_record"
        | "create_trade_plan"
        | "update_or_create_business"
        | "update_or_create_strategy"
        | "update_or_create_note"
        | null;
}

class Details extends React.Component<Props, State> {
    public state: State;
    public constructor(props: Props) {
        super(props);
        this.state = {
            active_modal_name: null,
        };
    }
    public async componentDidMount(): Promise<void> {}
    public render(): React.ReactNode {
        return (
            <div className={styles.main}>
                {this.active_modal}
                <div className={styles.background} />
                <div className={styles.upper}>
                    <select
                        className={styles.menu}
                        value={this.sid}
                        onChange={this.handle_change_selected_menu_item}
                    >
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
                    <RoundButton
                        className="p-8"
                        hint_text="新增交易紀錄"
                        onClick={() => {
                            this.setState({
                                active_modal_name: "create_trade_record",
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
                                active_modal_name: "create_trade_plan",
                            });
                        }}
                    >
                        <IconWatch side_length="16" />
                    </RoundButton>
                </div>
                <div className={styles.details}>
                    <DetailCard sid={this.sid} />
                    <div className={styles.block}>
                        <h2 className={styles.title}>
                            庫存成本
                            <Link to={`/investment/records?sid=${this.sid}`}>
                                <Button className="transparent xs">
                                    查看交易紀錄
                                </Button>
                            </Link>
                        </h2>
                        <div className={styles.body + " " + styles.histogram}>
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
                        <div className={styles.body + " " + styles.performance}>
                            <div className={styles.row}>
                                <span>現金投入</span>
                                <span className={styles.number}>
                                    $
                                    {Math.round(
                                        this.props.sid_cash_invested_map[
                                            this.sid
                                        ]
                                    ).toLocaleString()}
                                </span>
                            </div>
                            <div className={styles.row}>
                                <span>證券市值</span>
                                <span className={styles.number}>
                                    $
                                    {this.props.sid_market_value_map[
                                        this.sid
                                    ]?.toLocaleString()}
                                </span>
                            </div>
                            <div className={styles.row}>
                                <span>實現損益</span>
                                <span className={styles.number}>
                                    $
                                    {Math.round(
                                        this.props.sid_gain_map[this.sid] +
                                            (this.props
                                                .sid_total_cash_dividend_map[
                                                this.sid
                                            ] || 0)
                                    ).toLocaleString()}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className={styles.block}>
                        <h2 className={styles.title}>
                            我的筆記
                            <Link to={`/investment/plans?sid=${this.sid}`}>
                                <Button className="transparent xs">
                                    查看買賣計畫
                                </Button>
                            </Link>
                        </h2>
                        <div className={styles.body}>
                            <BeautifulRow
                                label="主要業務"
                                value={
                                    <div className={styles.memo}>
                                        {
                                            this.props.sid_memo_map[this.sid]
                                                ?.business
                                        }
                                    </div>
                                }
                                onClick={() => {
                                    this.setState({
                                        active_modal_name:
                                            "update_or_create_business",
                                    });
                                }}
                            />
                            <BeautifulRow
                                label="投資策略"
                                value={
                                    <div className={styles.memo}>
                                        {
                                            this.props.sid_memo_map[this.sid]
                                                ?.strategy
                                        }
                                    </div>
                                }
                                onClick={() => {
                                    this.setState({
                                        active_modal_name:
                                            "update_or_create_strategy",
                                    });
                                }}
                            />
                            <BeautifulRow
                                label="備註"
                                value={
                                    <div className={styles.memo}>
                                        {
                                            this.props.sid_memo_map[this.sid]
                                                ?.note
                                        }
                                    </div>
                                }
                                onClick={() => {
                                    this.setState({
                                        active_modal_name:
                                            "update_or_create_note",
                                    });
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    private get active_modal(): React.ReactElement<Modal> | null {
        if (this.state.active_modal_name === "create_trade_record") {
            return (
                <TradeRecordModal
                    default_sid={this.sid!}
                    hide_modal={Util.hide_modal(this)}
                />
            );
        }
        if (this.state.active_modal_name === "create_cash_dividend_record") {
            return (
                <CashDividendRecordModal
                    default_sid={this.sid!}
                    hide_modal={Util.hide_modal(this)}
                />
            );
        }
        if (this.state.active_modal_name === "create_trade_plan") {
            return (
                <TradePlanModal
                    default_sid={this.sid!}
                    hide_modal={Util.hide_modal(this)}
                />
            );
        }
        if (this.state.active_modal_name === "update_or_create_business") {
            return (
                <StockMemoModal
                    sid={this.sid}
                    field_name="business"
                    field_default_value={
                        this.props.sid_memo_map[this.sid]?.business || ""
                    }
                    hide_modal={Util.hide_modal(this)}
                />
            );
        }
        if (this.state.active_modal_name === "update_or_create_strategy") {
            return (
                <StockMemoModal
                    sid={this.sid}
                    field_name="strategy"
                    field_default_value={
                        this.props.sid_memo_map[this.sid]?.strategy || ""
                    }
                    hide_modal={Util.hide_modal(this)}
                />
            );
        }
        if (this.state.active_modal_name === "update_or_create_note") {
            return (
                <StockMemoModal
                    sid={this.sid}
                    field_name="note"
                    field_default_value={
                        this.props.sid_memo_map[this.sid]?.note || ""
                    }
                    hide_modal={Util.hide_modal(this)}
                />
            );
        }
        return null;
    }
    private get sid(): string {
        return this.props.router.params.sid!;
    }
    private get trade_record_list(): TradeRecord[] {
        return this.props.sid_trade_records_map[this.sid] || [];
    }
    private handle_change_selected_menu_item = (
        e: ChangeEvent<HTMLSelectElement>
    ) => {
        this.props.router.navigate(`/investment/stock-list/${e.target.value}`);
    };
    private get histogram_chart_data(): (string | number)[][] {
        let result: (string | number)[][] = [];
        for (let record of this.trade_record_list) {
            let p = record.deal_price;
            let q = record.deal_quantity;
            let t = record.deal_time;
            if (q >= 0) for (let i = 0; i < q; i++) result.push([t, p]);
            else for (let i = 0; i < -q; i++) result.shift();
        }
        result.splice(0, 0, ["日期", "價格"]);
        return result;
    }
}

export default connect(mapStateToProps)(withRouter(Details));
