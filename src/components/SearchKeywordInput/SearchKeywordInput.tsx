import styles from "./SearchKeywordInput.module.scss";

import React, { ChangeEvent } from "react";
import IconSearch from "../Icons/IconSearch";

interface PropsInterface {
    placeholder: string;
    name: string;
    keyword: string;
    onChange?: (name: string, value: string) => void;
}

interface StateInterface {}

export default class SearchKeywordInput extends React.Component<
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
