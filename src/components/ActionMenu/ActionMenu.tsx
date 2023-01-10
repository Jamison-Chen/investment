import styles from "./ActionMenu.module.scss";

import React, { MouseEvent } from "react";
import ReactDOM from "react-dom";

interface Props {
    children?: React.ReactNode;
    hide_modal: Function;
}

interface State {}

export default class ActionMenu extends React.Component<Props, State> {
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
                    <div className={styles.header} />
                    <div className={styles.body}>{this.props.children}</div>
                </div>
            </div>,
            this.modal_root
        );
    }
    private handle_click_background = (e: MouseEvent): void => {
        e.stopPropagation();
        this.props.hide_modal();
    };
}
