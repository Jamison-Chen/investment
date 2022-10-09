import styles from "./Records.module.scss";

import React from "react";
import { connect } from "react-redux";

import StretchableButton from "../../../components/StretchableButton/StretchableButton";
import { RouterInterface, withRouter } from "../../../router";
import { RootState } from "../../../redux/store";

function mapStateToProps(root_state: RootState) {
    return {};
}

interface PropsInterface
    extends RouterInterface,
        ReturnType<typeof mapStateToProps> {}

interface StateInterface {}

class Records extends React.Component<PropsInterface, StateInterface> {
    public state: StateInterface;
    public constructor(props: PropsInterface) {
        super(props);
        this.state = {};
    }
    public async componentDidMount(): Promise<void> {}
    public render(): React.ReactNode {
        return (
            <div className={styles.main}>
                <StretchableButton />
            </div>
        );
    }
}

export default connect(mapStateToProps)(withRouter(Records));
