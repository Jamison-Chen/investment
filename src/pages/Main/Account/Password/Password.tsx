import styles from "./Password.module.scss";

import React from "react";
import {
    Location,
    NavigateFunction,
    Params,
    useLocation,
    useNavigate,
    useParams,
    useSearchParams,
} from "react-router-dom";

import Utils from "../../../../util";
import Form from "../../../../components/Form/Form";
import RoundButton from "../../../../components/RoundButton/RoundButton";
import IconArrowLeft from "../../../../components/Icons/IconArrowLeft";
import Button from "../../../../components/Button/Button";
import LabeledInput from "../../../../components/LabeledInput/LabeledInput";

interface PropsInterface {
    router: {
        location: Location;
        params: Params;
        navigate: NavigateFunction;
        search_params: URLSearchParams;
        set_search_params: ReturnType<typeof useSearchParams>;
    };
}

interface StateInterface {
    id: string;
    old_password: string;
    new_password: string;
}

class Password extends React.Component<PropsInterface, StateInterface> {
    public state: StateInterface;
    public constructor(props: PropsInterface) {
        super(props);
        this.state = { id: "", old_password: "", new_password: "" };
    }
    public async componentDidMount(): Promise<void> {
        let response: any = await Utils.check_login();
        if (response && response.success) {
            this.setState({ id: response.data.id });
        }
    }
    public render(): React.ReactNode {
        return (
            <div className={styles.main}>
                <Form
                    header_content={
                        <div className={styles.header}>
                            <RoundButton
                                className="p-8"
                                onClick={() =>
                                    this.props.router.navigate(
                                        "/investment/account"
                                    )
                                }
                            >
                                <IconArrowLeft side_length="20" />
                            </RoundButton>
                            <h1>更新密碼</h1>
                        </div>
                    }
                    footer_buttons={
                        <>
                            <Button
                                onClick={() =>
                                    this.props.router.navigate(
                                        "/investment/account"
                                    )
                                }
                                className="light border"
                            >
                                捨棄
                            </Button>
                            <Button
                                onClick={this.handle_click_save_button}
                                className="primary_fill"
                            >
                                更改密碼
                            </Button>
                        </>
                    }
                >
                    <LabeledInput
                        title="原密碼"
                        name="old_password"
                        type="password"
                        value={this.state.old_password}
                        onChange={this.hadle_input_change}
                    />
                    <LabeledInput
                        title="新密碼"
                        name="new_password"
                        type="password"
                        value={this.state.new_password}
                        onChange={this.hadle_input_change}
                    />
                </Form>
            </div>
        );
    }
    private hadle_input_change = (name: string, value: string): void => {
        if (name in this.state) this.setState({ [name]: value } as any);
    };
    private handle_click_save_button = async (): Promise<void> => {
        let request_body = new URLSearchParams();
        request_body.append("id", this.state.id);
        request_body.append("old_password", this.state.old_password);
        request_body.append("new_password", this.state.new_password);
        let response = await Utils.send_request(
            "account/update",
            "post",
            request_body
        );
        if (response && response.success) {
            this.props.router.navigate("/investment/account");
        }
    };
}

export default function ComponentWithRouterProp(
    props: any = {}
): React.ReactElement {
    let location = useLocation();
    let navigate = useNavigate();
    let params = useParams();
    let [search_params, set_search_params] = useSearchParams();
    return (
        <Password
            {...props}
            router={{
                location,
                navigate,
                params,
                search_params,
                set_search_params,
            }}
        />
    );
}
