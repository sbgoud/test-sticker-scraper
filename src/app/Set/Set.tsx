import { FC, useContext, useEffect } from "react";
import { observer, useLocalObservable } from "mobx-react-lite";
import { RouteComponentProps, useHistory } from "react-router";

import { Button, Grid, Text } from "@geist-ui/react";
import { List, Sticker, StoreContext, Toolbar } from "../../components";
import StickerSetStore from "../../store/StickerSetStore";

import styles from "./Set.module.css";

import { FiArrowLeft } from "react-icons/fi";

interface Props extends RouteComponentProps<{ id?: string | undefined }> {}

const Set: FC<Props> = ({ match }) => {
    const setId = match.params.id!;

    const history = useHistory();
    const rootStore = useContext(StoreContext);

    const state = useLocalObservable(() => new StickerSetStore(rootStore, setId));
    const set = state.set;

    useEffect(() => {
        state.load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Grid.Container direction="column" justify="flex-start" alignItems="stretch">
            <Toolbar>
                {history.length ? (
                    <Grid md={0}>
                        <Button auto type="abort" iconRight={<FiArrowLeft />} onClick={history.goBack} />
                    </Grid>
                ) : (
                    false
                )}
                <Grid xs>
                    <Text h5 margin={0}>
                        {set?.title}
                    </Text>
                </Grid>
            </Toolbar>
            <List className={styles.root}>
                <Grid.Container justify="flex-start">
                    {set?.stickers.map((sticker) => (
                        <Grid key={sticker.sticker.id} xs={24} sm={12} md={12} lg={8} xl={6} justify="center">
                            <Sticker sticker={sticker} />
                        </Grid>
                    ))}
                </Grid.Container>
            </List>
        </Grid.Container>
    );
};

export default observer(Set);
