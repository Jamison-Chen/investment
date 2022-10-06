import styles from "./Header.module.scss";
import person_fill from "../../assets/person-fill.svg";

import React from "react";

import RoundButton from "../RoundButton/RoundButton";
import FullLogo from "../FullLogo/FullLogo";

interface PropsInterface {
    avatar_url: string;
    username: string;
    handle_click_list_button: Function;
}

interface StateInterface {
    is_hidden_bar_active: boolean;
    is_app_dropdown_expanded: boolean;
    is_user_avatar_dropdown_expanded: boolean;
}

export default class Header extends React.Component<
    PropsInterface,
    StateInterface
> {
    public state: StateInterface;
    public constructor(props: PropsInterface) {
        super(props);
        this.state = {
            is_hidden_bar_active: false,
            is_app_dropdown_expanded: false,
            is_user_avatar_dropdown_expanded: false,
        };
    }
    public render(): React.ReactNode {
        return (
            <header className={styles.main}>
                <FullLogo size="s" />
                <RoundButton onClick={this.handle_click_user_avatar}>
                    <img
                        src={this.props.avatar_url || person_fill}
                        alt=""
                        className={styles.user_avatar}
                    />
                </RoundButton>
            </header>
        );
    }
    private handle_click_user_avatar = (): void => {
        this.props.handle_click_list_button();
    };
}
