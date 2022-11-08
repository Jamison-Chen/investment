import styles from "./StockList.module.scss";

import React from "react";
import { connect } from "react-redux";

import { RouterInterface, withRouter } from "../../../router";
import { RootState } from "../../../redux/store";
import {
    get_inventory_map,
    get_sid_trade_records_map,
} from "../../../redux/slices/TradeRecordSlice";
import DetailCard from "../../../components/DetailCard/DetailCard";

function mapStateToProps(root_state: RootState) {
    let trade_record_list = root_state.trade_record.record_list;
    let sid_trade_records_map = get_sid_trade_records_map(trade_record_list);
    let inventory_map = get_inventory_map(sid_trade_records_map);
    return {
        inventory_map,
    };
}

interface PropsInterface
    extends RouterInterface,
        ReturnType<typeof mapStateToProps> {}

interface StateInterface {}

class StockList extends React.Component<PropsInterface, StateInterface> {
    public state: StateInterface;
    public constructor(props: PropsInterface) {
        super(props);
        this.state = {};
    }
    public async componentDidMount(): Promise<void> {}
    public render(): React.ReactNode {
        return (
            <div className={styles.main}>
                <div className={styles.background} />
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
        this.props.router.navigate(`/investment/details/${sid}`);
    };
}

export default connect(mapStateToProps)(withRouter(StockList));
