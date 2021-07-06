import { FC, useContext, useEffect } from "react";
import { observer } from "mobx-react-lite";

import { Grid } from "@geist-ui/react";

import { StoreContext } from "../../components/StoreProvider";

import AutoSizer from "react-virtualized-auto-sizer";
import { FixedSizeList, ListOnScrollProps } from "react-window";

import List from "../../components/List";
import ChatRow from "./ChatRow";

import styles from "./Chats.module.css";
import { useCallback } from "react";

let scrollTop = 0;

const Chats: FC = () => {
    const { Chats } = useContext(StoreContext);

    const itemData = Chats.chatsList;

    useEffect(() => {
        Chats.init();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleScroll = useCallback(({ scrollOffset }: ListOnScrollProps) => {
        scrollTop = scrollOffset;
    }, []);

    return (
        <Grid.Container className={styles.root} direction="column" justify="flex-start">
            <AutoSizer>
                {({ height, width }) => (
                    <FixedSizeList
                        initialScrollOffset={scrollTop}
                        outerElementType={List}
                        itemData={itemData}
                        itemCount={itemData.length}
                        itemSize={64}
                        height={height}
                        width={width}
                        onScroll={handleScroll}
                    >
                        {ChatRow}
                    </FixedSizeList>
                )}
            </AutoSizer>
        </Grid.Container>
    );
};

export default observer(Chats);
