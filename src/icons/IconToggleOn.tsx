import React from "react";

interface Props {
    side_length?: string;
    color?: string;
}

interface State {}

export default class IconToggleOn extends React.Component<Props, State> {
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
                className="bi bi-toggle2-on"
                viewBox="0 0 16 16"
            >
                <path d="M7 5H3a3 3 0 0 0 0 6h4a4.995 4.995 0 0 1-.584-1H3a2 2 0 1 1 0-4h3.416c.156-.357.352-.692.584-1z" />
                <path d="M16 8A5 5 0 1 1 6 8a5 5 0 0 1 10 0z" />
            </svg>
        );
    }
}
