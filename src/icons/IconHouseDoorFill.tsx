import React from "react";

interface Props {
    side_length: string;
    color?: string;
}

interface State {
    [key: string]: any;
}

export default class IconHouseDoorFill extends React.Component<Props, State> {
    public state: State;

    public constructor(props: Props) {
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
                className="bi bi-house-door-fill"
                viewBox="0 0 16 16"
            >
                <path d="M6.5 14.5v-3.505c0-.245.25-.495.5-.495h2c.25 0 .5.25.5.5v3.5a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.146-.354L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.354 1.146a.5.5 0 0 0-.708 0l-6 6A.5.5 0 0 0 1.5 7.5v7a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5z" />
            </svg>
        );
    }
}
