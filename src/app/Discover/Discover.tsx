import { Grid, Spacer, Text } from "@geist-ui/react";
import { observer } from "mobx-react-lite";
import { FC, useCallback, useContext, useEffect, useMemo, useRef } from "react";
import { useVirtual } from "react-virtual";
import { List, MobileBackButton, StoreContext, Toolbar, virtualSizeStyles } from "../../components";
import { useScreenGridWidth } from "../../utils";
import ChatRow from "../Menu/ChatRow";
import styles from "./Discover.module.css";

let scrollTop = 0;

const Discover: FC = () => {
    const { Chats } = useContext(StoreContext);

    const itemData = Chats.discover;

    const parentRef = useRef<HTMLElement>();

    const gridWidth = useScreenGridWidth();

    const itemCount = useMemo(() => itemData.length / gridWidth, [gridWidth, itemData.length]);

    const rowVirtualizer = useVirtual({
        size: itemCount,
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
        <Grid.Container direction="column" justify="flex-start" alignItems="stretch">
            <Toolbar>
                <MobileBackButton />
                <Grid>
                    <Text>Discover</Text>
                </Grid>
                <Spacer w={1} />
                <Grid>
                    <Text small type="secondary">
                        Chats from your chats
                    </Text>
                </Grid>
            </Toolbar>
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
                            const chats = itemData.slice(index * gridWidth, (index + 1) * gridWidth);
                            return (
                                <Grid.Container
                                    className={styles.row}
                                    key={index}
                                    style={virtualSizeStyles(size, start ?? 0)}
                                    width="100%"
                                >
                                    {chats.map((chat, i) => {
                                        return (
                                            <Grid
                                                xs
                                                className={styles.chat}
                                                key={chat.info?.id ?? `${i}:${index}`}
                                                width="100%"
                                            >
                                                <ChatRow chat={chat} />
                                            </Grid>
                                        );
                                    })}
                                </Grid.Container>
                            );
                        })}
                    </div>
                </List>
            </Grid.Container>
        </Grid.Container>
    );
};

export default observer(Discover);
