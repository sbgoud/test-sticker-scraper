import { Loading, Text } from "@geist-ui/react";
import { observer } from "mobx-react-lite";
import { FC } from "react";
import MessagesStore from "../../store/MessagesStore";

interface Props {
    store: MessagesStore;
}

const Loader: FC<Props> = ({ store }) => {
    return store.isLoading ? (
        <Loading>
            <Text span type="secondary">
                Loading messages ({store.processed}/{store.total} batch: {store.batch})
            </Text>
        </Loading>
    ) : (
        <Text span type="secondary">
            Scroll to start loading
        </Text>
    );
};

export default observer(Loader);
