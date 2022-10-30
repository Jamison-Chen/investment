import styles from "./Account.module.scss";

import React from "react";
import { connect } from "react-redux";

import { RootState } from "../../../redux/store";
import BeautifulBlock from "../../../components/BeautifulBlock/BeautifulBlock";
import BeautifulRow from "../../../components/BeautifulRow/BeautifulRow";
import RoundButton from "../../../components/RoundButton/RoundButton";
import IconArrowLeft from "../../../components/Icons/IconArrowLeft";
import { RouterInterface, withRouter } from "../../../router";

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
    public async componentDidMount(): Promise<void> {}
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
                        value={
                            this.props.avatar_url ? (
                                <img
                                    className={styles.avatar}
                                    src={this.props.avatar_url}
                                    alt=""
                                />
                            ) : null
                        }
                        onClick={() =>
                            this.props.router.navigate(
                                "/investment/account/avatar"
                            )
                        }
                    />
                    <BeautifulRow
                        label="姓名"
                        value={this.props.username}
                        onClick={() =>
                            this.props.router.navigate(
                                "/investment/account/username"
                            )
                        }
                    />
                    <BeautifulRow
                        label="Email"
                        value={this.props.email}
                        onClick={() =>
                            this.props.router.navigate(
                                "/investment/account/email"
                            )
                        }
                    />
                </BeautifulBlock>
                <div className={styles.header}>
                    <h1>安全性</h1>
                </div>
                <BeautifulBlock>
                    <BeautifulRow
                        label="密碼"
                        value="********"
                        onClick={() =>
                            this.props.router.navigate(
                                "/investment/account/password"
                            )
                        }
                    />
                </BeautifulBlock>
            </div>
        );
    }
}

export default connect(mapStateToProps)(withRouter(Account));
