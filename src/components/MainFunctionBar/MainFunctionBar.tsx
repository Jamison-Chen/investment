import styles from "./MainFunctionBar.module.scss";
import person_fill from "../../assets/person-fill.svg";

import React from "react";
import { NavLink } from "react-router-dom";

import Utils from "../../util";
import IconGearFill from "../Icons/IconGearFill";

interface PropsInterface {
    user_avatar_url: string;
    username: string;
    children: React.ReactNode[];
    is_active_in_short_screen: boolean;
    toggle: () => void;
}

interface StateInterface {}

export default class MainFunctionBar extends React.Component<
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
            <>
                <div
                    className={
                        styles.main +
                        (this.props.is_active_in_short_screen
                            ? " " + styles.active
                            : "")
                    }
                >
                    <NavLink to="/investment/account">
                        <div className={styles.user_info}>
                            <img
                                src={this.props.user_avatar_url || person_fill}
                                alt=""
                            />
                            <span className={styles.username}>
                                {this.props.username}
                            </span>
                        </div>
                    </NavLink>
                    {this.props.children}

                    <div className={styles.lower}>
                        <div
                            className={styles.logout_button}
                            onClick={this.handle_click_sign_out}
                        >
                            登出
                        </div>
                        <NavLink
                            to={"/investment/setting"}
                            className={styles.setting}
                            onClick={this.toggle}
                        >
                            <IconGearFill side_length="14" />
                            <span>設定</span>
                        </NavLink>
                    </div>
                </div>
                <div
                    className={
                        styles.small_screen_active_background +
                        (this.props.is_active_in_short_screen
                            ? " " + styles.active
                            : "")
                    }
                    onClick={this.toggle}
                ></div>
            </>
        );
    }
    private toggle = (): void => {
        this.props.toggle();
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
