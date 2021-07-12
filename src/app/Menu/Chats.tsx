import { FC, useContext, useEffect, useRef } from "react";
import { observer } from "mobx-react-lite";

import { Grid } from "@geist-ui/react";

import { StoreContext } from "../../components/StoreProvider";

import List from "../../components/List";
import ChatRow from "./ChatRow";

import styles from "./Chats.module.css";
import { useCallback } from "react";
import { useVirtual } from "react-virtual";

let scrollTop = 0;

const Chats: FC = () => {
    const { Chats } = useContext(StoreContext);

    const itemData = Chats.chatsList;

    useEffect(() => {
        Chats.load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const parentRef = useRef<HTMLElement>();

    const rowVirtualizer = useVirtual({
        size: itemData.length,
        parentRef,
        estimateSize: useCallback(() => 64, []),
    });

    useEffect(() => {
        rowVirtualizer.scrollToOffset(scrollTop);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleScroll = useCallback((event: React.UIEvent<HTMLDivElement, UIEvent>) => {
        const target = event.target as HTMLDivElement;
        scrollTop = target.scrollTop;
    }, []);

    return (
        <Grid.Container className={styles.root} direction="column" justify="flex-start">
            <List ref={parentRef as any} onScroll={handleScroll}>
                <div
                    style={{
                        height: `${rowVirtualizer.totalSize}px`,
                        width: "100%",
                        position: "relative",
                    }}
                >
                    {rowVirtualizer.virtualItems.map(({ index, size, start }) => {
                        const chat = itemData[index];
                        return (
                            <ChatRow
                                key={chat.info?.id ?? index}
                                chat={chat}
                                style={{
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                    width: "100%",
                                    height: `${size}px`,
                                    transform: `translateY(${start}px)`,
                                }}
                            />
                        );
                    })}
                </div>
            </List>
        </Grid.Container>
    );
};

export default observer(Chats);
