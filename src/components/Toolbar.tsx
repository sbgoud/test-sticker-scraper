import { Grid, GridContainerProps } from "@geist-ui/react";
import { FC } from "react";

export const TOOLBAR_HEIGHT = 64;

export const Toolbar: FC<GridContainerProps> = (props) => (
    <Grid.Container wrap="nowrap" height={`${TOOLBAR_HEIGHT}px`} alignItems="center" {...props} />
);
