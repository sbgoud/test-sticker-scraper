import { useTheme } from "@geist-ui/react";
import { FC, useEffect } from "react";

const root = document.documentElement;

export const CssThemeVariables: FC = () => {
    const theme = useTheme();

    useEffect(() => {
        (window as any).theme = theme;
        const { palette } = theme;

        for (const [key, value] of Object.entries(palette)) {
            root.style.setProperty("--palette-" + key, value);
        }
    }, [theme]);

    return null;
};
