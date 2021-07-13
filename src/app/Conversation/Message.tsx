import { useMemo } from "react";
import Lottie from "lottie-react";

import { Grid, GridContainerProps } from "@geist-ui/react";

import { StickerMessage } from "../../store/StickerMessagesStore";
import { useFileStore } from "../../store/FileStore";

import styles from "./Message.module.css";
import { observer } from "mobx-react-lite";

interface MessageContentProps {
    message: StickerMessage;
}

const MessageContent = observer(({ message }: MessageContentProps) => {
    const sticker = message.content.sticker;
    const file = useFileStore(sticker.sticker, sticker.isAnimated ? "lotty" : "base64");

    return (
        <>
            <Grid>{message.sender._}</Grid>
            <Grid.Container className={styles.container} alignItems="center">
                {sticker.isAnimated ? (
                    <Lottie renderer="svg" className={styles.sticker} animationData={file as any} />
                ) : (
                    <img className={styles.sticker} alt="" src={file as any} />
                )}
            </Grid.Container>
        </>
    );
});

interface MessageProps extends GridContainerProps, MessageContentProps {}

const Message = ({ message, ...other }: MessageProps) => {
    return (
        <Grid.Container gap={1} direction="column" {...other}>
            <MessageContent message={message} />
        </Grid.Container>
    );
};

export default Message;
