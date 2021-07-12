import { Grid } from "@geist-ui/react";
import { observer } from "mobx-react-lite";

import { FC } from "react";

import User from "./User";
import Chats from "./Chats";
import { Toolbar } from "../../components";

const Menu: FC = () => {
    return (
        <Grid.Container direction="column" justify="flex-start" alignItems="stretch">
            <Toolbar>
                <User />
            </Toolbar>
            <Chats />
        </Grid.Container>
    );
};

export default observer(Menu);
