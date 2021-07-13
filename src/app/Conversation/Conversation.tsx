import { FC, useContext, useState, useEffect, useRef, useCallback, CSSProperties } from "react";
import { RouteComponentProps } from "react-router";
import { observer } from "mobx-react-lite";
import { useVirtual } from "react-virtual";

import { Button, Grid, Loading, Text } from "@geist-ui/react";

import { CenterLayout, List, StoreContext, Toolbar, UserCard } from "../../components";
import StickerMessagesStore from "../../store/StickerMessagesStore";
import { useFileStore } from "../../store/FileStore";

import Message from "./Message";

import { FiArrowLeft } from "react-icons/fi";

import styles from "./Conversation.module.css";
import memoize from "fast-memoize";

const PLACEHOLDER_HEIGHT = 1000;
const MESSAGE_HEIGHT = 348;

const createContainerStyle = memoize(
    (totalSize): CSSProperties => ({
        minHeight: "100%",
        height: `${totalSize}px`,
        width: "100%",
        position: "relative",
    })
);

const createMessageStyles = memoize(
    (size, start): CSSProperties => ({
        position: "absolute",
        top: start,
        left: 0,
        height: size,
        width: "100%",
        //transform: `translateY(${start}px)`,
    })
);

interface Props extends RouteComponentProps<{ id: string }> {}

const Conversation: FC<Props> = ({ match }) => {
    const id = match.params.id;
    const chatId = parseInt(id);

    const rootStore = useContext(StoreContext);
    const { Chats } = rootStore;
    const [store] = useState(() => new StickerMessagesStore(rootStore, chatId));

    const chat = store.chat;
    const messages = store.messages;

    const photo = useFileStore(chat?.photo?.small, "base64");

    useEffect(() => {
        if (Chats.chats.has(chatId)) {
            store.init();
        }

        return () => {
            store.dispose();
        };
    }, [Chats.chats, chatId, store]);

    const parentRef = useRef<HTMLElement>();

    let size = messages.length;
    if (store.canLoad) {
        size++;
    }

    const estimateSize = useCallback(
        (index) => (store.canLoad && index === 0 ? PLACEHOLDER_HEIGHT : MESSAGE_HEIGHT),
        [store.canLoad]
    );

    const rowVirtualizer = useVirtual({
        size,
        parentRef,
        estimateSize,
    });

    const loadMessages = useCallback(async () => {
        if (parentRef.current && parentRef.current.scrollTop < PLACEHOLDER_HEIGHT - 50) {
            const loaded = await store.load();
            if (loaded) {
                parentRef.current!.scrollTop += MESSAGE_HEIGHT * loaded;
            }
        }
    }, [store]);

    useEffect(() => {
        if (!store.canLoad) {
            parentRef.current!.scrollTop -= PLACEHOLDER_HEIGHT;
        }
    }, [store.canLoad]);

    useEffect(() => {
        loadMessages();
    }, [loadMessages, messages.length]);

    const handleScroll = useCallback(() => {
        loadMessages();
    }, [loadMessages]);

    if (!id) {
        return (
            <CenterLayout>
                <Text type="secondary">Please choose a conversation </Text>
            </CenterLayout>
        );
    }

    const style = createContainerStyle(rowVirtualizer.totalSize);

    return (
        <Grid.Container direction="column" justify="flex-start" alignItems="stretch">
            <Toolbar>
                <Grid sm md={0}>
                    <Button auto type="abort" iconRight={<FiArrowLeft />} />
                </Grid>
                <Grid xs>
                    <UserCard src={photo} name={chat?.title} />
                </Grid>
            </Toolbar>
            <Grid.Container className={styles.root} direction="column" justify="flex-start">
                <List ref={parentRef as any} onScroll={handleScroll}>
                    <div style={style}>
                        {rowVirtualizer.virtualItems.map(({ index, start, size }) => {
                            let realIndex = index;
                            if (store.canLoad) {
                                realIndex--;
                            }

                            const style = createMessageStyles(size, start);

                            if (realIndex < 0)
                                return (
                                    <Grid.Container alignItems="flex-end" key={index} style={style}>
                                        <Loading>Loading messages</Loading>
                                    </Grid.Container>
                                );

                            const message = messages[realIndex];

                            return <Message key={message.id} style={style} message={message} />;
                        })}
                    </div>
                </List>
            </Grid.Container>
        </Grid.Container>
    );
};

export default observer(Conversation);
