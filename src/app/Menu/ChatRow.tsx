import { FC } from "react";
import { NavLink } from "react-router-dom";
import { observer } from "mobx-react-lite";

import { Grid } from "@geist-ui/react";

import { Chat } from "../../store/ChatsStore";
import UserCard from "../../components/UserCard";
import { useFileStore } from "../../store/FileStore";

import styles from "./ChatRow.module.css";

interface ChatRowProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
    chat: Chat;
}

const ChatRow: FC<ChatRowProps> = ({ chat, ...other }) => {
    const photo = useFileStore(chat.info?.photo?.small);

    return (
        <NavLink to={`/conversation/${chat.info?.id}`} {...other}>
            <Grid.Container className={styles.chat} alignItems="center" height="100%" width="100%">
                <UserCard src={photo?.base64} name={chat.info?.title} />
            </Grid.Container>
        </NavLink>
    );
};

export default observer(ChatRow);
