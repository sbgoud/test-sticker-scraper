import { useCallback, useContext, useState } from "react";
import { useForm } from "react-hook-form";

import CenterLayout from "../../components/CenterLayout";
import { StoreContext } from "../../components/StoreProvider";
import { Button, Grid, Input, Spacer, Text } from "@geist-ui/react";

const PhoneNumber = () => {
    const { Authorization } = useContext(StoreContext);

    const [lock, setLock] = useState(false);

    const {
        formState: { errors },
        register,
        handleSubmit,
        setError,
    } = useForm();

    const onSubmit = useCallback(
        async ({ phoneNumber }) => {
            if (lock) {
                return;
            }

            try {
                setLock(true);
                const result = await Authorization.sendPhoneNumber(phoneNumber);
                if (result.response._ === "error") {
                    throw result.response._;
                }
            } catch (error) {
                setError("phoneNumber", error);
            } finally {
                setLock(false);
            }
        },
        [Authorization, lock, setError]
    );

    return (
        <CenterLayout>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Grid.Container direction="column" alignContent="center" alignItems="center">
                    <Text h3>Log in to Telegram</Text>
                    <Text margin={0}>by phone number</Text>
                    <Spacer />
                    <Input
                        autoFocus
                        disabled={lock}
                        type={errors.phoneNumber ? "error" : undefined}
                        {...register("phoneNumber", { required: true })}
                    />
                    <Spacer />
                    <Button disabled={lock} htmlType="submit" type="success">
                        Next
                    </Button>
                    <Spacer />
                    <Button ghost type="success" onClick={() => Authorization.switchToQr()}>
                        Log in by qr code
                    </Button>
                </Grid.Container>
            </form>
        </CenterLayout>
    );
};

export default PhoneNumber;
