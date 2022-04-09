import "@airgram/core";

declare module "@airgram/core" {
    interface td_stickerTypeStatic {
        _: "stickerTypeStatic";
    }

    /** The sticker is an animation in TGS format */
    interface td_stickerTypeAnimated {
        _: "stickerTypeAnimated";
    }

    /** The sticker is a video in WEBM format */
    interface td_stickerTypeVideo {
        _: "stickerTypeVideo";
    }

    /** The sticker is a mask in WEBP format to be placed on photos or videos */
    interface td_stickerTypeMask {
        _: "stickerTypeMask";
        /** Position where the mask is placed; may be null */
        mask_position?: td_maskPosition;
    }

    type td_StickerType =
        | td_stickerTypeStatic
        | td_stickerTypeAnimated
        | td_stickerTypeVideo
        | td_stickerTypeMask;

    interface Sticker {
        type: td_StickerType;
    }
}
