import { useTheme } from "@geist-ui/react";
import { useEffect, FC } from "react";

const root = document.documentElement;

export const CssThemeVariables: FC = () => {
    const theme = useTheme();

    useEffect(() => {
        const { palette } = theme;

        for (const [key, value] of Object.entries(palette)) {
            root.style.setProperty("--palette-" + key, value);
        }
    }, [theme]);

    return null;
};
