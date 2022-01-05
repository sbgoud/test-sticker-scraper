import { Sticker as AirgramSticker } from "@airgram/core";
import { Spinner } from "@geist-ui/react";
import Lottie from "lottie-react";
import { observer } from "mobx-react-lite";
import { FC } from "react";
import VisibilitySensor from "react-visibility-sensor";
import { useFileStore } from "../store/FileStore";
import styles from "./Sticker.module.css";

export interface StickerProps {
    sticker: AirgramSticker;
}

const Sticker: FC<StickerProps> = ({ sticker }) => {
    const file = useFileStore(sticker.sticker, sticker.isAnimated ? "lotty" : "base64");

    let children: JSX.Element | undefined = undefined;

    if (!file) {
        children = <Spinner className={styles.spinner} scale={4} />;
    }

    if (file && sticker.isAnimated) {
        children = (
            <VisibilitySensor intervalCheck={true} scrollCheck={true}>
                {({ isVisible }) => (
                    <Lottie loop={isVisible} renderer="svg" className={styles.sticker} animationData={file as any} />
                )}
            </VisibilitySensor>
        );
    }

    if (file && !sticker.isAnimated) {
        children = <img className={styles.sticker} alt="" src={file as any} />;
    }

    return <div className={styles.root}>{children}</div>;
};

export default observer(Sticker);
