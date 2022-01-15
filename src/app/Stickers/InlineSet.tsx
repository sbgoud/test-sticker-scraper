import { StickerSetInfo } from "@airgram/web";
import { Grid, Link, Spacer, Text } from "@geist-ui/react";
import { observer } from "mobx-react-lite";
import { FC, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { StickerSetThumbnail, Toolbar } from "../../components";
import { InlineStickers } from "../../components/InlineStickers";
import { useStickerSetStore } from "../../store/StickerSetStore";
import SetActions from "../Set/SetActions";
import styles from "./InlineSet.module.css";

interface Props {
    setInfo: StickerSetInfo;
    hideToolbar?: boolean;
    hideControls?: boolean;
    hideList?: boolean;
}

const InlineSet: FC<Props> = ({ hideToolbar = false, hideControls = false, hideList = false, setInfo }) => {
    const store = useStickerSetStore(setInfo.id);

    useEffect(() => {
        store.load();
    }, [store]);

    const set = store.set;

    const title = (
        <Grid.Container>
            <StickerSetThumbnail set={set} height={26} width={26} />
            <Spacer w={0.5} />
            <Text small b>
                {set?.title}
            </Text>
        </Grid.Container>
    );

    return (
        <Grid.Container className={styles.root} direction="column" justify="flex-start" alignItems="stretch">
            {!hideToolbar && (
                <Toolbar>
                    {hideControls ? (
                        title
                    ) : (
                        <NavLink component={Link} to={`/set/${setInfo.id}`}>
                            {title}
                        </NavLink>
                    )}
                    {!hideControls && (
                        <Grid xs justify="flex-end">
                            <SetActions store={store} />
                        </Grid>
                    )}
                </Toolbar>
            )}
            {!hideList && (
                <Grid className={styles.list}>
                    <InlineStickers stickers={set?.stickers} />
                </Grid>
            )}
        </Grid.Container>
    );
};

export default observer(InlineSet);
