import styles from "./ErrorList.module.scss";

import React from "react";
import ReactDOM from "react-dom";
import { connect } from "react-redux";

import { IconXLarge } from "../../icons";
import { RoundButton } from "../../components";
import type { RootState, AppDispatch } from "../../redux/store";
import { remove_error } from "../../redux/slices/ErrorSlice";

function mapStateToProps(root_state: RootState) {
    let error_list = root_state.error.error_list;
    return { error_list };
}

interface Props extends ReturnType<typeof mapStateToProps> {
    dispatch: AppDispatch;
}

interface State {
    timer: NodeJS.Timer | null;
}

class ErrorList extends React.Component<Props, State> {
    public state: State;
    private error_root: HTMLElement;
    public constructor(props: Props) {
        super(props);
        this.state = {
            timer: null,
        };
        this.error_root = document.getElementById("error-root")!;
    }
    public componentDidMount(): void {
        this.setState((state, props) => {
            return {
                timer: setInterval(
                    () => props.dispatch(remove_error(0)),
                    10000
                ),
            };
        });
    }
    public componentWillUnmount(): void {
        clearInterval(this.state.timer!);
        this.setState({ timer: null });
    }
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
