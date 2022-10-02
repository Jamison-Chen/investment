import styles from "./AppDropdown.module.scss";
import recorder_icon from "../../assets/recorder_icon.png";
import simulator_icon from "../../assets/simulator_icon.png";
import simulator_pro_icon from "../../assets/simulator_pro_icon.png";

import React from "react";
import { NavLink } from "react-router-dom";

interface PropsInterface {
    is_dropdown_expanded: boolean;
}

interface StateInterface {}

export default class AppDropdown extends React.Component<
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
                    <NavLink
                        className={this.get_app_class}
                        to={`/investment/recorder`}
                    >
                        <img src={recorder_icon} alt="" />
                        <span className={styles.app_name}>Recorder</span>
                    </NavLink>
                    <NavLink
                        className={this.get_app_class}
                        to={`/investment/simulator`}
                    >
                        <img src={simulator_icon} alt="" />
                        <span className={styles.app_name}>Simulator</span>
                    </NavLink>
                    <NavLink
                        className={this.get_app_class}
                        to={`/investment/simulator`}
                    >
                        <img src={simulator_pro_icon} alt="" />
                        <span className={styles.app_name}>SimulatorPro</span>
                    </NavLink>
                </div>
            </div>
        );
    }
    private get_app_class = ({ isActive }: any): string => {
        let className: string = styles.dropdown_option;
        className += isActive ? " " + styles.active : "";
        return className;
    };
}
