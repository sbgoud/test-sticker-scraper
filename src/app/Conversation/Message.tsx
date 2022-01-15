import { Button, Grid } from "@geist-ui/react";
import { observer } from "mobx-react-lite";
import { HTMLProps, useCallback, useContext, useEffect } from "react";
import { FiExternalLink } from "react-icons/fi";
import { NavLink } from "react-router-dom";
import { Sticker, StoreContext, UserCard } from "../../components";
import { useFileStore } from "../../store/FileStore";
import { useMessageSenderStore } from "../../store/MessageSenderStore";
import { StickerMessage } from "../../store/MessagesStore";
import styles from "./Message.module.css";

interface MessageProps extends HTMLProps<HTMLDivElement> {
    message: StickerMessage;
}

const Message = ({ message, ...other }: MessageProps) => {
    const rootStore = useContext(StoreContext);

    const sticker = message.content.sticker;

    const sender = useMessageSenderStore(message.senderId);
    const senderPhoto = useFileStore(sender.user?.profilePhoto?.small ?? sender.chat?.photo?.small, "base64", {
        priority: 32,
    });

    useEffect(() => {
        sender.load();
    }, [sender]);

    const handleOpenExternal = useCallback(async () => {
        const request = await rootStore.Airgram.api.getMessageLink({ chatId: message.chatId, messageId: message.id });
        if (request.response._ === "messageLink") {
            Object.assign(document.createElement("a"), { target: "_blank", href: request.response.link }).click();
        }
        //;
    }, [message.chatId, message.id, rootStore.Airgram.api]);

    return (
        <div className={styles.root} {...other}>
            <Grid.Container direction="column">
                <Grid.Container>
                    <NavLink to={`/conversation/${message.chatId}`}>
                        <UserCard
                            src={senderPhoto}
                            name={sender.user ? sender.user.firstName + " " + sender.user.lastName : sender.chat?.title}
                        >
                            {new Date(message.date * 1000).toLocaleString()}
                        </UserCard>
                    </NavLink>
                    <Grid xs />
                    <Grid>
                        <Button auto type="abort" iconRight={<FiExternalLink />} onClick={handleOpenExternal} />
                    </Grid>
                </Grid.Container>

                <Grid className={styles.container} alignItems="flex-start">
                    <NavLink to={`/set/${sticker.setId}`}>
                        <Sticker sticker={sticker} />
                    </NavLink>
                </Grid>
            </Grid.Container>
        </div>
    );
};

export default observer(Message);
