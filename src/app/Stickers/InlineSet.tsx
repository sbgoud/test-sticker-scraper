import { StickerSetInfo } from "@airgram/web";
import { Grid, Text } from "@geist-ui/react";
import { observer } from "mobx-react-lite";
import { FC, useCallback, useContext, useEffect, useRef, useState } from "react";
import { useVirtual } from "react-virtual";
import { List, Sticker, StoreContext, virtialContainerStyle, virtualSizeStyles } from "../../components";
import StickerSetStore from "../../store/StickerSetStore";
import styles from "./InlineSet.module.css";

interface Props {
    setInfo: StickerSetInfo;
}

const InlineSet: FC<Props> = ({ setInfo }) => {
    const rootStore = useContext(StoreContext);
    const [store] = useState(() => new StickerSetStore(rootStore, setInfo.id));

    useEffect(() => {
        store.load();
    }, [store]);

    const set = store.set;

    const parentRef = useRef<HTMLElement>();

    const estimateSize = useCallback((index) => 420, []);

    const { virtualItems, totalSize } = useVirtual({
        horizontal: true,
        size: set?.stickers.length ?? 0,
        parentRef,
        estimateSize,
    });

    return (
        <Grid.Container className={styles.root} direction="column" justify="flex-start" alignItems="stretch">
            <Grid>
                <Text>{set?.title}</Text>
            </Grid>
            <Grid className={styles.list}>
                <List ref={parentRef as any}>
                    <div style={virtialContainerStyle(totalSize, true)}>
                        {virtualItems.map(({ index, start, size }) => {
                            const sticker = set?.stickers[index];

                            return (
                                <div key={index} style={virtualSizeStyles(size, start, true)}>
                                    <Sticker sticker={sticker!} />
                                </div>
                            );
                        })}
                    </div>
                </List>
            </Grid>
        </Grid.Container>
    );
};

export default observer(InlineSet);
