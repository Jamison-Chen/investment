import styles from "./Header.module.scss";

import React from "react";

import { RoundButton, FullLogo } from "../../components";

interface Props {
    avatar_url: string;
    handle_click_list_button: Function;
}

interface State {}

export default class Header extends React.Component<Props, State> {
    public state: State;
    public constructor(props: Props) {
        super(props);
        this.state = {};
    }
    public render(): React.ReactNode {
        return (
            <header className={styles.main}>
                <div className={styles.header_inner}>
                    <FullLogo size="s" />
                    <RoundButton onClick={this.handle_click_user_avatar}>
                        <img
                            src={this.props.avatar_url}
                            alt=""
                            className={styles.user_avatar}
                        />
                    </RoundButton>
                </div>
            </header>
        );
    }
    private handle_click_user_avatar = (): void => {
        this.props.handle_click_list_button();
    };
}
