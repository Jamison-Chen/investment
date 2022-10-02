import styles from "./Header.module.scss";

import React from "react";

import IconApp from "../Icons/IconApp";
import AppDropdown from "../AppDropdown/AppDropdown";
import UserAvatarDropDown from "../UserAvatarDropDown/UserAvatarDropDown";
import IconPersonCircle from "../Icons/IconPersonCircle";

interface PropsInterface {
    avatar_url: string;
    username: string;
}

interface StateInterface {
    is_app_dropdown_expanded: boolean;
    is_user_avatar_dropdown_expanded: boolean;
}

export default class Header extends React.Component<
    PropsInterface,
    StateInterface
> {
    public state: StateInterface;
    public constructor(props: PropsInterface) {
        super(props);
        this.state = {
            is_app_dropdown_expanded: false,
            is_user_avatar_dropdown_expanded: false,
        };
    }
    public render(): React.ReactNode {
        return (
            <header className={styles.header}>
                <div
                    className={styles.app_outer}
                    onClick={this.handle_click_app}
                >
                    <div className={styles.app_icon}>
                        <IconApp side_length="18" />
                    </div>
                    <AppDropdown
                        is_dropdown_expanded={
                            this.state.is_app_dropdown_expanded
                        }
                    />
                </div>
                <div
                    className={styles.user_avatar_outer}
                    onClick={this.handle_click_user_avatar}
                >
                    {this.props.avatar_url ? (
                        <img
                            src={this.props.avatar_url}
                            alt=""
                            className={styles.user_avatar}
                        />
                    ) : (
                        <IconPersonCircle side_length="22" />
                    )}
                    <UserAvatarDropDown
                        is_dropdown_expanded={
                            this.state.is_user_avatar_dropdown_expanded
                        }
                        user_avatar_url={this.props.avatar_url}
                        username={this.props.username}
                    />
                </div>
            </header>
        );
    }
    private handle_click_app = (): void => {
        this.setState((state, props) => {
            return {
                is_app_dropdown_expanded: !state.is_app_dropdown_expanded,
            };
        });
    };
    private handle_click_user_avatar = (): void => {
        this.setState((state, props) => {
            return {
                is_user_avatar_dropdown_expanded:
                    !state.is_user_avatar_dropdown_expanded,
            };
        });
    };
}
