import { Grid, Text } from "@geist-ui/react";
import { observer } from "mobx-react-lite";
import { FC, useCallback, useContext, useEffect, useRef, useState } from "react";
import { RouteComponentProps } from "react-router";
import { useVirtual } from "react-virtual";
import { List, StoreContext, Toolbar, virtialContainerStyle, virtualSizeStyles } from "../../components";
import { MobileBackButton } from "../../components/MobileBackButton";
import { StickersStore } from "../../store/StickersStore";
import InlineSet from "./InlineSet";
import styles from "./Stickers.module.css";

interface Props extends RouteComponentProps {}

const Stickers: FC<Props> = () => {
    const rootStore = useContext(StoreContext);
    const [store] = useState(() => new StickersStore(rootStore));

    useEffect(() => {
        store.load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const parentRef = useRef<HTMLElement>();

    const estimateSize = useCallback((index) => 420, []);

    const { virtualItems, totalSize } = useVirtual({
        size: store.sets?.length ?? 0,
        parentRef,
        estimateSize,
    });

    return (
        <Grid.Container direction="column" justify="flex-start" alignItems="stretch">
            <Toolbar>
                <MobileBackButton />
                <Grid xs>
                    <Text>Stickers</Text>
                </Grid>
            </Toolbar>
            <Grid.Container className={styles.root} direction="column" justify="flex-start">
                <List ref={parentRef as any}>
                    <div style={virtialContainerStyle(totalSize)}>
                        {virtualItems.map(({ index, start, size }) => {
                            const set = store.sets?.[index];
                            return (
                                <div key={index} style={virtualSizeStyles(size, start)}>
                                    <InlineSet setInfo={set!} />
                                </div>
                            );
                        })}
                    </div>
                </List>
            </Grid.Container>
        </Grid.Container>
    );
};

export default observer(Stickers);
