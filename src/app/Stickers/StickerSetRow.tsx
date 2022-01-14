import { StickerSetInfo } from "@airgram/core";
import { observer } from "mobx-react-lite";
import { FC, useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import { MdOutlineReorder } from "react-icons/md";
import { virtualSizeStyles } from "../../components";
import { StickersStore } from "../../store/StickersStore";
import InlineSet from "./InlineSet";
import styles from "./Stickers.module.css";

interface Props {
    store: StickersStore;
    set: StickerSetInfo;
    index: number;
    size: number;
    start?: number;
}

const ITEM_TYPE = "sticker_set";

const StickerSetRow: FC<Props> = ({ store, index, set, size, start }) => {
    const handleRef = useRef<HTMLDivElement>(null);
    const rowRef = useRef<HTMLDivElement>(null);

    const [, connectDrag, connectPreview] = useDrag({
        type: ITEM_TYPE,
        item: set,
    });

    const [, connectDrop] = useDrop({
        accept: ITEM_TYPE,
        drop() {
            store.saveSetsOrder();
        },
        hover(dragged: StickerSetInfo) {
            if (dragged.id !== set.id) {
                store.swapSets(dragged.id, set.id);
            }
        },
    });

    connectDrag(handleRef);
    connectPreview(rowRef);
    connectDrop(rowRef);

    return (
        <div ref={rowRef} key={index} className={styles.setWrapper} style={virtualSizeStyles(size, start ?? 0)}>
            {store.isReordering && (
                <div ref={handleRef} className={styles.dragHandle}>
                    <MdOutlineReorder />
                </div>
            )}
            <InlineSet key={set.id} setInfo={set!} hideList={store.isReordering} hideControls={store.isReordering} />
        </div>
    );
};

export default observer(StickerSetRow);
