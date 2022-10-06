import styles from "./FullLogo.module.scss";
import logo from "../../assets/logo.png";

import React from "react";

interface PropsInterface {
    size: "s" | "m" | "l";
}

interface StateInterface {}

export default class FullLogo extends React.Component<
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
            <div className={this.class_name}>
                <img className={styles.logo} src={logo} alt="" />
                <div className={styles.product_name}>TradeSmartly</div>
            </div>
        );
    }
    private get class_name(): string {
        return (
            styles.main +
            " " +
            (this.props.size === "s"
                ? styles.s
                : this.props.size === "m"
                ? styles.m
                : styles.l)
        );
    }
}
