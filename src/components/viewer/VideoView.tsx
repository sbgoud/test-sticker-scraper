import { observer } from "mobx-react-lite";
import { FC } from "react";
import { useFileStore } from "../../store/FileStore";
import { FileViewProps } from "./FileViewProps";

interface Props
    extends FileViewProps,
        Omit<React.DetailedHTMLProps<React.VideoHTMLAttributes<HTMLVideoElement>, HTMLVideoElement>, "src"> {}

const VideoView: FC<Props> = ({ file, fallback, ...other }) => {
    const data = useFileStore(file, "url");

    if (!data) {
        return fallback ?? null;
    }

    return <video autoPlay loop src={data as any} {...other} />;
};

export default observer(VideoView);
