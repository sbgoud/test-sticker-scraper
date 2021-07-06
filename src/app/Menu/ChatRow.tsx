import { FC } from "react";
import { NavLink } from "react-router-dom";
import { observer } from "mobx-react-lite";

import { Grid } from "@geist-ui/react";

import { Chat } from "../../store/ChatsStore";
import UserCard from "../../components/UserCard";
import { useFileStore } from "../../store/FileStore";

import { ListChildComponentProps } from "react-window";

import styles from "./ChatRow.module.css";

const ChatRow: FC<ListChildComponentProps<Chat[]>> = ({ data, index, style }) => {
    const chat = data[index];

    const photo = useFileStore(chat.info?.photo?.small);

    return (
        <NavLink key={index} to={`/conversation/${chat.info?.id}`} style={style}>
            <Grid.Container className={styles.chat} alignItems="center" height="100%" width="100%">
                <UserCard src={photo?.base64} name={chat.info?.title} />
            </Grid.Container>
        </NavLink>
    );
};

export default observer(ChatRow);
