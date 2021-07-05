import { FC, useContext, useEffect } from "react";
import { observer } from "mobx-react-lite";

import { Grid } from "@geist-ui/react";

import { StoreContext } from "../../components/StoreProvider";

import AutoSizer from "react-virtualized-auto-sizer";
import { FixedSizeList } from "react-window";

import List from "../../components/List";
import ChatRow from "./ChatRow";

import styles from "./Chats.module.css";

const Chats: FC = () => {
    const { Chats } = useContext(StoreContext);

    const itemData = Chats.chatsList;

    useEffect(() => {
        Chats.init();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Grid.Container className={styles.root} direction="column" justify="flex-start">
            <AutoSizer>
                {({ height, width }) => (
                    <FixedSizeList
                        outerElementType={List}
                        itemData={itemData}
                        itemCount={itemData.length}
                        itemSize={64}
                        height={height}
                        width={width}
                    >
                        {ChatRow}
                    </FixedSizeList>
                )}
            </AutoSizer>
        </Grid.Container>
    );
};

export default observer(Chats);
