import { Sticker as AirgtamSticker, StickerSetInfo } from "@airgram/web";
import { Button, Grid, Spacer, Text } from "@geist-ui/react";
import { observer } from "mobx-react-lite";
import { FC, useCallback, useEffect, useRef } from "react";
import { MdOpenInFull } from "react-icons/md";
import { NavLink } from "react-router-dom";
import { useVirtual } from "react-virtual";
import {
    List,
    Sticker,
    StickerSetThumbnail,
    Toolbar,
    virtialContainerStyle,
    virtualSizeStyles,
} from "../../components";
import { STICKER_SIZE } from "../../components/Sticker";
import { useStickerSetStore } from "../../store/StickerSetStore";
import SetActions from "../Set/SetActions";
import styles from "./InlineSet.module.css";

interface InlineStickersProps {
    stickers: AirgtamSticker[] | undefined;
}

export const InlineStickers: FC<InlineStickersProps> = ({ stickers }) => {
    const parentRef = useRef<HTMLElement>();

    const estimateSize = useCallback(() => STICKER_SIZE.default + 12, []);

    const { virtualItems, totalSize } = useVirtual({
        horizontal: true,
        size: stickers?.length ?? 0,
        parentRef,
        estimateSize,
    });

    return (
        <List ref={parentRef as any}>
            <div style={virtialContainerStyle(totalSize, true)}>
                {virtualItems.map(({ index, start, size }) => {
                    const sticker = stickers![index];

                    return (
                        <div key={index} style={virtualSizeStyles(size, start, true)}>
                            <Sticker sticker={sticker!} />
                        </div>
                    );
                })}
            </div>
        </List>
    );
};

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

    return (
        <Grid.Container className={styles.root} direction="column" justify="flex-start" alignItems="stretch">
            {!hideToolbar && (
                <Toolbar>
                    <StickerSetThumbnail set={set} height={26} width={26} />
                    <Spacer w={0.5} />
                    <Text small b>
                        {set?.title}
                    </Text>
                    {!hideControls && (
                        <Grid xs justify="flex-end">
                            <NavLink to={`/set/${setInfo.id}`}>
                                <Button auto type="abort" iconRight={<MdOpenInFull />} />
                            </NavLink>
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
