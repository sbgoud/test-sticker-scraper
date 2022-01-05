import { Grid } from "@geist-ui/react";
import { observer } from "mobx-react-lite";
import { HTMLProps, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { Sticker, UserCard } from "../../components";
import { useFileStore } from "../../store/FileStore";
import { useMessageSenderStore } from "../../store/MessageSenderStore";
import { StickerMessage } from "../../store/StickerMessagesStore";
import styles from "./Message.module.css";

interface MessageProps extends HTMLProps<HTMLDivElement> {
    message: StickerMessage;
}

const Message = ({ message, ...other }: MessageProps) => {
    const sticker = message.content.sticker;

    const sender = useMessageSenderStore(message.senderId);
    const senderPhoto = useFileStore(sender.user?.profilePhoto?.small ?? sender.chat?.photo?.small, "base64", {
        priority: 32,
    });

    useEffect(() => {
        sender.load();
    }, [sender]);

    return (
        <div className={styles.root} {...other}>
            <Grid.Container direction="column">
                <Grid>
                    <UserCard
                        src={senderPhoto}
                        name={sender.user ? sender.user.firstName + " " + sender.user.lastName : sender.chat?.title}
                    >
                        {new Date(message.date * 1000).toLocaleString()}
                    </UserCard>
                </Grid>
                <Grid className={styles.container} alignItems="center">
                    <NavLink to={`/set/${sticker.setId}`}>
                        <Sticker sticker={sticker} />
                    </NavLink>
                </Grid>
            </Grid.Container>
        </div>
    );
};

export default observer(Message);
