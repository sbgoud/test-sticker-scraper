import { Grid, useMediaQuery } from "@geist-ui/react";
import { Redirect, Route, RouteProps, Switch } from "react-router";
import Conversation from "./Conversation/Conversation";
import Menu from "./Menu/Menu";
import styles from "./Root.module.css";
import Set from "./Set/Set";
import Stickers from "./Stickers/Stickers";

const routes: RouteProps[] = [
    {
        path: "/chats",
        component: Menu,
    },
    {
        path: "/stickers",
        component: Stickers,
    },
    {
        path: "/conversation/:id?",
        render: (props) => <Conversation key={props.match.params.id} {...props} />,
    },
    {
        path: "/set/:id?",
        render: (props) => <Set key={props.match.params.id} {...props} />,
    },
];

function toRoute(route: RouteProps, index: number) {
    return <Route key={index} {...route} />;
}

export default function Root() {
    const isMobile = useMediaQuery("sm", { match: "down" });
    const [menu, ...other] = routes;

    return (
        <Grid.Container gap={0} width="100%" height="100%">
            {isMobile ? (
                <Switch>
                    {[menu, ...other].map(toRoute)}
                    <Redirect to="chats" />
                </Switch>
            ) : (
                <>
                    <Grid className={styles.panel} sm={8} md={6} lg={4} xl={2}>
                        <Menu />
                    </Grid>
                    <Grid className={styles.panel} sm={16} md={18} lg={20} xl={22}>
                        <Switch>{other.map(toRoute)}</Switch>
                        <Redirect to="conversation" />
                    </Grid>
                </>
            )}
        </Grid.Container>
    );
}
