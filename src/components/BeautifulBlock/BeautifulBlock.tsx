import styles from "./BeautifulBlock.module.scss";

import React from "react";

interface PropsInterface {
    title?: string;
    description?: string;
    children: any;
}

interface StateInterface {}

export default class BeautifulBlock extends React.Component<
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
            <div className={styles.block}>
                {this.props.title ? (
                    <h2 className={styles.title}>{this.props.title}</h2>
                ) : null}
                {this.props.description ? (
                    <div className={styles.description}>
                        {this.props.description}
                    </div>
                ) : null}
                {this.props.children}
            </div>
        );
    }
}
