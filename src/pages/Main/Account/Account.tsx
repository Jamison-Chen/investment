import styles from "./Account.module.scss";

import React from "react";
import { connect } from "react-redux";

import type { RootState } from "../../../redux/store";
import {
    BeautifulBlock,
    BeautifulRow,
    Button,
    RoundButton,
} from "../../../components";
import { IconArrowLeft, IconChevronDown } from "../../../icons";
import { IRouter, withRouter } from "../../../router";
import IconChevronUp from "../../../icons/IconChevronUp";

function mapStateToProps(root_state: RootState) {
    let email = root_state.account.email;
    let username = root_state.account.username;
    let avatar_url = root_state.account.avatar_url;
    return { email, username, avatar_url };
}

interface Props extends IRouter, ReturnType<typeof mapStateToProps> {}

interface State {
    is_advanced_section_expanded: boolean;
}

class Account extends React.Component<Props, State> {
    public state: State;
    public constructor(props: Props) {
        super(props);
        this.state = {
            is_advanced_section_expanded: false,
        };
    }
    public async componentDidMount(): Promise<void> {}
    public render(): React.ReactNode {
        return (
            <div className={styles.main}>
                <div className={styles.section}>
                    <div className={styles.header}>
                        <RoundButton
                            className="p-8"
                            onClick={() =>
                                this.props.router.navigate(
                                    "/investment/overview"
                                )
                            }
                        >
                            <IconArrowLeft side_length="20" />
                        </RoundButton>
                        <h2>基本資訊</h2>
                    </div>
                    <BeautifulBlock>
                        <BeautifulRow
                            label="頭像"
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
                </div>
                <div className={styles.section}>
                    <div className={styles.header}>
                        <h2>安全性</h2>
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
                <div className={styles.section}>
                    <Button
                        className="s primary"
                        onClick={this.handle_click_advance}
                    >
                        進階選項
                        {this.state.is_advanced_section_expanded ? (
                            <IconChevronUp side_length="12" />
                        ) : (
                            <IconChevronDown side_length="12" />
                        )}
                    </Button>
                    {this.state.is_advanced_section_expanded && (
                        <div className={styles.advanced}>
                            <div className={styles.header}>
                                <h2>刪除帳號</h2>
                            </div>
                            <Button
                                className="dangerous border"
                                onClick={() =>
                                    this.props.router.navigate(
                                        "/investment/account/delete-account"
                                    )
                                }
                            >
                                永久刪除帳號
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        );
    }
    private handle_click_advance = (): void => {
        this.setState((state, props) => {
            return {
                is_advanced_section_expanded:
                    !state.is_advanced_section_expanded,
            };
        });
    };
}

export default connect(mapStateToProps)(withRouter(Account));
