import styles from "./Details.module.scss";

import React from "react";
import { connect } from "react-redux";

import { RouterInterface, withRouter } from "../../../router";
import { RootState } from "../../../redux/store";
import { StockInfo } from "../../../redux/slices/StockInfoSlice";
import Button from "../../../components/Button/Button";

function mapStateToProps(root_state: RootState) {
    let stock_info_list: StockInfo[] = root_state.stock_info.info_list;
    return { stock_info_list };
}

interface PropsInterface
    extends RouterInterface,
        ReturnType<typeof mapStateToProps> {}

interface StateInterface {
    active_subpage_name: "stock_list" | "stock_details";
}

class Details extends React.Component<PropsInterface, StateInterface> {
    public state: StateInterface;
    public constructor(props: PropsInterface) {
        super(props);
        this.state = {
            active_subpage_name: "stock_list",
        };
    }
    public async componentDidMount(): Promise<void> {}
    public render(): React.ReactNode {
        return (
            <div className={styles.main}>
                <div className={styles.background} />
                <div className={styles.switch_button_container}>
                    <Button
                        className={this.get_switch_button_class("stock_list")}
                        onClick={() =>
                            this.handle_click_switch_button("stock_list")
                        }
                    >
                        持股列表
                    </Button>
                    <hr />
                    <Button
                        className={this.get_switch_button_class(
                            "stock_details"
                        )}
                        onClick={() =>
                            this.handle_click_switch_button("stock_details")
                        }
                    >
                        個股細節
                    </Button>
                </div>
                {this.active_subpage}
            </div>
        );
    }
    private get_switch_button_class(
        name: "stock_list" | "stock_details"
    ): string {
        if (this.state.active_subpage_name === name) return "white xs";
        return "transparent xs";
    }
    private handle_click_switch_button = (
        name: "stock_list" | "stock_details"
    ): void => {
        this.setState({ active_subpage_name: name });
    };
    private get active_subpage(): React.ReactNode {
        return null;
    }
}

export default connect(mapStateToProps)(withRouter(Details));
