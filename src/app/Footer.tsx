import { Button, Grid, Link, Spacer, Text } from "@geist-ui/react";
import { useContext } from "react";
import { FiHeart, FiMoon, FiSun } from "react-icons/fi";
import { StoreContext } from "../components";

const Footer = () => {
    const { Theme } = useContext(StoreContext);

    const isDarktTheme = Theme.currentTheme === "dark";

    return (
        <Grid.Container wrap="nowrap" gap={0} height="50px" alignItems="center">
            <Spacer w={0.5} />
            <Button
                auto
                type="abort"
                iconRight={isDarktTheme ? <FiMoon /> : <FiSun />}
                onClick={() => Theme.toggleTheme()}
            />

            <div style={{ flex: 1 }} />
            <Text span>
                Made with{" "}
                <Link underline href="https://airgram.netlify.app/" target="_blank" rel="noopener noreferrer">
                    Airgram
                </Link>
                ,{" "}
                <Link underline href="https://react.geist-ui.dev/" target="_blank" rel="noopener noreferrer">
                    Geist UI
                </Link>{" "}
                and <FiHeart color="red" />
            </Text>
            <Spacer />
        </Grid.Container>
    );
};

export default Footer;
