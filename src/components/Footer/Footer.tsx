import styles from "./Footer.module.scss";

import React from "react";
import { NavLink } from "react-router-dom";

interface PropsInterface {
    subpage_list: {
        tab_icon: any;
        tab_name: string;
        path: string;
    }[];
}

interface StateInterface {}

export default class Footer extends React.Component<
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
