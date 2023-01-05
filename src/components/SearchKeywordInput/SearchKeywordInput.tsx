import styles from "./SearchKeywordInput.module.scss";

import React, { ChangeEvent } from "react";

import { IconSearch } from "../../icons";

interface Props {
    placeholder: string;
    name: string;
    keyword: string;
    onChange?: (name: string, value: string) => void;
}

interface State {}

export default class SearchKeywordInput extends React.Component<Props, State> {
    public state: State;
    public constructor(props: Props) {
        super(props);
        this.state = {};
    }
    public render(): React.ReactNode {
        return (
            <div className={styles.main}>
                <IconSearch side_length="14px" />
                <input
                    type="text"
                    placeholder={this.props.placeholder}
                    value={this.props.keyword || ""}
                    onChange={this.handle_input_change}
                />
            </div>
        );
    }
    private handle_input_change = (e: ChangeEvent): void => {
        if (this.props.onChange) {
            this.props.onChange(
                this.props.name,
                (e.target as HTMLInputElement).value
            );
        }
    };
}
