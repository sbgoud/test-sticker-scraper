import { Button } from "@geist-ui/react";
import { observer } from "mobx-react-lite";
import { FC } from "react";
import { FiExternalLink } from "react-icons/fi";
import { MdAddBox, MdDelete } from "react-icons/md";
import StickerSetStore from "../../store/StickerSetStore";

interface Props {
    store: StickerSetStore;
}

const SetActions: FC<Props> = ({ store }) => {
    const set = store.set;

    return (
        <>
            <a href={`https://t.me/addstickers/${set?.name}`} target="_blank" rel="noopener noreferrer">
                <Button auto type="abort" iconRight={<FiExternalLink />} />
            </a>
            {(!set?.isInstalled || set.isArchived) && (
                <Button auto type="abort" iconRight={<MdAddBox />} onClick={() => store.install()} />
            )}
            {set?.isInstalled && !set.isArchived && (
                <Button auto type="abort" iconRight={<MdDelete />} onClick={() => store.delete()} />
            )}
        </>
    );
};

export default observer(SetActions);
