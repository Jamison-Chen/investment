import styles from "./Detail.module.scss";

import React from "react";
import {
    Location,
    NavigateFunction,
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

class Detail extends React.Component<PropsInterface, StateInterface> {
    public state: StateInterface;
    public constructor(props: PropsInterface) {
        super(props);
        this.state = {};
    }
    public async componentDidMount(): Promise<void> {}
    public render(): React.ReactNode {
        return <div className={styles.main}></div>;
    }
}

export default function ComponentWithRouterProp(
    props: any = {}
): React.ReactElement {
    let location = useLocation();
    let navigate = useNavigate();
    let params = useParams();
    return <Detail {...props} router={{ location, navigate, params }} />;
}