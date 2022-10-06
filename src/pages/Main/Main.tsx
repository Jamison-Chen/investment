import styles from "./Main.module.scss";

import React from "react";
import {
    Outlet,
    Location,
    NavigateFunction,
    Params,
    useLocation,
    useNavigate,
    useParams,
} from "react-router-dom";

import Header from "../../components/Header/Header";
import Utils from "../../util";
import MainFunctionBar from "../../components/MainFunctionBar/MainFunctionBar";
import MainFunctionTab from "../../components/MainFunctionTab/MainFunctionTab";
import IconHouseDoorFill from "../../components/Icons/IconHouseDoorFill";
import IconFileTextFill from "../../components/Icons/IconFileTextFill";
import IconCashStack from "../../components/Icons/IconCashStack";
import IconColumnsGap from "../../components/Icons/IconPersonCircle";

interface PropsInterface {
    router: {
        location: Location;
        params: Params;
        navigate: NavigateFunction;
    };
}

interface StateInterface {
    avatar_url: string;
    username: string;
    is_hidden_bar_active: boolean;
}

class Main extends React.Component<PropsInterface, StateInterface> {
    public state: StateInterface;
    private subpage_list: {
        tab_icon?: any;
        tab_name: string;
        path: string;
    }[];
    public constructor(props: PropsInterface) {
        super(props);
        this.state = {
            avatar_url: "",
            username: "",
            is_hidden_bar_active: false,
        };
        this.subpage_list = [
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
                path: "/investment/portfolio",
            },
            {
                tab_icon: <IconColumnsGap side_length="16" />,
                tab_name: "其他應用程式",
                path: "/investment/apps",
            },
        ];
    }
    public async componentDidMount(): Promise<void> {
        let response: any = await Utils.check_login();
        if (response && response.success) {
            this.setState({
                username: response.data.username,
                avatar_url: response.data.avatar_url,
            });
        }
    }
    public render(): React.ReactNode {
        return (
            <div className={styles.main}>
                <Header
                    avatar_url={this.state.avatar_url}
                    username={this.state.username}
                    handle_click_list_button={this.toggle_main_function_bar}
                />
                <main className={styles.body}>
                    <MainFunctionBar
                        user_avatar_url={this.state.avatar_url}
                        username={this.state.username}
                        is_active_in_short_screen={
                            this.state.is_hidden_bar_active
                        }
                        toggle={this.toggle_main_function_bar}
                    >
                        {this.subpage_list.map((each, idx) => {
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

export default function ComponentWithRouterProp(
    props: any = {}
): React.ReactElement {
    let location = useLocation();
    let navigate = useNavigate();
    let params = useParams();
    return <Main {...props} router={{ location, navigate, params }} />;
}
