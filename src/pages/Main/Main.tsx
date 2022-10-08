import styles from "./Main.module.scss";
import person_fill from "../../assets/person-fill.svg";

import React from "react";
import { Outlet } from "react-router-dom";
import { connect } from "react-redux";

import { RootState, AppDispatch } from "../../app/store";
import { fetch_account_info } from "../../app/AccountSlice";
import Header from "../../components/Header/Header";
import MainFunctionBar from "../../components/MainFunctionBar/MainFunctionBar";
import MainFunctionTab from "../../components/MainFunctionTab/MainFunctionTab";
import IconHouseDoorFill from "../../components/Icons/IconHouseDoorFill";
import IconFileTextFill from "../../components/Icons/IconFileTextFill";
import IconCashStack from "../../components/Icons/IconCashStack";
import IconColumnsGap from "../../components/Icons/IconPersonCircle";
import Utils, { RouterInterface } from "../../util";

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
        tab_icon?: any;
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
                    tab_icon: <IconHouseDoorFill side_length="16" />,
                    tab_name: "總覽",
                    path: "/investment/overview",
                },
                {
                    tab_icon: <IconFileTextFill side_length="16" />,
                    tab_name: "歷史紀錄",
                    path: "/investment/records",
                },
                {
                    tab_icon: <IconCashStack side_length="16" />,
                    tab_name: "持股",
                    path: "/investment/detail",
                },
                {
                    tab_icon: <IconColumnsGap side_length="16" />,
                    tab_name: "應用程式",
                    path: "/investment/apps",
                },
            ],
        };
    }
    public async componentDidMount(): Promise<void> {
        this.props.dispatch(fetch_account_info());
    }
    public render(): React.ReactNode {
        return (
            <div className={styles.main}>
                <Header
                    avatar_url={this.props.avatar_url || person_fill}
                    handle_click_list_button={this.toggle_main_function_bar}
                />
                <main className={styles.body}>
                    <MainFunctionBar
                        user_avatar_url={this.props.avatar_url || person_fill}
                        username={this.props.username}
                        is_active_in_short_screen={
                            this.state.is_hidden_bar_active
                        }
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
                    <div className={styles.right_part}>
                        <Outlet />
                    </div>
                </main>
            </div>
        );
    }
    private toggle_main_function_bar = (): void => {
        this.setState((state, props) => {
            return { is_hidden_bar_active: !state.is_hidden_bar_active };
        });
    };
}

export default connect(mapStateToProps)(Utils.withRouter(Main));
