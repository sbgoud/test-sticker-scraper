import { Grid } from "@geist-ui/react";
import cx from "classnames";
import { FC, memo } from "react";
import { NavLink } from "react-router-dom";
import { UserCard } from "../../components";
import { Chat } from "../../store/ChatsStore";
import { useFileStore } from "../../store/FileStore";
import styles from "./ChatRow.module.css";

interface ChatRowProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
    chat: Chat;
}

const ChatRow: FC<ChatRowProps> = ({ chat, className, ...other }) => {
    const photo = useFileStore(chat.info?.photo?.small, "base64");

    return (
        <NavLink
            to={`/conversation/${chat.info?.id}`}
            className={cx(styles.chat, className)}
            activeClassName={styles["active_chat"]}
            {...other}
        >
            <Grid.Container className={styles.container} alignItems="center" height="100%" width="100%">
                <UserCard src={photo} name={chat.info?.title} />
            </Grid.Container>
        </NavLink>
    );
};

export default memo(ChatRow);
