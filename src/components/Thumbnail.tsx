import { Thumbnail as AirgramThumbnail } from "@airgram/core";
import { FC } from "react";
import { FileViewProps } from "./viewer/FileViewProps";
import ImageView from "./viewer/ImageView";
import LottieView from "./viewer/LottieView";

interface Props extends Omit<FileViewProps, "file"> {
    thumbnail: AirgramThumbnail;
}

export const Thumbnail: FC<Props> = ({ thumbnail, height: heightProp, width: widthProp, ...other }) => {
    const { format, file, height: thumbnailHeight, width: thumbnailWidth } = thumbnail ?? {};

    const height = heightProp ?? thumbnailHeight;
    const width = widthProp ?? thumbnailWidth;

    switch (format._) {
        case "thumbnailFormatJpeg":
        case "thumbnailFormatPng":
        case "thumbnailFormatWebp":
        case "thumbnailFormatGif":
            return <ImageView file={file} height={height} width={width} {...other} />;
        case "thumbnailFormatTgs":
            return <LottieView file={file} height={height} width={width} {...other} />;
        default:
            return null;
    }
};
