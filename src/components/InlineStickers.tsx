import { Sticker as AirgtamSticker } from "@airgram/web";
import { FC, useCallback, useRef } from "react";
import { useVirtual } from "react-virtual";
import { List, virtialContainerStyle, virtualSizeStyles } from "./List";
import Sticker, { STICKER_SIZE } from "./Sticker";

interface InlineStickersProps {
    stickers: AirgtamSticker[] | undefined;
}

export const InlineStickers: FC<InlineStickersProps> = ({ stickers }) => {
    const parentRef = useRef<HTMLElement>();

    const estimateSize = useCallback(() => STICKER_SIZE.default + 12, []);

    const { virtualItems, totalSize } = useVirtual({
        horizontal: true,
        size: stickers?.length ?? 0,
        parentRef,
        estimateSize,
    });

    return (
        <List ref={parentRef as any}>
            <div style={virtialContainerStyle(totalSize, true)}>
                {virtualItems.map(({ index, start, size }) => {
                    const sticker = stickers![index];

                    return (
                        <div key={index} style={virtualSizeStyles(size, start, true)}>
                            <Sticker sticker={sticker!} />
                        </div>
                    );
                })}
            </div>
        </List>
    );
};
