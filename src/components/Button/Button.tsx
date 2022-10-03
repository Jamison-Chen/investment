import "./Button.scss";

import React, { MouseEventHandler } from "react";

interface PropsInterface {
    children: any;
    onClick?: MouseEventHandler;
    className: string;
    disabled?: boolean;
}

interface StateInterface {
    [key: string]: any;
}

export default class Button extends React.Component<
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
            <button
                className={`button ${this.props.className}`}
                onClick={this.props.onClick || (() => {})}
                disabled={this.props.disabled || false}
            >
                {this.props.children}
            </button>
        );
    }
}
