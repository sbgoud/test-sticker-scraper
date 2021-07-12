import { FC, useContext, useState } from "react";
import { RouteComponentProps } from "react-router";

import { Text } from "@geist-ui/react";

import CenterLayout from "../../components/CenterLayout";
import StickerMessagesStore from "../../store/StickerMessagesStore";
import { StoreContext } from "../../components/StoreProvider";
import { useEffect } from "react";

interface Props extends RouteComponentProps<{ id: string }> {}

const Conversation: FC<Props> = ({ match }) => {
    const id = match.params.id;
    const chatId = parseInt(id);

    const rootStore = useContext(StoreContext);
    const { Chats } = rootStore;
    const [messages] = useState(() => new StickerMessagesStore(rootStore, chatId));

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

    return <>Conversation</>;
};

export default Conversation;
