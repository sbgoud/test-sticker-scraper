import { FC, useContext, useState, useEffect, useRef, useCallback, CSSProperties } from "react";
import { RouteComponentProps, useHistory } from "react-router";
import { observer } from "mobx-react-lite";
import { useVirtual } from "react-virtual";

import { Button, Grid, Text } from "@geist-ui/react";

import { CenterLayout, List, StoreContext, Toolbar, UserCard } from "../../components";
import StickerMessagesStore from "../../store/StickerMessagesStore";
import { useFileStore } from "../../store/FileStore";

import Loader from "./Loader";
import Message from "./Message";

import { FiArrowLeft } from "react-icons/fi";

import styles from "./Conversation.module.css";
import memoize from "fast-memoize";

const PLACEHOLDER_HEIGHT = 1000;
const MESSAGE_HEIGHT = 420;

let scrollTop = new Map<number, number>();

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
        padding: 32,
        //transform: `translateY(${start}px)`,
    })
);

interface Props extends RouteComponentProps<{ id: string }> {}

const Conversation: FC<Props> = ({ match }) => {
    const id = match.params.id;
    const chatId = parseInt(id);

    const history = useHistory();

    const rootStore = useContext(StoreContext);
    const { Chats } = rootStore;
    const [store] = useState(() => new StickerMessagesStore(rootStore, chatId));

    const chat = store.chat;
    const messages = store.messages;

    const photo = useFileStore(chat?.photo?.small, "base64");

    const parentRef = useRef<HTMLElement>();

    let size = messages.length;
    if (store.canLoad) {
        size++;
    }

    const estimateSize = useCallback(
        (index) => (store.canLoad && index === 0 ? PLACEHOLDER_HEIGHT : MESSAGE_HEIGHT),
        [store.canLoad]
    );

    const { virtualItems, totalSize, scrollToOffset } = useVirtual({
        size,
        parentRef,
        estimateSize,
    });

    const scrollView = useCallback(
        (count?: number) => {
            console.log("try scroll", count);
            if (parentRef.current && count) {
                const offset = MESSAGE_HEIGHT * count;
                console.log("scroll", count, parentRef.current!.scrollTop, offset);
                parentRef.current!.scrollTop += offset;
                scrollToOffset(parentRef.current!.scrollTop);
            }
        },
        [scrollToOffset]
    );

    useEffect(() => {
        if (scrollTop.has(chatId)) {
            scrollToOffset(scrollTop.get(chatId) ?? 0);
        } else {
            scrollView(store.messages.length);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (Chats.chats.has(chatId)) {
            (async () => {
                const loaded = await store.init();
                scrollView(loaded);
            })();
        }

        return () => {
            store.dispose();
        };
    }, [Chats.chats, chatId, scrollView, store]);

    const tryLoadMessages = useCallback(async () => {
        if (parentRef.current && parentRef.current.scrollTop < PLACEHOLDER_HEIGHT - 200) {
            const loaded = await store.load();
            scrollView(loaded);
        }
    }, [scrollView, store]);

    useEffect(() => {
        if (!store.canLoad) {
            parentRef.current!.scrollTop -= PLACEHOLDER_HEIGHT;
        }
    }, [store.canLoad]);

    useEffect(() => {
        tryLoadMessages();
    }, [tryLoadMessages, messages.length]);

    const handleScroll = useCallback(
        (event: React.UIEvent<HTMLDivElement, UIEvent>) => {
            tryLoadMessages();
            const target = event.target as HTMLDivElement;
            scrollTop.set(chatId, target.scrollTop);
        },
        [chatId, tryLoadMessages]
    );

    if (!id) {
        return (
            <CenterLayout>
                <Text type="secondary">Please choose a conversation </Text>
            </CenterLayout>
        );
    }

    const style = createContainerStyle(totalSize);

    return (
        <Grid.Container direction="column" justify="flex-start" alignItems="stretch">
            <Toolbar>
                {history.length ? (
                    <Grid md={0}>
                        <Button auto type="abort" iconRight={<FiArrowLeft />} onClick={history.goBack} />
                    </Grid>
                ) : (
                    false
                )}
                <Grid xs>
                    <UserCard src={photo} name={chat?.title} />
                </Grid>
            </Toolbar>
            <Grid.Container className={styles.root} direction="column" justify="flex-start">
                <List ref={parentRef as any} onScroll={handleScroll}>
                    <div style={style}>
                        {virtualItems.map(({ index, start, size }) => {
                            let realIndex = index;
                            if (store.canLoad) {
                                realIndex--;
                            }

                            const style = createMessageStyles(size, start);

                            if (realIndex < 0)
                                return (
                                    <Grid.Container gap={0} alignItems="flex-end" key={index} style={style}>
                                        <Grid xs justify="center" padding="50px">
                                            <Loader store={store} />
                                        </Grid>
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
