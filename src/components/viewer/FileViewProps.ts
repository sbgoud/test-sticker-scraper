import { File } from "@airgram/core";
import { ReactElement } from "react";

export interface FileViewProps {
    file: File;
    height?: string | number | undefined;
    width?: string | number | undefined;
    fallback?: ReactElement;
}
