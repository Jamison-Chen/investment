import styles from "./Modal.module.scss";

import React, { MouseEvent } from "react";
import ReactDOM from "react-dom";

import { IconXLarge } from "../../icons";
import { RoundButton } from "../../components";

interface Props {
    header_title?: React.ReactNode;
    description?: string;
    children?: React.ReactNode;
    footer?: React.ReactNode;
    hide_modal: Function;
    silent_background?: boolean;
    no_x?: boolean;
}

interface State {}

export default class Modal extends React.Component<Props, State> {
    public state: State;
    private modal_root: HTMLElement;
    public constructor(props: Props) {
        super(props);
        this.state = {};
        this.modal_root = document.getElementById("modal-root")!;
    }
    public componentDidMount(): void {}
    public render(): React.ReactNode {
        return ReactDOM.createPortal(
            <div
                className={styles.background}
                onClick={this.handle_click_background}
            >
                <div
                    className={styles.main}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className={styles.header}>
                        {this.props.header_title ? (
                            <div className={styles.header_title}>
                                {this.props.header_title}
                            </div>
                        ) : null}
                        {this.props.no_x ? null : (
                            <RoundButton onClick={this.hide_modal}>
                                <IconXLarge side_length="20" />
                            </RoundButton>
                        )}
                    </div>
                    <div className={styles.body}>
                        {this.props.description ? (
                            <div className={styles.description}>
                                {this.props.description}
                            </div>
                        ) : null}
                        {this.props.children}
                    </div>
                    {this.props.footer ? (
                        <div className={styles.footer}>{this.props.footer}</div>
                    ) : (
                        <div className={styles.fake_footer}></div>
                    )}
                </div>
            </div>,
            this.modal_root
        );
    }
    private hide_modal = (): void => {
        this.props.hide_modal();
    };
    private handle_click_background = (e: MouseEvent): void => {
        e.stopPropagation();
        if (!this.props.silent_background) this.props.hide_modal();
    };
}
