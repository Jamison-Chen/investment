import styles from "./StockList.module.scss";

import React from "react";
import { connect } from "react-redux";

import { IRouter, withRouter } from "../../../router";
import type { RootState } from "../../../redux/store";
import {
    get_inventory_map,
    get_sid_trade_records_map,
} from "../../../redux/slices/TradeRecordSlice";
import { ColorBackground, DetailCard } from "../../../components";

function mapStateToProps(root_state: RootState) {
    let trade_record_list = root_state.trade_record.record_list;
    let sid_trade_records_map = get_sid_trade_records_map(trade_record_list);
    let inventory_map = get_inventory_map(sid_trade_records_map);
    return {
        inventory_map,
    };
}

interface Props extends IRouter, ReturnType<typeof mapStateToProps> {}

interface State {}

class StockList extends React.Component<Props, State> {
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
                <div className={styles.stock_list}>
                    {Object.keys(this.props.inventory_map).map((sid, idx) => {
                        return (
                            <DetailCard
                                key={idx}
                                sid={sid}
                                onClick={this.handle_click_card}
                            />
                        );
                    })}
                </div>
            </div>
        );
    }
    private handle_click_card = (sid: string) => {
        this.props.router.navigate(`/investment/stock-list/${sid}`);
    };
}

export default connect(mapStateToProps)(withRouter(StockList));
