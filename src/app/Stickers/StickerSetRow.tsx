import { StickerSetInfo } from "@airgram/core";
import { FC } from "react";
import { DraggableProvided } from "react-beautiful-dnd";
import { MdOutlineReorder } from "react-icons/md";
import { virtualSizeStyles } from "../../components";
import { StickersStore } from "../../store/StickersStore";
import InlineSet from "./InlineSet";
import styles from "./Stickers.module.css";

interface Props {
    provided: DraggableProvided;
    store: StickersStore;
    set: StickerSetInfo;
    index: number;
    size: number;
    start?: number;
}

export const StickerSetRow: FC<Props> = ({ provided, store, index, set, size, start }) => {
    return (
        <div
            ref={provided.innerRef}
            key={index}
            className={styles.setWrapper}
            {...provided.draggableProps}
            style={{ ...virtualSizeStyles(size, start ?? 0), ...provided.draggableProps.style }}
        >
            {store.isReordering && (
                <div className={styles.dragHandle} {...provided.dragHandleProps}>
                    <MdOutlineReorder />
                </div>
            )}
            <InlineSet setInfo={set!} hideList={store.isReordering} hideControls={store.isReordering} />
        </div>
    );
};
