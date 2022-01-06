import Lottie, { LottieComponentProps } from "lottie-react";
import { observer } from "mobx-react-lite";
import { FC } from "react";
import VisibilitySensor from "react-visibility-sensor";
import { useFileStore } from "../../store/FileStore";
import { FileViewProps } from "./FileViewProps";

interface Props extends FileViewProps, Omit<LottieComponentProps, "animationData"> {}

const LottieView: FC<Props> = ({ file, fallback, height, width, ...other }) => {
    const data = useFileStore(file, "lotty");

    if (!data) {
        return fallback ?? null;
    }

    return (
        <VisibilitySensor intervalCheck={true} scrollCheck={true}>
            {({ isVisible }) => (
                <Lottie
                    loop={isVisible}
                    renderer="svg"
                    animationData={data as any}
                    height={height}
                    width={width}
                    style={{ height, width }}
                    {...other}
                />
            )}
        </VisibilitySensor>
    );
};

export default observer(LottieView);
