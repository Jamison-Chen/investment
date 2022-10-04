import React from "react";

interface PropsInterface {
    side_length: string;
    color?: string;
}

interface StateInterface {
    [key: string]: any;
}

export default class IconFileTextFill extends React.Component<
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
                className="bi bi-file-text-fill"
                viewBox="0 0 16 16"
            >
                <path d="M12 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zM5 4h6a.5.5 0 0 1 0 1H5a.5.5 0 0 1 0-1zm-.5 2.5A.5.5 0 0 1 5 6h6a.5.5 0 0 1 0 1H5a.5.5 0 0 1-.5-.5zM5 8h6a.5.5 0 0 1 0 1H5a.5.5 0 0 1 0-1zm0 2h3a.5.5 0 0 1 0 1H5a.5.5 0 0 1 0-1z" />
            </svg>
        );
    }
}
