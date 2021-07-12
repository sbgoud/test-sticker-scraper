import { useContext } from "react";
import { AuthorizationStateWaitOtherDeviceConfirmation } from "@airgram/web";

import { Grid, Button, Spinner, Text, Spacer } from "@geist-ui/react";
import RenderQrCode from "qrcode.react";

import { StoreContext, CenterLayout } from "../../components";

import styles from "./QrCode.module.css";
import { observer } from "mobx-react-lite";

const QrCode = () => {
    const { Authorization } = useContext(StoreContext);

    const state = Authorization.state as AuthorizationStateWaitOtherDeviceConfirmation;

    return (
        <CenterLayout>
            <Grid.Container direction="column" alignContent="center" alignItems="center">
                <Text h3>Log in to Telegram</Text>
                <Text margin={0}>by qr code</Text>
                <Spacer />
                <div className={styles.codeArea}>
                    <CenterLayout disablePadding>
                        {state.link ? (
                            <RenderQrCode includeMargin renderAs="svg" value={state.link} size={240} />
                        ) : (
                            <Spinner />
                        )}
                    </CenterLayout>
                </div>
                <Spacer />
                <Button ghost type="success" onClick={() => Authorization.switchToPhoneNumber()}>
                    Log in by phone number
                </Button>
            </Grid.Container>
        </CenterLayout>
    );
};

export default observer(QrCode);
