import { StickerSet } from "@airgram/core";
import { FC } from "react";
import Sticker, { STICKER_SIZE } from "./Sticker";
import { Thumbnail } from "./Thumbnail";
import { FileViewProps } from "./viewer/FileViewProps";

interface Props extends Omit<FileViewProps, "file"> {
    set?: StickerSet;
}

export const StickerSetThumbnail: FC<Props> = ({ set, height = STICKER_SIZE.small, width = STICKER_SIZE.small }) => {
    if (set?.thumbnail) {
        return <Thumbnail thumbnail={set.thumbnail} height={height} width={width} />;
    }

    if (set?.stickers?.[0]) {
        return <Sticker sticker={set?.stickers[0]} height={height} width={width} />;
    }

    return null;
};
