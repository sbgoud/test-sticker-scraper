import { Grid } from "@geist-ui/react";
import { observer } from "mobx-react-lite";

import { FC } from "react";

import User from "./User";
import Chats from "./Chats";

const Menu: FC = () => {
    return (
        <Grid.Container direction="column" justify="flex-start" alignItems="stretch">
            <Grid.Container height="64px" alignItems="center">
                <User />
            </Grid.Container>
            <Chats />
        </Grid.Container>
    );
};

export default observer(Menu);
