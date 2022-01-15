import { Sticker as AirgramSticker } from "@airgram/core";
import { Spinner } from "@geist-ui/react";
import { observer } from "mobx-react-lite";
import { FC } from "react";
import { ErrorBoundary } from "./ErrorBoundary";
import styles from "./Sticker.module.css";
import { FileViewProps } from "./viewer/FileViewProps";
import ImageView from "./viewer/ImageView";
import LottieView from "./viewer/LottieView";

export const STICKER_SIZE = {
    small: 100,
    default: 320,
};

export interface StickerProps extends Omit<FileViewProps, "file"> {
    sticker: AirgramSticker;
}

let loader = <Spinner className={styles.spinner} scale={4} />;

const Sticker: FC<StickerProps> = ({
    sticker,
    height = STICKER_SIZE.default,
    width = STICKER_SIZE.default,
    ...other
}) => {
    let children: JSX.Element | undefined = undefined;

    if (sticker.isAnimated) {
        children = (
            <LottieView
                className={styles.sticker}
                file={sticker.sticker}
                fallback={loader}
                height={height}
                width={width}
                {...other}
            />
        );
    } else {
        children = (
            <ImageView
                className={styles.sticker}
                file={sticker.sticker}
                fallback={loader}
                height={height}
                width={width}
                {...other}
            />
        );
    }

    return (
        <div className={styles.root} style={{ height, width }}>
            <ErrorBoundary>{children}</ErrorBoundary>
        </div>
    );
};

export default observer(Sticker);
