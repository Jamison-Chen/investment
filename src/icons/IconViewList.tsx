import React from "react";

interface Props {
    side_length?: string;
    color?: string;
}

interface State {}

export default class IconViewList extends React.Component<Props, State> {
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
                className="bi bi-view-list"
                viewBox="0 0 16 16"
            >
                <path d="M3 4.5h10a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2zm0 1a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-3a1 1 0 0 0-1-1H3zM1 2a.5.5 0 0 1 .5-.5h13a.5.5 0 0 1 0 1h-13A.5.5 0 0 1 1 2zm0 12a.5.5 0 0 1 .5-.5h13a.5.5 0 0 1 0 1h-13A.5.5 0 0 1 1 14z" />
            </svg>
        );
    }
}
