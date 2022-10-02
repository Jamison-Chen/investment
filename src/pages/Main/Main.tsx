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
    public constructor(props: PropsInterface) {
        super(props);
        this.state = {
            avatar_url: "",
            username: "",
            is_hidden_bar_active: false,
        };
    }
    public async componentDidMount(): Promise<void> {
        let response: any = await Utils.check_login();
        this.setState({
            username: response["user-info"].username,
            avatar_url: response["user-info"].avatar_url,
        });
    }
    public render(): React.ReactNode {
        return (
            <div className={styles.main}>
                <Header
                    avatar_url={this.state.avatar_url}
                    username={this.state.username}
                />
                <main className={styles.body}>
                    <Outlet />
                </main>
            </div>
        );
    }
}

export default function ComponentWithRouterProp(
    props: any = {}
): React.ReactElement {
    let location = useLocation();
    let navigate = useNavigate();
    let params = useParams();
    return <Main {...props} router={{ location, navigate, params }} />;
}
