import styles from "./Header.module.scss";

import React from "react";

import RoundButton from "../RoundButton/RoundButton";
import FullLogo from "../FullLogo/FullLogo";

interface PropsInterface {
    avatar_url: string;
    handle_click_list_button: Function;
}

interface StateInterface {}

export default class Header extends React.Component<
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
