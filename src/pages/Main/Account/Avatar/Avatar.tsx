import styles from "./Avatar.module.scss";

import React from "react";
import {
    Location,
    NavigateFunction,
    Params,
    URLSearchParamsInit,
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
        set_search_params: (
            nextInit: URLSearchParamsInit,
            navigateOptions?:
                | {
                      replace?: boolean | undefined;
                      state?: any;
                  }
                | undefined
        ) => void;
    };
}

interface StateInterface {
    id: string;
    avatar_url: string;
}

class Avatar extends React.Component<PropsInterface, StateInterface> {
    public state: StateInterface;
    public constructor(props: PropsInterface) {
        super(props);
        this.state = { id: "", avatar_url: "" };
    }
    public async componentDidMount(): Promise<void> {
        let response: any = await Utils.check_login();
        if (response && response.success) {
            this.setState({
                id: response.data.id,
                avatar_url: response.data.avatar_url,
            });
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
                            <h1>頭像</h1>
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
                                儲存
                            </Button>
                        </>
                    }
                >
                    <LabeledInput
                        title="頭像網址"
                        name="avatar_url"
                        type="text"
                        value={this.state.avatar_url || ""}
                        onChange={this.hadle_input_change}
                    />
                    {this.state.avatar_url ? (
                        <img
                            className={styles.avatar_preview}
                            src={this.state.avatar_url}
                            alt="圖片網址有誤"
                        />
                    ) : null}
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
        request_body.append("avatar_url", this.state.avatar_url);
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
        <Avatar
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
