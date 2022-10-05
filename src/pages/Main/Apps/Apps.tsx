import styles from "./Apps.module.scss";
import simulator_icon from "../../../assets/simulator_icon.png";
import simulator_pro_icon from "../../../assets/simulator_pro_icon.png";

import React from "react";
import {
    Location,
    NavigateFunction,
    NavLink,
    Params,
    useLocation,
    useNavigate,
    useParams,
} from "react-router-dom";

interface PropsInterface {
    router: {
        location: Location;
        params: Params;
        navigate: NavigateFunction;
    };
}

interface StateInterface {}

class Apps extends React.Component<PropsInterface, StateInterface> {
    public state: StateInterface;
    public constructor(props: PropsInterface) {
        super(props);
        this.state = {};
    }
    public async componentDidMount(): Promise<void> {}
    public render(): React.ReactNode {
        return (
            <div className={styles.main}>
                <div className={styles.app_list}>
                    <NavLink
                        className={styles.app}
                        to={`/investment/simulator`}
                    >
                        <img src={simulator_icon} alt="" />
                        <span className={styles.app_name}>Simulator</span>
                    </NavLink>
                    <NavLink
                        className={styles.app}
                        to={`/investment/simulator-pro`}
                    >
                        <img src={simulator_pro_icon} alt="" />
                        <span className={styles.app_name}>SimuPro</span>
                    </NavLink>
                </div>
            </div>
        );
    }
}

export default function ComponentWithRouterProp(
    props: any = {}
): React.ReactElement {
    let location = useLocation();
    let navigate = useNavigate();
    let params = useParams();
    return <Apps {...props} router={{ location, navigate, params }} />;
}
