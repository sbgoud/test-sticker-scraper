import { FC, useContext, useState, useEffect, useRef, useCallback, useMemo, CSSProperties } from "react";
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

    const size = useMemo(() => {
        let result = 0;

        if (messages) {
            result = messages.length;
        }

        if (store.isLoading) {
            result++;
        }

        return result;
    }, [messages, store.isLoading]);

    const estimateSize = useCallback((index) => (store.isLoading && index === 0 ? 40 : 320), [store.isLoading]);

    const rowVirtualizer = useVirtual({
        size,
        parentRef,
        estimateSize,
    });

    const handleScroll = useCallback((event: React.UIEvent<HTMLDivElement, UIEvent>) => {
        const target = event.target as HTMLDivElement;
        console.log("scroll", target.scrollTop);
    }, []);

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
                    <UserCard src={photo.content} name={chat?.title} />
                </Grid>
            </Toolbar>
            <Grid.Container className={styles.root} direction="column" justify="flex-start">
                <List ref={parentRef as any} onScroll={handleScroll}>
                    <div
                        style={{
                            minHeight: "100%",
                            height: `${rowVirtualizer.totalSize}px`,
                            width: "100%",
                            position: "relative",
                        }}
                    >
                        {rowVirtualizer.virtualItems.map(({ index, size, start, measureRef }) => {
                            let realIndex = index;
                            if (store.isLoading) {
                                realIndex--;
                            }

                            const style: CSSProperties = {
                                position: "absolute",
                                top: 0,
                                left: 0,
                                width: "100%",
                                transform: `translateY(${start}px)`,
                            };

                            if (realIndex < 0)
                                return (
                                    <Loading key={index} style={style} padding="20px">
                                        Loading messages
                                    </Loading>
                                );

                            const message = messages[realIndex];

                            return <Message ref={measureRef} key={message.id} style={style} message={message} />;
                        })}
                    </div>
                </List>
            </Grid.Container>
        </Grid.Container>
    );
};

export default observer(Conversation);
