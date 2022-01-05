import { Button, Grid, Spinner } from "@geist-ui/react";
import { observer } from "mobx-react-lite";
import { FC, useContext, useEffect } from "react";
import { FiLogOut } from "react-icons/fi";
import { NavLink } from "react-router-dom";
import { StoreContext, UserCard } from "../../components";
import { useFileStore } from "../../store/FileStore";
import styles from "./User.module.css";

const User: FC = () => {
    const { Authorization } = useContext(StoreContext);

    const photo = useFileStore(Authorization.user?.profilePhoto?.small, "base64", { priority: 32 });

    useEffect(() => {
        Authorization.getMe();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (!Authorization.user) {
        return <Spinner />;
    }

    return (
        <Grid.Container wrap="nowrap" alignItems="center" xs>
            <NavLink className={styles.user} to="/stickers">
                <UserCard src={photo} name="My stickers">
                    {Authorization.user.username}
                </UserCard>
            </NavLink>

            <Button auto type="abort" iconRight={<FiLogOut />} onClick={() => Authorization.logOut()} />
        </Grid.Container>
    );
};

export default observer(User);
