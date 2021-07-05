import { Switch, Route, Redirect } from "react-router";

import { Grid, Page } from "@geist-ui/react";

import { useMediaQuery } from "react-responsive";

import Footer from "./Footer";

import Menu from "./Menu/Menu";
import Conversation from "./Conversation/Conversation";

import styles from "./Root.module.css";

export default function Root() {
    const isMobile = useMediaQuery({ query: "(max-width: 650px)" });

    return (
        <Grid.Container gap={0} width="100%" height="100%">
            {isMobile ? (
                <Switch>
                    <Route path="/chats" component={Menu} />
                    <Route path="/conversation/:id" component={Conversation} />
                    <Redirect to="chats" />
                </Switch>
            ) : (
                <>
                    <Grid className={styles.panel} sm={8} md={6} lg={4} xl={2}>
                        <Menu />
                    </Grid>
                    <Grid className={styles.panel} sm={16} md={18} lg={20} xl={22}>
                        <Switch>
                            <Route path="/conversation/:id?" component={Conversation} />
                            <Redirect to="conversation" />
                        </Switch>
                    </Grid>
                </>
            )}
        </Grid.Container>
    );
}
