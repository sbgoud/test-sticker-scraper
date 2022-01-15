import { Button, Grid, Text, useMediaQuery } from "@geist-ui/react";
import { observer } from "mobx-react-lite";
import { FC, useCallback, useContext, useEffect, useRef, useState } from "react";
import { FiCompass } from "react-icons/fi";
import { Redirect, RouteComponentProps } from "react-router";
import { NavLink } from "react-router-dom";
import { useVirtual } from "react-virtual";
import {
    CenterLayout,
    List,
    MobileBackButton,
    StoreContext,
    Toolbar,
    UserCard,
    virtialContainerStyle,
    virtualSizeStyles,
} from "../../components";
import { useFileStore } from "../../store/FileStore";
import MessagesStore from "../../store/MessagesStore";
import styles from "./Conversation.module.css";
import Loader from "./Loader";
import Message from "./Message";

const PLACEHOLDER_HEIGHT = 1000;
const MESSAGE_HEIGHT = 420;

let scrollTop = new Map<number, number>();

export interface Props extends RouteComponentProps<{ id?: string | undefined }> {}

const Conversation: FC<Props> = ({ match }) => {
    const id = match.params.id!;
    const chatId = parseInt(id);

    const rootStore = useContext(StoreContext);
    const { Chats } = rootStore;
    const [store] = useState(() => new MessagesStore(rootStore, chatId));

    const chat = store.chatStore.chat;
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
            if (parentRef.current && count) {
                const offset = MESSAGE_HEIGHT * count;

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
        if (Chats.chatsStore.has(chatId)) {
            (async () => {
                const loaded = await store.init();
                scrollView(loaded);
            })();
        }

        return () => {
            store.dispose();
        };
    }, [Chats.chatsStore, chatId, scrollView, store]);

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

    const isMobile = useMediaQuery("sm", { match: "down" });

    if (!id && isMobile) {
        return <Redirect to="/chats" />;
    }

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
                <MobileBackButton />
                <Grid xs>
                    <UserCard src={photo} name={chat?.title} />
                </Grid>
                <NavLink to={`/discover/${chatId}`}>
                    <Button auto type="abort" iconRight={<FiCompass />} padding={0.5} />
                </NavLink>
            </Toolbar>
            <Grid.Container className={styles.root} direction="column" justify="flex-start">
                <List ref={parentRef as any} onScroll={handleScroll}>
                    <div style={virtialContainerStyle(totalSize)}>
                        {virtualItems.map(({ index, start, size }) => {
                            let realIndex = index;
                            if (store.canLoad) {
                                realIndex--;
                            }

                            const style = virtualSizeStyles(size, start);

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
