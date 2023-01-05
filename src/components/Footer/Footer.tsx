import styles from "./Footer.module.scss";

import React from "react";
import { NavLink } from "react-router-dom";

interface Props {
    subpage_list: {
        tab_icon: any;
        tab_name: string;
        path: string;
    }[];
}

interface State {}

export default class Footer extends React.Component<Props, State> {
    public state: State;
    public constructor(props: Props) {
        super(props);
        this.state = {};
    }
    public render(): React.ReactNode {
        return (
            <div className={styles.main}>
                {this.props.subpage_list.map((subpage, idx) => {
                    return (
                        <NavLink
                            to={subpage.path}
                            key={idx}
                            className={({ isActive }) => {
                                let className: string = styles.icon_outer + " ";
                                className += isActive
                                    ? styles.active
                                    : undefined;
                                return className;
                            }}
                        >
                            {subpage.tab_icon}
                        </NavLink>
                    );
                })}
            </div>
        );
    }
}
