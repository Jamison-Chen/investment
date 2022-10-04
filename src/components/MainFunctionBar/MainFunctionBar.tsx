import styles from "./MainFunctionBar.module.scss";
import IconGearFill from "../Icons/IconGearFill";

import React from "react";
import { NavLink } from "react-router-dom";

interface PropsInterface {
    children: React.ReactNode[];
    is_active_in_short_screen: boolean;
    toggle: Function;
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
                        styles.bar +
                        (this.props.is_active_in_short_screen
                            ? " " + styles.active
                            : "")
                    }
                >
                    {this.props.children}
                    <NavLink
                        to={"/investment/setting"}
                        className={styles.setting}
                        onClick={this.toggle}
                    >
                        <IconGearFill side_length="14" />
                        <span>設定</span>
                    </NavLink>
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
}
