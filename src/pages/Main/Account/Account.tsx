import styles from "./Account.module.scss";

import React from "react";
import { connect } from "react-redux";

import { RootState } from "../../../app/store";
import BeautifulBlock from "../../../components/BeautifulBlock/BeautifulBlock";
import BeautifulRow from "../../../components/BeautifulRow/BeautifulRow";
import RoundButton from "../../../components/RoundButton/RoundButton";
import IconArrowLeft from "../../../components/Icons/IconArrowLeft";
import Utils, { RouterInterface } from "../../../util";

function mapStateToProps(root_state: RootState) {
    let email = root_state.account.email;
    let username = root_state.account.username;
    let avatar_url = root_state.account.avatar_url;
    return { email, username, avatar_url };
}

interface PropsInterface
    extends RouterInterface,
        ReturnType<typeof mapStateToProps> {}

interface StateInterface {}

class Account extends React.Component<PropsInterface, StateInterface> {
    public state: StateInterface;
    public constructor(props: PropsInterface) {
        super(props);
        this.state = {};
    }
    public async componentDidMount(): Promise<void> {
        // this.props.dispatch(fetch_account_info());
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
                        {this.props.avatar_url ? (
                            <img
                                className={styles.avatar}
                                src={this.props.avatar_url}
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
                        {this.props.username}
                    </BeautifulRow>
                    <BeautifulRow
                        label="Email"
                        onClick={() =>
                            this.props.router.navigate(
                                "/investment/account/email"
                            )
                        }
                    >
                        {this.props.email}
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

export default connect(mapStateToProps)(Utils.withRouter(Account));
