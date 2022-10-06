import styles from "./Account.module.scss";

import React from "react";
import {
    Location,
    NavigateFunction,
    Params,
    URLSearchParamsInit,
    useLocation,
    useNavigate,
    useParams,
    useSearchParams,
} from "react-router-dom";

import Utils from "../../../util";
import BeautifulBlock from "../../../components/BeautifulBlock/BeautifulBlock";
import BeautifulRow from "../../../components/BeautifulRow/BeautifulRow";
import RoundButton from "../../../components/RoundButton/RoundButton";
import IconArrowLeft from "../../../components/Icons/IconArrowLeft";

interface PropsInterface {
    router: {
        location: Location;
        params: Params;
        navigate: NavigateFunction;
        search_params: URLSearchParams;
        set_search_params: (
            nextInit: URLSearchParamsInit,
            navigateOptions?:
                | {
                      replace?: boolean | undefined;
                      state?: any;
                  }
                | undefined
        ) => void;
    };
}

interface StateInterface {
    id: string;
    email: string;
    username: string;
    avatar_url: string | null;
}

class Account extends React.Component<PropsInterface, StateInterface> {
    public state: StateInterface;
    public constructor(props: PropsInterface) {
        super(props);
        this.state = { id: "", email: "", username: "", avatar_url: null };
    }
    public async componentDidMount(): Promise<void> {
        let response: any = await Utils.check_login();
        if (response && response.success) {
            this.setState({
                id: response.data.id,
                email: response.data.email,
                username: response.data.username,
                avatar_url: response.data.avatar_url,
            });
        }
    }
    public render(): React.ReactNode {
        return (
            <div className={styles.main}>
                <div className={styles.header}>
                    <RoundButton
                        className="p-8"
                        onClick={() =>
                            this.props.router.navigate("/investment/overview")
                        }
                    >
                        <IconArrowLeft side_length="20" />
                    </RoundButton>
                    <h1>基本資訊</h1>
                </div>
                <BeautifulBlock>
                    <BeautifulRow
                        label="相片"
                        onClick={() =>
                            this.props.router.navigate(
                                "/investment/account/avatar"
                            )
                        }
                    >
                        {this.state.avatar_url ? (
                            <img
                                className={styles.avatar}
                                src={this.state.avatar_url}
                                alt=""
                            />
                        ) : null}
                    </BeautifulRow>
                    <BeautifulRow
                        label="姓名"
                        onClick={() =>
                            this.props.router.navigate(
                                "/investment/account/username"
                            )
                        }
                    >
                        {this.state.username}
                    </BeautifulRow>
                    <BeautifulRow
                        label="Email"
                        onClick={() =>
                            this.props.router.navigate(
                                "/investment/account/email"
                            )
                        }
                    >
                        {this.state.email}
                    </BeautifulRow>
                </BeautifulBlock>
                <div className={styles.header}>
                    <h1>安全性</h1>
                </div>
                <BeautifulBlock>
                    <BeautifulRow
                        label="密碼"
                        onClick={() =>
                            this.props.router.navigate(
                                "/investment/account/password"
                            )
                        }
                    >
                        ********
                    </BeautifulRow>
                </BeautifulBlock>
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
    let [search_params, set_search_params] = useSearchParams();
    return (
        <Account
            {...props}
            router={{
                location,
                navigate,
                params,
                search_params,
                set_search_params,
            }}
        />
    );
}
