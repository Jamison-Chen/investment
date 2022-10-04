import styles from "./UserAvatarDropDown.module.scss";

import React, { MouseEvent } from "react";

import Utils from "../../util";
import IconPersonCircle from "../Icons/IconPersonCircle";
import { NavLink } from "react-router-dom";

interface PropsInterface {
    is_dropdown_expanded: boolean;
    user_avatar_url: string;
    username: string;
}

interface StateInterface {}

export default class UserAvatarDropDown extends React.Component<
    PropsInterface,
    StateInterface
> {
    public state: StateInterface;
    public constructor(props: PropsInterface) {
        super(props);
        this.state = {};
    }
    public render(): React.ReactNode {
        return (
            <div
                className={
                    styles.full_screen_background +
                    (this.props.is_dropdown_expanded ? " " + styles.active : "")
                }
            >
                <div className={styles.dropdown}>
                    <NavLink to="/investment/account">
                        <div
                            className={
                                styles.dropdown_option + " " + styles.user_info
                            }
                            onClick={this.handle_click_user_info}
                        >
                            {this.props.user_avatar_url ? (
                                <img src={this.props.user_avatar_url} alt="" />
                            ) : (
                                <IconPersonCircle side_length="24" />
                            )}
                            <span className={styles.username}>
                                {this.props.username}
                            </span>
                        </div>
                    </NavLink>

                    <div
                        className={styles.dropdown_option}
                        onClick={this.handle_click_sign_out}
                    >
                        登出
                    </div>
                </div>
            </div>
        );
    }
    private handle_click_user_info = (e: MouseEvent): void => {
        e.stopPropagation();
    };
    private handle_click_sign_out = async (): Promise<void> => {
        let response: any = await Utils.send_request(
            "account/logout",
            "post",
            new URLSearchParams()
        );
        if (response && response.success) Utils.go_to_login_page();
        else throw Error("Failed to sign out.");
    };
}
