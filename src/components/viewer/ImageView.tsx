import { observer } from "mobx-react-lite";
import { FC } from "react";
import { useFileStore } from "../../store/FileStore";
import { FileViewProps } from "./FileViewProps";

interface Props
    extends FileViewProps,
        Omit<React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>, "src"> {}

const ImageView: FC<Props> = ({ file, fallback, ...other }) => {
    const data = useFileStore(file, "base64");

    if (!data) {
        return fallback ?? null;
    }

    return <img alt="" src={data as any} {...other} />;
};

export default observer(ImageView);
