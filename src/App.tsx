import { useContext } from "react";
import { observer } from "mobx-react-lite";
import { GeistProvider, CssBaseline, Page } from "@geist-ui/react";

import { StoreContext } from "./components/StoreProvider";

import AuthProvider from "./app/AuthProvider";
import Root from "./app/Root";
import Footer from "./app/Footer";

function App() {
    const { Theme } = useContext(StoreContext);

    return (
        <GeistProvider themeType={Theme.currentTheme}>
            <CssBaseline />
            <Page render="effect-seo" scale={0.5} width="100%" padding={0}>
                <Page.Content paddingTop={0}>
                    <AuthProvider>
                        <Root />
                    </AuthProvider>
                </Page.Content>
                <Page.Footer>
                    <Footer />
                </Page.Footer>
            </Page>
        </GeistProvider>
    );
}

export default observer(App);
