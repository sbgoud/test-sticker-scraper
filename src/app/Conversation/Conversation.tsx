import { FC, useContext, useState, useEffect } from "react";
import { RouteComponentProps } from "react-router";
import { observer } from "mobx-react-lite";

import { Button, Grid, Text } from "@geist-ui/react";

import { CenterLayout, StoreContext, Toolbar, UserCard } from "../../components";
import StickerMessagesStore from "../../store/StickerMessagesStore";

import { FiArrowLeft } from "react-icons/fi";
import { useFileStore } from "../../store/FileStore";

interface Props extends RouteComponentProps<{ id: string }> {}

const Conversation: FC<Props> = ({ match }) => {
    const id = match.params.id;
    const chatId = parseInt(id);

    const rootStore = useContext(StoreContext);
    const { Chats } = rootStore;
    const [messages] = useState(() => new StickerMessagesStore(rootStore, chatId));

    const chat = messages.chat;
    const list = messages.messages;
    console.log(list?.length);
    const photo = useFileStore(chat?.photo?.small);

    useEffect(() => {
        if (Chats.chats.has(chatId)) {
            messages.load();
        }

        return () => {
            messages.dispose();
        };
    }, [Chats.chats, chatId, messages]);

    if (!id) {
        return (
            <CenterLayout>
                <Text type="secondary">Please choose a conversation </Text>
            </CenterLayout>
        );
    }

    return (
        <Grid.Container direction="column" justify="flex-start" alignItems="stretch">
            <Toolbar>
                <Grid sm md={0}>
                    <Button auto type="abort" iconRight={<FiArrowLeft />} />
                </Grid>
                <Grid xs>
                    <UserCard src={photo.base64} name={chat?.title} />
                </Grid>
            </Toolbar>
        </Grid.Container>
    );
};

export default observer(Conversation);
