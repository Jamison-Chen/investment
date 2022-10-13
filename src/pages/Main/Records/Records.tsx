import styles from "./Records.module.scss";

import React from "react";
import { connect } from "react-redux";

import StretchableButton from "../../../components/StretchableButton/StretchableButton";
import { RouterInterface, withRouter } from "../../../router";
import { RootState } from "../../../redux/store";
import Button from "../../../components/Button/Button";
import SearchKeywordInput from "../../../components/SearchKeywordInput/SearchKeywordInput";

function mapStateToProps(root_state: RootState) {
    let trade_record_list = root_state.trade_record.record_list;
    let cash_dividend_record_list = root_state.cash_dividend.record_list;
    return { trade_record_list, cash_dividend_record_list };
}

interface PropsInterface
    extends RouterInterface,
        ReturnType<typeof mapStateToProps> {}

interface StateInterface {
    active_subpage_name: "trade" | "cash_dividend";
    search_keyword: string | null;
}

class Records extends React.Component<PropsInterface, StateInterface> {
    public state: StateInterface;
    public constructor(props: PropsInterface) {
        super(props);
        this.state = {
            active_subpage_name: "trade",
            search_keyword: null,
        };
    }
    public async componentDidMount(): Promise<void> {}
    public render(): React.ReactNode {
        return (
            <div className={styles.main}>
                <div className={styles.background}></div>
                <div className={styles.switch_button_container}>
                    <Button
                        className={this.get_switch_button_class("trade")}
                        onClick={() => {
                            this.setState({ active_subpage_name: "trade" });
                        }}
                    >
                        交易紀錄
                    </Button>
                    <hr />
                    <Button
                        className={this.get_switch_button_class(
                            "cash_dividend"
                        )}
                        onClick={() => {
                            this.setState({
                                active_subpage_name: "cash_dividend",
                            });
                        }}
                    >
                        現金股利
                    </Button>
                </div>
                <SearchKeywordInput
                    placeholder="輸入證券代號或名稱以篩選"
                    name="search_keyword"
                    keyword={this.state.search_keyword || ""}
                    onChange={this.handle_input_change}
                />
                <StretchableButton />
            </div>
        );
    }
    private get_switch_button_class(name: "trade" | "cash_dividend"): string {
        if (this.state.active_subpage_name === name) return "white";
        return "transparent";
    }
    private handle_input_change = (name: string, value: string): void => {
        if (name in this.state) this.setState({ [name]: value } as any);
    };
}

export default connect(mapStateToProps)(withRouter(Records));
