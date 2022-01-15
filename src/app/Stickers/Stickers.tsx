import { Button, Grid, Spacer, Text } from "@geist-ui/react";
import { observer } from "mobx-react-lite";
import { FC, useCallback, useContext, useMemo, useRef } from "react";
import { MdSwapVert } from "react-icons/md";
import { RouteComponentProps } from "react-router";
import { useVirtual } from "react-virtual";
import { List, MobileBackButton, StoreContext, Toolbar, TOOLBAR_HEIGHT, virtialContainerStyle } from "../../components";
import { STICKER_SIZE } from "../../components/Sticker";
import FavoriteStickersRow from "./FavoriteStickersRow";
import RecentStickersRow from "./RecentStickersRow";
import styles from "./Stickers.module.css";
import StickerSetRow from "./StickerSetRow";

interface Props extends RouteComponentProps {}

const Stickers: FC<Props> = () => {
    const rootStore = useContext(StoreContext);
    const { Stickers: store } = rootStore;

    const parentRef = useRef<HTMLElement>();

    const [showFavorites, favoritesPosition] = useMemo(() => {
        const showFavorites = !store.isReordering;
        return [showFavorites, 0];
    }, [store.isReordering]);

    const [showRecent, recentPosition] = useMemo(() => {
        const showRecent = !store.isReordering;
        return [showRecent, showRecent && showFavorites ? favoritesPosition + 1 : favoritesPosition];
    }, [store.isReordering, showFavorites, favoritesPosition]);

    const [listSize, listOffset] = useMemo(() => {
        let listOffset = 0;
        let count = store.sets?.length ?? 0;

        if (showFavorites) {
            listOffset += 1;
        }

        if (showRecent) {
            listOffset += 1;
        }

        return [count + listOffset, listOffset];
    }, [showFavorites, showRecent, store.sets?.length]);

    const itemSize = useMemo(
        () => TOOLBAR_HEIGHT + (store.isReordering ? 0 : STICKER_SIZE.default),
        [store.isReordering]
    );

    const estimateSize = useCallback(() => itemSize, [itemSize]);

    const { virtualItems, totalSize } = useVirtual({
        size: listSize,
        parentRef,
        estimateSize,
    });

    return (
        <Grid.Container direction="column" justify="flex-start" alignItems="stretch">
            <Toolbar>
                <MobileBackButton />
                <Grid>
                    <Text>Stickers</Text>
                </Grid>
                <Spacer w={1} />
                <Grid>
                    <Text small type="secondary">
                        control panel
                    </Text>
                </Grid>
                <Grid xs />
                <Grid>
                    <Button
                        auto
                        type={store.isReordering ? "secondary" : "abort"}
                        iconRight={<MdSwapVert />}
                        onClick={() => store.toggleReordering()}
                    />
                </Grid>
            </Toolbar>
            <Grid.Container className={styles.root} direction="column" justify="flex-start">
                <List ref={parentRef as any}>
                    <div style={virtialContainerStyle(totalSize)}>
                        {virtualItems.map(({ index, start }) => {
                            if (showFavorites && index === favoritesPosition) {
                                return (
                                    <FavoriteStickersRow
                                        key={index}
                                        index={index}
                                        store={store}
                                        start={start}
                                        size={itemSize}
                                    />
                                );
                            }

                            if (showRecent && index === recentPosition) {
                                return (
                                    <RecentStickersRow
                                        key={index}
                                        index={index}
                                        store={store}
                                        start={start}
                                        size={itemSize}
                                    />
                                );
                            }

                            const set = store.sets?.[index - listOffset]!;

                            return (
                                <StickerSetRow
                                    key={index}
                                    store={store}
                                    index={index}
                                    set={set}
                                    start={start}
                                    size={itemSize}
                                />
                            );
                        })}
                    </div>
                </List>
            </Grid.Container>
        </Grid.Container>
    );
};

export default observer(Stickers);
