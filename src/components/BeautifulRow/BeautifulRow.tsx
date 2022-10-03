import styles from "./BeautifulRow.module.scss";

import React, { MouseEventHandler } from "react";

import IconChevronRight from "../Icons/IconChevronRight";

interface PropsInterface {
    label: string;
    value: any;
    onClick?: MouseEventHandler;
}

interface StateInterface {}

export default class BeautifulRow extends React.Component<
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
                className={this.block_class_name}
                onClick={this.props.onClick || (() => {})}
            >
                <div className={styles.label}>{this.props.label}</div>
                <div className={styles.value}>
                    {typeof this.props.value === "string"
                        ? this.string_to_jsx(this.props.value)
                        : this.props.value}
                </div>
                {this.props.onClick ? (
                    <div className={styles.tail_mark}>
                        <IconChevronRight side_length="16" />
                    </div>
                ) : null}
            </div>
        );
    }
    private get block_class_name(): string {
        return styles.row + (this.props.onClick ? " " + styles.reactive : "");
    }
    private string_to_jsx(s: string): React.ReactNode {
        let string_list: string[] = s.split("\n");
        return string_list.map((each, idx) => {
            return (
                <React.Fragment key={idx}>
                    <div className={styles.s}>{each || " "}</div>
                </React.Fragment>
            );
        });
    }
}
