import { Button, Grid, Text } from "@geist-ui/react";
import { observer } from "mobx-react-lite";
import { FC, useCallback, useEffect, useMemo, useRef } from "react";
import { DragDropContext, Draggable, DraggableProvided, Droppable, DroppableProvided } from "react-beautiful-dnd";
import { MdSwapVert } from "react-icons/md";
import { RouteComponentProps } from "react-router";
import { useVirtual } from "react-virtual";
import { List, MobileBackButton, Toolbar, TOOLBAR_HEIGHT, virtialContainerStyle } from "../../components";
import { STICKER_SIZE } from "../../components/Sticker";
import { useStickersStore } from "../../store/StickersStore";
import { setRef } from "../../utils";
import styles from "./Stickers.module.css";
import { StickerSetRow } from "./StickerSetRow";

interface Props extends RouteComponentProps {}

const Stickers: FC<Props> = () => {
    const store = useStickersStore();

    useEffect(() => {
        store.load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const parentRef = useRef<HTMLElement>();

    const itemSize = useMemo(
        () => TOOLBAR_HEIGHT + (store.isReordering ? 0 : STICKER_SIZE.default),
        [store.isReordering]
    );

    const estimateSize = useCallback(() => itemSize, [itemSize]);

    const { virtualItems, totalSize } = useVirtual({
        size: store.sets?.length ?? 0,
        parentRef,
        estimateSize,
    });

    return (
        <Grid.Container direction="column" justify="flex-start" alignItems="stretch">
            <Toolbar>
                <MobileBackButton />
                <Grid xs>
                    <Text>Stickers</Text>
                </Grid>
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
                <DragDropContext onDragEnd={(result) => store.reorderSets(result)}>
                    <Droppable
                        isDropDisabled={!store.isReordering}
                        droppableId="sets"
                        mode="virtual"
                        renderClone={(provided, _, rubric) => (
                            <StickerSetRow
                                provided={provided}
                                store={store}
                                set={store.sets![rubric.source.index]}
                                index={rubric.source.index}
                                size={itemSize}
                            />
                        )}
                    >
                        {(provided: DroppableProvided) => (
                            <List
                                ref={(ref) => {
                                    if (ref instanceof HTMLElement) {
                                        setRef(parentRef, ref);
                                        setRef(provided.innerRef, ref);
                                    }
                                }}
                            >
                                <div style={virtialContainerStyle(totalSize)}>
                                    {virtualItems.map(({ index, start }) => {
                                        const set = store.sets?.[index]!;
                                        return (
                                            <Draggable
                                                isDragDisabled={!store.isReordering}
                                                draggableId={set.id}
                                                index={index}
                                                key={set.id}
                                            >
                                                {(provided: DraggableProvided) => (
                                                    <StickerSetRow
                                                        provided={provided}
                                                        store={store}
                                                        index={index}
                                                        set={set}
                                                        start={start}
                                                        size={itemSize}
                                                    />
                                                )}
                                            </Draggable>
                                        );
                                    })}
                                </div>
                            </List>
                        )}
                    </Droppable>
                </DragDropContext>
            </Grid.Container>
        </Grid.Container>
    );
};

export default observer(Stickers);
