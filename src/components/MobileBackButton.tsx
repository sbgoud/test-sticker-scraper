import { Button, Grid } from "@geist-ui/react";
import { useCallback } from "react";
import { FiArrowLeft } from "react-icons/fi";
import { useHistory } from "react-router";

export function MobileBackButton() {
    const history = useHistory();

    const handleClick = useCallback(() => {
        if (history.length > 1) {
            history.goBack();
        } else {
            history.push("/");
        }
    }, [history]);

    return (
        <Grid md={0}>
            <Button auto type="abort" iconRight={<FiArrowLeft />} onClick={handleClick} />
        </Grid>
    );
}
