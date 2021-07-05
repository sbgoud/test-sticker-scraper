import { ComponentProps, FC } from "react";
import cx from "classnames";

import { User } from "@geist-ui/react";

import styles from "./UserCard.module.css";

const UserCard: FC<ComponentProps<typeof User>> = ({ className, ...other }) => (
    <User className={cx(styles.card, className)} {...other} />
);

export default UserCard;
