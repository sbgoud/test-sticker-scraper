import { forwardRef, memo, useMemo } from "react";
import Lottie from "lottie-react";

import { Grid, GridContainerProps } from "@geist-ui/react";

import { StickerMessage } from "../../store/StickerMessagesStore";
import { useFileStore } from "../../store/FileStore";

import styles from "./Message.module.css";
import { observer } from "mobx-react-lite";

interface Props extends GridContainerProps {
    message: StickerMessage;
}

const Message = ({ message, ...other }: Props, ref: any) => {
    const sticker = message.content.sticker;
    const format = sticker.isAnimated ? "lotty" : "base64";
    const file = useFileStore(sticker.sticker, format);
    const children = useMemo(
        () =>
            sticker.isAnimated ? (
                <Lottie renderer="svg" className={styles.sticker} animationData={file as any} />
            ) : (
                <img className={styles.sticker} alt="" src={file as any} />
            ),
        [file, sticker.isAnimated]
    );

    return (
        <Grid.Container ref={ref} gap={0} direction="column" {...other}>
            <Grid>{message.sender._}</Grid>
            <Grid className={styles.sticker}>{children}</Grid>
        </Grid.Container>
    );
};

export default observer(Message, { forwardRef: true });
