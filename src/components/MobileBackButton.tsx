import { Button, Grid } from "@geist-ui/react";
import { FiArrowLeft } from "react-icons/fi";
import { useHistory } from "react-router";

export function MobileBackButton() {
    const history = useHistory();

    if (history.length) {
        <Grid md={0}>
            <Button auto type="abort" iconRight={<FiArrowLeft />} onClick={history.goBack} />
        </Grid>;
    }

    return null;
}
