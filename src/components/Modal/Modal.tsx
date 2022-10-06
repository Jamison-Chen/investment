import styles from "./Modal.module.scss";

import React, { MouseEvent } from "react";
import ReactDOM from "react-dom";

import IconXLarge from "../Icons/IconXLarge";
import RoundButton from "../RoundButton/RoundButton";

interface PropsInterface {
    header_title?: React.ReactNode;
    description?: string;
    children?: React.ReactNode;
    footer?: React.ReactNode;
    hide_modal: Function;
    silent_background?: boolean;
}

interface StateInterface {}

export default class Modal extends React.Component<
    PropsInterface,
    StateInterface
> {
    public state: StateInterface;
    private modal_root: HTMLElement;
    public constructor(props: PropsInterface) {
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
                        <RoundButton onClick={this.hide_modal}>
                            <IconXLarge side_length="20" />
                        </RoundButton>
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
