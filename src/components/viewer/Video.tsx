import { FC, RefObject, useEffect, useRef } from "react";

interface Props extends React.DetailedHTMLProps<React.VideoHTMLAttributes<HTMLVideoElement>, HTMLVideoElement> {
    play?: boolean;
}

export const Video: FC<Props> = ({ play, ...other }) => {
    const element = useRef(undefined) as unknown as RefObject<HTMLVideoElement>;

    useEffect(() => {
        if (play !== undefined && element.current) {
            if (play) {
                element.current.play();
            } else {
                element.current.pause();
            }
        }
    }, [play]);

    return <video ref={element} {...other} />;
};
