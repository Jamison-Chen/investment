import styles from "./Main.module.scss";
import person_fill from "../../assets/person-fill.svg";

import React from "react";
import { Outlet } from "react-router-dom";
import { connect } from "react-redux";

import { RootState, AppDispatch } from "../../redux/store";
import { fetch_account_info } from "../../redux/slices/AccountSlice";
import { fetch_all_trade_records } from "../../redux/slices/TradeRecordSlice";
import { fetch_all_cash_dividend_records } from "../../redux/slices/CashDividendRecordSlice";
import { fetch_all_stock_info } from "../../redux/slices/StockInfoSlice";
import Header from "../../components/Header/Header";
import MainFunctionBar from "../../components/MainFunctionBar/MainFunctionBar";
import MainFunctionTab from "../../components/MainFunctionTab/MainFunctionTab";
import IconHouseDoorFill from "../../components/Icons/IconHouseDoorFill";
import IconJournalText from "../../components/Icons/IconJournalText";
import IconColumnsGap from "../../components/Icons/IconPersonCircle";
import { RouterInterface, withRouter } from "../../router";
import Footer from "../../components/Footer/Footer";
import Utils from "../../util";
import IconWatch from "../../components/Icons/IconWatch";
import IconViewList from "../../components/Icons/IconViewList";
import ErrorList from "../../components/ErrorList/ErrorList";

function mapStateToProps(root_state: RootState) {
    let username = root_state.account.username;
    let avatar_url = root_state.account.avatar_url;
    return { username, avatar_url };
}

interface PropsInterface
    extends RouterInterface,
        ReturnType<typeof mapStateToProps> {
    dispatch: AppDispatch;
}

interface StateInterface {
    is_hidden_bar_active: boolean;
    subpage_list: {
        tab_icon: any;
        tab_name: string;
        path: string;
    }[];
}

class Main extends React.Component<PropsInterface, StateInterface> {
    public state: StateInterface;
    public constructor(props: PropsInterface) {
        super(props);
        this.state = {
            is_hidden_bar_active: false,
            subpage_list: [
                {
                    tab_icon: <IconHouseDoorFill side_length="100%" />,
                    tab_name: "總覽",
                    path: "/investment/overview",
                },
                {
                    tab_icon: <IconViewList side_length="100%" />,
                    tab_name: "持倉細況",
                    path: "/investment/details",
                },
                {
                    tab_icon: <IconJournalText side_length="95%" />,
                    tab_name: "歷史紀錄",
                    path: "/investment/records",
                },
                {
                    tab_icon: <IconWatch side_length="100%" />,
                    tab_name: "買賣計畫",
                    path: "/investment/plans",
                },
                {
                    tab_icon: <IconColumnsGap side_length="90%" />,
                    tab_name: "應用程式",
                    path: "/investment/external-apps",
                },
            ],
        };
        this.props
            .dispatch(fetch_account_info())
            .unwrap()
            .then(async () => {
                await Promise.all([
                    this.props.dispatch(fetch_all_trade_records()),
                    this.props.dispatch(fetch_all_stock_info()),
                    this.props.dispatch(fetch_all_cash_dividend_records()),
                ]);
                Utils.remove_loading_screen();
            });
    }
    public async componentDidMount(): Promise<void> {
        Utils.render_loading_screen();
    }
    public render(): React.ReactNode {
        return (
            <main className={styles.main}>
                <ErrorList />
                <MainFunctionBar
                    user_avatar_url={this.props.avatar_url || person_fill}
                    username={this.props.username}
                    is_active_in_short_screen={this.state.is_hidden_bar_active}
                    toggle={this.toggle_main_function_bar}
                >
                    {this.state.subpage_list.map((each, idx) => {
                        return (
                            <MainFunctionTab
                                tab_icon={each.tab_icon}
                                tab_name={each.tab_name}
                                to={`${each.path}`}
                                onClick={this.toggle_main_function_bar}
                                key={idx}
                            />
                        );
                    })}
                </MainFunctionBar>
                <div className={styles.body}>
                    <Header
                        avatar_url={this.props.avatar_url || person_fill}
                        handle_click_list_button={this.toggle_main_function_bar}
                    />
                    <Outlet />
                    <Footer subpage_list={this.state.subpage_list} />
                </div>
            </main>
        );
    }
    private toggle_main_function_bar = (): void => {
        this.setState((state, props) => {
            return { is_hidden_bar_active: !state.is_hidden_bar_active };
        });
    };
}

export default connect(mapStateToProps)(withRouter(Main));
