import styles from "./ErrorList.module.scss";

import React from "react";
import ReactDOM from "react-dom";
import { connect } from "react-redux";

import IconXLarge from "../Icons/IconXLarge";
import RoundButton from "../RoundButton/RoundButton";
import { RootState, AppDispatch } from "../../redux/store";
import { remove_error } from "../../redux/slices/ErrorSlice";

function mapStateToProps(root_state: RootState) {
    let error_list = root_state.error.error_list;
    return { error_list };
}

interface PropsInterface extends ReturnType<typeof mapStateToProps> {
    dispatch: AppDispatch;
}

interface StateInterface {}

class ErrorList extends React.Component<PropsInterface, StateInterface> {
    public state: StateInterface;
    private error_root: HTMLElement;
    public constructor(props: PropsInterface) {
        super(props);
        this.state = {};
        this.error_root = document.getElementById("error-root")!;
    }
    public componentDidMount(): void {}
    public render(): React.ReactNode {
        return ReactDOM.createPortal(
            <div className={styles.main}>
                {this.props.error_list.map((each, idx) => {
                    return (
                        <div key={idx} className={styles.box}>
                            {each.message}
                            <RoundButton
                                onClick={() =>
                                    this.handle_click_remove_message(idx)
                                }
                            >
                                <IconXLarge side_length="10" color="#FFF" />
                            </RoundButton>
                        </div>
                    );
                })}
            </div>,
            this.error_root
        );
    }
    private handle_click_remove_message = (idx: number): void => {
        this.props.dispatch(remove_error(idx));
    };
}

export default connect(mapStateToProps)(ErrorList);
