import { observer } from "mobx-react-lite";
import { FC } from "react";
import VisibilitySensor from "react-visibility-sensor";
import { useFileStore } from "../../store/FileStore";
import { FileViewProps } from "./FileViewProps";
import { Video } from "./Video";

interface Props
    extends FileViewProps,
        Omit<React.DetailedHTMLProps<React.VideoHTMLAttributes<HTMLVideoElement>, HTMLVideoElement>, "src"> {}

const VideoView: FC<Props> = ({ file, fallback, height, width, ...other }) => {
    const data = useFileStore(file, "url", { synchronous: true });

    if (!data) {
        return fallback ?? null;
    }

    return (
        <VisibilitySensor intervalCheck={true} intervalDelay={100} scrollCheck={true}>
            {({ isVisible }) => (
                <Video
                    play={isVisible}
                    autoPlay={false}
                    loop
                    height={height}
                    width={width}
                    src={data as any}
                    {...other}
                />
            )}
        </VisibilitySensor>
    );
};

export default observer(VideoView);
