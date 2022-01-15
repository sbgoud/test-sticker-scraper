import { Grid, useMediaQuery } from "@geist-ui/react";
import { ComponentProps } from "react";
import { Redirect, Route, RouteProps, Switch } from "react-router";
import Conversation from "./Conversation/Conversation";
import Discover from "./Discover/Discover";
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
        path: "/discover",
        component: Discover,
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

const panelProps: ComponentProps<typeof Grid> = {
    paddingTop: 0,
    paddingBottom: 0,
};

export default function Root() {
    const isMobile = useMediaQuery("sm", { match: "down" });
    const [menu, ...other] = routes;

    return (
        <Grid.Container gap={2} margin={0} width="100%" height="100%">
            {isMobile ? (
                <Grid {...panelProps} className={styles.panel} xs={24}>
                    <Switch>
                        {[menu, ...other].map(toRoute)}
                        <Redirect to="chats" />
                    </Switch>
                </Grid>
            ) : (
                <>
                    <Grid {...panelProps} className={styles.panel} sm={8} md={6} lg={4} xl={2}>
                        <Menu />
                    </Grid>
                    <Grid {...panelProps} className={styles.panel} sm={16} md={18} lg={20} xl={22}>
                        <Switch>
                            {other.map(toRoute)}
                            <Redirect to="conversation" />
                        </Switch>
                    </Grid>
                </>
            )}
        </Grid.Container>
    );
}
