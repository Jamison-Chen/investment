import styles from "./ExternalApps.module.scss";
import simulator_icon from "../../../assets/simulator_icon.png";
import simulator_pro_icon from "../../../assets/simulator_pro_icon.png";

import React from "react";
import { Link } from "react-router-dom";

import { IRouter, withRouter } from "../../../router";
import { ColorBackground } from "../../../components";

interface Props extends IRouter {}

interface State {}

class ExternalApps extends React.Component<Props, State> {
    public state: State;
    public constructor(props: Props) {
        super(props);
        this.state = {};
    }
    public async componentDidMount(): Promise<void> {}
    public render(): React.ReactNode {
        return (
            <div className={styles.main}>
                <ColorBackground />
                <h2>外部應用程式</h2>
                <div className={styles.app_list}>
                    <a
                        className={styles.app}
                        href="https://jamison-chen.github.io/stock-simulator/basic/"
                        target="_blank"
                        rel="noreferrer"
                    >
                        <div className={styles.image_container}>
                            <img src={simulator_icon} alt="" />
                        </div>
                        <span className={styles.app_name}>Simulator</span>
                    </a>
                    <a
                        className={styles.app}
                        href="https://jamison-chen.github.io/stock-simulator/pro/"
                        target="_blank"
                        rel="noreferrer"
                    >
                        <div className={styles.image_container}>
                            <img src={simulator_pro_icon} alt="" />
                        </div>
                        <span className={styles.app_name}>SimuPro</span>
                    </a>
                </div>
            </div>
        );
    }
}

export default withRouter(ExternalApps);
