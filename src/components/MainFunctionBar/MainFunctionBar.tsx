import styles from "./MainFunctionBar.module.scss";

import React, { ReactElement } from "react";
import { NavLink } from "react-router-dom";

import Utils from "../../util";
import IconGearFill from "../Icons/IconGearFill";
import Modal from "../Modal/Modal";
import Button from "../Button/Button";

interface PropsInterface {
    user_avatar_url: string;
    username: string;
    children: React.ReactNode[];
    is_active_in_short_screen: boolean;
    hide: () => void;
}

interface StateInterface {
    active_modal_name: "check_logout" | null;
}

export default class MainFunctionBar extends React.Component<
    PropsInterface,
    StateInterface
> {
    public state: StateInterface;
    public constructor(props: PropsInterface) {
        super(props);
        this.state = {
            active_modal_name: null,
        };
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
                    {this.active_modal}
                    <NavLink to="/investment/account" onClick={this.props.hide}>
                        <div className={styles.user_info}>
                            <img src={this.props.user_avatar_url} alt="" />
                            <div className={styles.middle}>
                                <div className={styles.username}>
                                    {this.props.username}
                                </div>
                                <div className={styles.hint}>查看個人資料</div>
                            </div>
                        </div>
                    </NavLink>
                    {this.props.children}
                    <div className={styles.lower}>
                        <div
                            className={styles.logout_button}
                            onClick={this.handle_click_logout_button}
                        >
                            登出
                        </div>
                        <NavLink
                            to={"/investment/setting"}
                            className={styles.setting}
                            onClick={this.props.hide}
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
                    onClick={this.props.hide}
                ></div>
            </>
        );
    }
    private get active_modal(): ReactElement<Modal> | null {
        if (this.state.active_modal_name === "check_logout") {
            return (
                <Modal
                    header_title="登出"
                    hide_modal={this.hide_modal}
                    no_x
                    footer={
                        <>
                            <Button
                                className="light l"
                                onClick={this.hide_modal}
                            >
                                取消
                            </Button>
                            <Button
                                className="primary_fill l"
                                onClick={this.handle_click_check_logout}
                            >
                                登出
                            </Button>
                        </>
                    }
                >
                    <div className={styles.modal_inner}>
                        您確定要登出此帳號嗎？
                    </div>
                </Modal>
            );
        }
        return null;
    }
    private hide_modal = (): void => {
        this.setState({ active_modal_name: null });
    };
    private handle_click_logout_button = (): void => {
        this.props.hide();
        this.setState({ active_modal_name: "check_logout" });
    };
    private handle_click_check_logout = async (): Promise<void> => {
        let response: any = await Utils.send_request(
            "account/logout",
            "post",
            new URLSearchParams()
        );
        if (response?.success) Utils.go_to_login_page();
        else throw Error("Failed to sign out.");
    };
}
