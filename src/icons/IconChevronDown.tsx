import React from "react";

interface Props {
    side_length?: string;
    color?: string;
}

interface State {}

export default class IconChevronDown extends React.Component<Props, State> {
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
                className="bi bi-chevron-down"
                viewBox="0 0 16 16"
            >
                <path
                    fillRule="evenodd"
                    d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"
                />
            </svg>
        );
    }
}
