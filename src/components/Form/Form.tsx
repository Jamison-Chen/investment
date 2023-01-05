import styles from "./Form.module.scss";

import React from "react";

interface Props {
    header_img?: React.ReactElement<HTMLImageElement>;
    header_content?: React.ReactNode;
    children: any;
    footer_buttons: React.ReactElement;
}

interface State {}

export default class SignUpForm extends React.Component<Props, State> {
    public state: State;
    public constructor(props: Props) {
        super(props);
        this.state = {};
    }
    public render(): React.ReactNode {
        return (
            <div className={styles.main}>
                {!this.props.header_img && !this.props.header_content ? null : (
                    <div className={styles.header}>
                        {this.props.header_img}
                        {this.props.header_content || null}
                    </div>
                )}
                <div className={styles.body}>{this.props.children}</div>
                <div className={styles.footer}>{this.props.footer_buttons}</div>
            </div>
        );
    }
}
