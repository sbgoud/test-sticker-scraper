import { CssBaseline, GeistProvider, Page } from "@geist-ui/react";
import { observer } from "mobx-react-lite";
import { useContext } from "react";
import AuthProvider from "./app/AuthProvider";
import DataLoader from "./app/DataLoader";
import Footer from "./app/Footer";
import Root from "./app/Root";
import { CssThemeVariables, StoreContext } from "./components";

function App() {
    const { Theme } = useContext(StoreContext);

    return (
        <GeistProvider themeType={Theme.currentTheme}>
            <CssThemeVariables />
            <CssBaseline />
            <Page render="effect-seo" scale={0.5} width="100%" padding={0}>
                <Page.Content paddingTop={0}>
                    <AuthProvider>
                        <DataLoader>
                            <Root />
                        </DataLoader>
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
