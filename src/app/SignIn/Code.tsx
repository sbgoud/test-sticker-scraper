import { useCallback, useContext } from "react";
import { observer } from "mobx-react-lite";
import { useController, useForm } from "react-hook-form";
import { AuthorizationStateWaitCode } from "@airgram/web";

import { Grid, Text, Input, Spacer, Button } from "@geist-ui/react";

import { CenterLayout, StoreContext } from "../../components";

const Code = () => {
    const { Authorization } = useContext(StoreContext);

    const { handleSubmit, setError, control } = useForm();

    const state = Authorization.state as AuthorizationStateWaitCode;

    const {
        field: { value, onChange },
        fieldState: { error },
    } = useController({ defaultValue: "", name: "code", rules: { required: true }, control });

    const onSubmit = useCallback(
        async ({ code }) => {
            try {
                const result = await Authorization.sendCode(code);
                if (result.response._ === "error") {
                    throw result.response._;
                }
            } catch (error) {
                setError("code", { message: error as string });
            }
        },
        [Authorization, setError]
    );

    const handleChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            const value = event.target.value;
            onChange(value);

            if (value.length === 5) {
                handleSubmit(onSubmit)(event);
            }
        },
        [handleSubmit, onChange, onSubmit]
    );

    return (
        <CenterLayout>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Grid.Container direction="column" alignContent="center" alignItems="center">
                    <Text h3>{state.codeInfo.phoneNumber}</Text>
                    <Input
                        autoFocus
                        label="Code"
                        type={error ? "error" : undefined}
                        value={value}
                        onChange={handleChange}
                    />
                    <Spacer />
                    <Button htmlType="submit" type="success">
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

export default observer(Code);
