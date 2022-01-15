import { observer } from "mobx-react-lite";
import { FC, useContext } from "react";
import { StoreContext } from "../components";
import { AppLoader } from "../components/AppLoader";

const AuthProvider: FC = ({ children }) => {
    const { isInitialized } = useContext(StoreContext);

    if (!isInitialized) {
        return <AppLoader />;
    }

    return <>{children}</>;
};

export default observer(AuthProvider);
