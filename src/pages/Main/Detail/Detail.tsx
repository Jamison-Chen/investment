import styles from "./Detail.module.scss";

import React from "react";
import { connect } from "react-redux";

import { RouterInterface, withRouter } from "../../../router";
import { RootState } from "../../../redux/store";

function mapStateToProps(root_state: RootState) {
    return {};
}

interface PropsInterface
    extends RouterInterface,
        ReturnType<typeof mapStateToProps> {}

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

export default connect(mapStateToProps)(withRouter(Detail));
