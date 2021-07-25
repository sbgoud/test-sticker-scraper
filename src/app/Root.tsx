import { Switch, Route, Redirect } from "react-router";

import { Grid, useMediaQuery } from "@geist-ui/react";

import Menu from "./Menu/Menu";
import Conversation from "./Conversation/Conversation";
import Set from "./Set/Set";

import styles from "./Root.module.css";

export default function Root() {
    const isMobile = useMediaQuery("sm", { match: "down" });

    return (
        <Grid.Container gap={0} width="100%" height="100%">
            {isMobile ? (
                <Switch>
                    <Route path="/chats" component={Menu} />
                    <Route path="/conversation/:id" component={Conversation} />
                    <Route path="/set/:id" render={(props) => <Set {...props} />} />
                    <Redirect to="chats" />
                </Switch>
            ) : (
                <>
                    <Grid className={styles.panel} sm={8} md={6} lg={4} xl={2}>
                        <Menu />
                    </Grid>
                    <Grid className={styles.panel} sm={16} md={18} lg={20} xl={22}>
                        <Switch>
                            <Route
                                path="/conversation/:id?"
                                render={(props) => <Conversation key={props.match.params.id} {...(props as any)} />}
                            />
                            <Route path="/set/:id" render={(props) => <Set key={props.match.params.id} {...props} />} />
                            <Redirect to="conversation" />
                        </Switch>
                    </Grid>
                </>
            )}
        </Grid.Container>
    );
}
