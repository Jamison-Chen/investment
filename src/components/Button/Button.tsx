import "./Button.scss";

import React, { MouseEventHandler } from "react";

interface Props {
    children: any;
    onClick?: MouseEventHandler;
    className: string;
    disabled?: boolean;
}

interface State {
    [key: string]: any;
}

export default class Button extends React.Component<Props, State> {
    public state: State;
    public constructor(props: Props) {
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
