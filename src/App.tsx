import { useContext } from "react";
import { observer } from "mobx-react-lite";

import { StoreContext } from "./components/StoreProvider";

import AuthProvider from "./app/AuthProvider";
import Root from "./app/Root";

function App() {
    const store = useContext(StoreContext);

    console.log(store.Authorization.state);

    return (
        <AuthProvider>
            <Root />
        </AuthProvider>
    );
}

export default observer(App);
