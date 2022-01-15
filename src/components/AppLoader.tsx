import { Spinner } from "@geist-ui/react";
import { CenterLayout } from "../components";

export const AppLoader = () => {
    return (
        <CenterLayout>
            <Spinner scale={5} />
        </CenterLayout>
    );
};
