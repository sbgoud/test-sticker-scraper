import { FC, HTMLProps } from "react";
import cx from "classnames";

import styles from "./CenterLayout.module.css";

export interface CenterLayoutProps extends HTMLProps<HTMLDivElement> {
    disablePadding?: boolean;
}

const CenterLayout: FC<CenterLayoutProps> = ({ className, disablePadding, ...other }) => {
    return <div className={cx(styles.root, { [styles.padding]: !disablePadding }, className)} {...other} />;
};

export default CenterLayout;
