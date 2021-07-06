import { FC, useContext, useEffect } from "react";
import { observer } from "mobx-react-lite";

import { Grid, Spinner, Button } from "@geist-ui/react";
import { StoreContext } from "../../components/StoreProvider";
import { useFileStore } from "../../store/FileStore";

import UserCard from "../../components/UserCard";

import { FiLogOut } from "react-icons/fi";

const User: FC = () => {
    const { Authorization } = useContext(StoreContext);

    const photo = useFileStore(Authorization.user?.profilePhoto?.small);

    useEffect(() => {
        Authorization.getMe();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (!Authorization.user) {
        return <Spinner />;
    }

    return (
        <Grid.Container wrap="nowrap" alignItems="center" xs>
            <UserCard src={photo?.base64} name={`${Authorization.user.firstName} ${Authorization.user.lastName}`}>
                {Authorization.user.username}
            </UserCard>
            <div style={{ flex: 1 }} />
            <Button auto type="abort" iconRight={<FiLogOut />} onClick={() => Authorization.logOut()} />
        </Grid.Container>
    );
};

export default observer(User);
