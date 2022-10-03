import styles from "./LabeledInput.module.scss";

import React, { ChangeEvent } from "react";

interface PropsInterface {
    title: string;
    name: string | number;
    type?: "number" | "text" | "password" | "email" | "date" | "hidden";
    value: string;
    disabled?: boolean;
    onChange?: (name: any, value: string) => void;
}

interface StateInterface {}

export default class LabeledInput extends React.Component<
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
            <fieldset
                className={styles.main}
                disabled={this.props.disabled || false}
            >
                <legend>{this.props.title}</legend>
                <input
                    name={`${this.props.name}`}
                    type={this.props.type || "text"}
                    disabled={this.props.disabled || false}
                    value={this.props.value}
                    onChange={this.handle_input_change}
                    autoComplete="off"
                />
            </fieldset>
        );
    }
    private handle_input_change = (e: ChangeEvent<HTMLInputElement>) => {
        if (this.props.onChange) {
            this.props.onChange(this.props.name, e.target.value);
        }
    };
}
