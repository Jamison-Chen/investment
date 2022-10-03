import styles from "./RoundButton.module.scss";
import "./RoundButton.scss";

import React, { MouseEventHandler } from "react";

interface PropsInterface {
    children: any;
    onClick?: MouseEventHandler;
    className?: string;
    disabled?: boolean;
    hint_text?: string;
}

interface StateInterface {}

export default class RoundButton extends React.Component<
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
                    styles.main +
                    (this.props.disabled ? " " + styles.disabled : "") +
                    (this.props.className
                        ? " round_button " + this.props.className
                        : "")
                }
                onClick={
                    this.props.disabled
                        ? () => {}
                        : this.props.onClick || (() => {})
                }
            >
                {this.props.children}
                {this.props.hint_text ? (
                    <div className={styles.hint_text}>
                        {this.props.hint_text}
                    </div>
                ) : null}
            </div>
        );
    }
}
