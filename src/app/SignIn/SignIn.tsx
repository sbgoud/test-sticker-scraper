import { AUTHORIZATION_STATE } from "@airgram/constants";
import { observer } from "mobx-react-lite";
import { useContext } from "react";
import { StoreContext } from "../../components";
import Code from "./Code";
import Password from "./Password";
import PhoneNumber from "./PhoneNumber";
import QrCode from "./QrCode";

const SignIn = () => {
    const { Authorization } = useContext(StoreContext);

    if (Authorization.state?._ === AUTHORIZATION_STATE.authorizationStateWaitPhoneNumber) {
        return <PhoneNumber />;
    }

    if (Authorization.state?._ === AUTHORIZATION_STATE.authorizationStateWaitCode) {
        return <Code />;
    }

    if (Authorization.state?._ === AUTHORIZATION_STATE.authorizationStateWaitPassword) {
        return <Password />;
    }

    if (Authorization.state?._ === AUTHORIZATION_STATE.authorizationStateWaitOtherDeviceConfirmation) {
        return <QrCode />;
    }

    return null;
};

export default observer(SignIn);
