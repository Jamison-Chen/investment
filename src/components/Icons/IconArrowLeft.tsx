import React from "react";

interface PropsInterface {
    side_length: string;
    color?: string;
}

interface StateInterface {
    [key: string]: any;
}

export default class IconArrowLeft extends React.Component<
    PropsInterface,
    StateInterface
> {
    public state: StateInterface;

    public constructor(props: PropsInterface) {
        super(props);
        this.state = {};
    }

    public render(): React.ReactNode {
        return (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width={this.props.side_length}
                height={this.props.side_length}
                fill={this.props.color || "currentColor"}
                className="bi bi-arrow-left"
                viewBox="0 0 16 16"
            >
                <path
                    fillRule="evenodd"
                    d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"
                />
            </svg>
        );
    }
}
