import { useMediaQuery } from "@geist-ui/react";
import { GeistUIThemesBreakpoints } from "@geist-ui/react/dist/themes/presets";

export function useScreenWidth(): keyof GeistUIThemesBreakpoints {
    const isXS = useMediaQuery("xs");
    const isSM = useMediaQuery("sm");
    const isMD = useMediaQuery("md");
    const isLG = useMediaQuery("lg");
    const isXL = useMediaQuery("xl");

    if (isXS) return "xs";
    if (isSM) return "sm";
    if (isMD) return "md";
    if (isLG) return "lg";
    if (isXL) return "xl";

    return "xs";
}

export function useScreenGridWidth(): number {
    const screenWidth = useScreenWidth();

    let gridWidth = 1;

    switch (screenWidth) {
        case "xs":
            gridWidth = 1;
            break;
        case "sm":
            gridWidth = 2;
            break;
        case "md":
            gridWidth = 3;
            break;
        case "lg":
            gridWidth = 4;
            break;
        case "xl":
            gridWidth = 5;
            break;
    }

    return gridWidth;
}
