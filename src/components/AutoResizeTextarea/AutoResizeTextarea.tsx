import styles from "./AutoResizeTextarea.module.scss";

import React, { ChangeEventHandler } from "react";

interface Props {
    value: string;
    placeholder?: string;
    auto_focus?: boolean;
    onChange?: ChangeEventHandler;
}

interface State {}

export default class AutoResizeTextarea extends React.Component<Props, State> {
    public state: State;
    private textarea_ref: React.RefObject<HTMLTextAreaElement>;
    public constructor(props: Props) {
        super(props);
        this.state = {};
        this.textarea_ref = React.createRef();
    }
    public componentDidMount(): void {
        this.textarea_ref.current!.style.height = "32px";
        this.textarea_ref.current!.style.height =
            this.textarea_ref.current!.scrollHeight + "px";
        if (this.props.auto_focus) {
            let input = this.textarea_ref.current!;
            input.setSelectionRange(input.value.length, input.value.length);
            input.focus();
        }
    }
    public componentDidUpdate(): void {
        this.textarea_ref.current!.style.height = "32px";
        this.textarea_ref.current!.style.height =
            this.textarea_ref.current!.scrollHeight + "px";
    }
    public render(): React.ReactNode {
        return (
            <textarea
                className={styles.main}
                value={this.props.value}
                onChange={this.props.onChange || (() => {})}
                placeholder={this.props.placeholder}
                ref={this.textarea_ref}
            />
        );
    }
}
