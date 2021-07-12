import { useCallback, useState, useContext } from "react";
import { observer } from "mobx-react-lite";
import { useForm } from "react-hook-form";
import { AuthorizationStateWaitPassword } from "@airgram/web";

import { Button, Grid, Input, Spacer, Text } from "@geist-ui/react";

import { StoreContext, CenterLayout } from "../../components";

const Password = () => {
    const { Authorization } = useContext(StoreContext);

    const [lock, setLock] = useState(false);

    const {
        formState: { errors },
        register,
        handleSubmit,
        setError,
    } = useForm();

    const state = Authorization.state as AuthorizationStateWaitPassword;

    const onSubmit = useCallback(
        async ({ password }) => {
            if (lock) {
                return;
            }

            try {
                setLock(true);
                const result = await Authorization.sendPassword(password);
                if (result.response._ === "error") {
                    throw result.response._;
                }
            } catch (error) {
                setError("password", error);
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
                    <Text h3>Enter Your Password</Text>
                    <Input.Password
                        autoFocus
                        disabled={lock}
                        placeholder={state.passwordHint}
                        type={errors.password ? "error" : undefined}
                        {...register("password", { required: true })}
                    />
                    <Spacer />
                    <Button disabled={lock} htmlType="submit" type="success">
                        Next
                    </Button>
                    <Spacer />
                    <Button type="success" ghost onClick={() => Authorization.reset()}>
                        Reset
                    </Button>
                </Grid.Container>
            </form>
        </CenterLayout>
    );
};

export default observer(Password);
