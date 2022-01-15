import { AUTHORIZATION_STATE } from "@airgram/constants";
import { observer } from "mobx-react-lite";
import { FC, useContext } from "react";
import { StoreContext } from "../components";
import { AppLoader } from "../components/AppLoader";
import SignIn from "./SignIn/SignIn";

const loadingState: string[] = [
    AUTHORIZATION_STATE.authorizationStateWaitTdlibParameters,
    AUTHORIZATION_STATE.authorizationStateWaitEncryptionKey,
];

const signInState: string[] = [
    AUTHORIZATION_STATE.authorizationStateWaitPhoneNumber,
    AUTHORIZATION_STATE.authorizationStateWaitCode,
    AUTHORIZATION_STATE.authorizationStateWaitPassword,
    AUTHORIZATION_STATE.authorizationStateWaitOtherDeviceConfirmation,
];

const AuthProvider: FC = ({ children }) => {
    const { Authorization } = useContext(StoreContext);

    if (!Authorization.state || loadingState.includes(Authorization.state._)) {
        return <AppLoader />;
    }

    if (signInState.includes(Authorization.state._)) {
        return <SignIn />;
    }

    return <>{children}</>;
};

export default observer(AuthProvider);
