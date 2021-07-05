import { FC, useContext, useEffect } from "react";
import { Grid } from "@geist-ui/react";
import { StoreContext } from "../../components/StoreProvider";

import styles from "./Chats.module.css";

const Chats: FC = () => {
    const { Chats } = useContext(StoreContext);

    useEffect(() => {
        Chats.init();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Grid.Container className={styles.root} direction="column">
            Chats
        </Grid.Container>
    );
};

export default Chats;
