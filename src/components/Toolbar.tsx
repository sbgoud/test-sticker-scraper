import { FC } from "react";
import { Grid, GridContainerProps } from "@geist-ui/react";

export const Toolbar: FC<GridContainerProps> = (props) => (
    <Grid.Container wrap="nowrap" height="64px" alignItems="center" {...props} />
);
