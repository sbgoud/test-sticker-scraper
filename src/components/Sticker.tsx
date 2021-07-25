import { FC } from "react";
import { observer } from "mobx-react-lite";
import Lottie from "lottie-react";
import VisibilitySensor from "react-visibility-sensor";
import { Sticker as AirgramSticker } from "@airgram/core";

import { useFileStore } from "../store/FileStore";

import styles from "./Sticker.module.css";

export interface StickerProps {
    sticker: AirgramSticker;
}

const Sticker: FC<StickerProps> = ({ sticker }) => {
    const file = useFileStore(sticker.sticker, sticker.isAnimated ? "lotty" : "base64");

    return sticker.isAnimated ? (
        <VisibilitySensor intervalCheck={true} scrollCheck={true}>
            {({ isVisible }) => (
                <Lottie loop={isVisible} renderer="svg" className={styles.root} animationData={file as any} />
            )}
        </VisibilitySensor>
    ) : (
        <img className={styles.root} alt="" src={file as any} />
    );
};

export default observer(Sticker);
