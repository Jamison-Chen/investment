import styles from "./NotFound.module.scss";

import React from "react";

interface Props {}

interface State {}

export default class NotFound extends React.Component<Props, State> {
    public state: State;
    public constructor(props: Props) {
        super(props);
        this.state = {};
    }
    public componentDidMount(): void {}
    public render(): React.ReactNode {
        return <div className={styles.main}>Page Not Found</div>;
    }
}
