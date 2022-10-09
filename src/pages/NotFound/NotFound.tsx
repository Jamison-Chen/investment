import styles from "./NotFound.module.scss";

import React from "react";

interface PropsInterface {}

interface StateInterface {}

export default class NotFound extends React.Component<
    PropsInterface,
    StateInterface
> {
    public state: StateInterface;
    public constructor(props: PropsInterface) {
        super(props);
        this.state = {};
    }
    public componentDidMount(): void {}
    public render(): React.ReactNode {
        return <div className={styles.main}>Page Not Found</div>;
    }
}
