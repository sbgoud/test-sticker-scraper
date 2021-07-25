import { useContext } from "react";
import { LinkProps, NavLink } from "react-router-dom";
import { observer, useLocalObservable } from "mobx-react-lite";
import { Grid, Text } from "@geist-ui/react";

import { StickerMessage } from "../../store/StickerMessagesStore";
import StickerSetStore from "../../store/StickerSetStore";

import styles from "./Message.module.css";

import { Sticker, StoreContext } from "../../components";
import { useEffect } from "react";

interface MessageProps extends Omit<LinkProps, "to"> {
    message: StickerMessage;
}

const Message = ({ message, ...other }: MessageProps) => {
    const sticker = message.content.sticker;
    const rootStore = useContext(StoreContext);

    const state = useLocalObservable(() => new StickerSetStore(rootStore, sticker.setId));

    useEffect(() => {
        state.load();
    }, [state]);

    return (
        <NavLink className={styles.root} to={`/set/${sticker.setId}`} {...other}>
            <Grid.Container gap={1} direction="column">
                <Grid>
                    <Text b type="secondary">
                        {state.set?.title}
                    </Text>
                </Grid>
                <Grid.Container className={styles.container} alignItems="center">
                    <Sticker sticker={sticker} />
                </Grid.Container>
            </Grid.Container>
        </NavLink>
    );
};

export default observer(Message);
