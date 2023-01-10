import React from "react";

interface Props {
    side_length?: string;
    color?: string;
}

interface State {}

export default class IconArrowLeft extends React.Component<Props, State> {
    public state: State;

    public constructor(props: Props) {
        super(props);
        this.state = {};
    }

    public render(): React.ReactNode {
        return (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width={this.props.side_length || "16"}
                height={this.props.side_length || "16"}
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
