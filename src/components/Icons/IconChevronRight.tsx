import React from "react";

interface PropsInterface {
    side_length: string;
    color?: string;
}

interface StateInterface {
    [key: string]: any;
}

export default class IconChevronRight extends React.Component<
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
                className="bi bi-chevron-right"
                viewBox="0 0 16 16"
            >
                <path
                    fillRule="evenodd"
                    d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"
                />
            </svg>
        );
    }
}
