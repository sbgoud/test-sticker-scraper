import { FC } from "react";
import { observer } from "mobx-react-lite";

import { Text, Loading } from "@geist-ui/react";

import StickerMessagesStore from "../../store/StickerMessagesStore";

interface Props {
    store: StickerMessagesStore;
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
