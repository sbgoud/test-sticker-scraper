import { FC } from "react";
import { RouteComponentProps } from "react-router";

import { Text } from "@geist-ui/react";

import CenterLayout from "../../components/CenterLayout";

interface Props extends RouteComponentProps<{ id: string }> {}

const Conversation: FC<Props> = ({ match }) => {
    const id = match.params.id;

    if (!id) {
        return (
            <CenterLayout>
                <Text type="secondary">Please choose a conversation </Text>
            </CenterLayout>
        );
    }

    return <>Conversation</>;
};

export default Conversation;
