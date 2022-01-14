import { Grid, Text } from "@geist-ui/react";
import { observer } from "mobx-react-lite";
import { FC } from "react";
import { Toolbar, virtualSizeStyles } from "../../components";
import { StickersStore } from "../../store/StickersStore";
import styles from "./RecentStickersRow.module.css";

interface Props {
    store: StickersStore;
    index: number;
    size: number;
    start?: number;
}

const RecentStickersRow: FC<Props> = ({ size, start }) => {
    return (
        <Grid.Container
            className={styles.root}
            direction="column"
            justify="flex-start"
            alignItems="stretch"
            style={virtualSizeStyles(size, start ?? 0)}
        >
            <Toolbar>
                <Text small b>
                    Recent
                </Text>
            </Toolbar>

            <Grid className={styles.list}>{/* <InlineStickers stickers={stickers} /> */}</Grid>
        </Grid.Container>
    );
};

export default observer(RecentStickersRow);
