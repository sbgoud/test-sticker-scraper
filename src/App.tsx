import { useContext } from "react";
import { observer } from "mobx-react-lite";

import { StoreContext } from "./components/StoreProvider";

function App() {
    const store = useContext(StoreContext);

    return (
        <>
            {store.Connection.state}
            <br />
            {store.Authorization.state}
        </>
    );
}

export default observer(App);
