import { FC } from "react";
import { observer } from "mobx-react-lite";
import Lottie from "lottie-react";
import VisibilitySensor from "react-visibility-sensor";

import { Grid, GridContainerProps } from "@geist-ui/react";

import { StickerMessage } from "../../store/StickerMessagesStore";
import { useFileStore } from "../../store/FileStore";

import styles from "./Message.module.css";

interface Props extends GridContainerProps {
    message: StickerMessage;
}

const Message = ({ message, ...other }: Props, ref: any) => {
    const sticker = message.content.sticker;
    const format = sticker.isAnimated ? "lotty" : "base64";
    const file = useFileStore(sticker.sticker, format);

    console.log(sticker, file);

    return (
        <Grid.Container ref={ref} direction="column" {...other}>
            <Grid>{message.sender._}</Grid>
            <Grid>
                {sticker.isAnimated ? (
                    <VisibilitySensor>
                        {({ isVisible }) => (
                            <Lottie loop={isVisible} className={styles.sticker} animationData={file.content as any} />
                        )}
                    </VisibilitySensor>
                ) : (
                    <img className={styles.sticker} alt="" src={file.content as any} />
                )}
            </Grid>
        </Grid.Container>
    );
};

export default observer(Message, { forwardRef: true });
