import styles from "./ExternalApps.module.scss";
import simulator_icon from "../../../assets/simulator_icon.png";
import simulator_pro_icon from "../../../assets/simulator_pro_icon.png";

import React from "react";
import { Link } from "react-router-dom";

import { RouterInterface, withRouter } from "../../../router";

interface Props extends RouterInterface {}

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
                <h2>外部應用程式</h2>
                <div className={styles.app_list}>
                    <Link className={styles.app} to={`/investment/simulator`}>
                        <img src={simulator_icon} alt="" />
                        <span className={styles.app_name}>Simulator</span>
                    </Link>
                    <Link
                        className={styles.app}
                        to={`/investment/simulator-pro`}
                    >
                        <img src={simulator_pro_icon} alt="" />
                        <span className={styles.app_name}>SimuPro</span>
                    </Link>
                </div>
            </div>
        );
    }
}

export default withRouter(ExternalApps);
