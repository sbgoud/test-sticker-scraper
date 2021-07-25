import { forwardRef, useCallback, FC, HTMLProps } from "react";
import cx from "classnames";
import Scrollbars, { ScrollbarProps } from "react-custom-scrollbars-2";

import styles from "./List.module.css";

const renderThumb: FC<HTMLProps<HTMLDivElement>> = ({ className, ...props }) => {
    return <div className={cx(className, styles.thumb)} {...props} />;
};

export const List = forwardRef<HTMLElement, ScrollbarProps>(({ style, children, ...other }, ref) => {
    const refSetter = useCallback((scrollbarsRef: any) => {
        if (scrollbarsRef && ref && typeof ref === "object") {
            ref.current = scrollbarsRef.view;
        } else if (scrollbarsRef && typeof ref === "function") {
            ref?.(scrollbarsRef.view);
        } else if (typeof ref === "function") {
            ref?.(null);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Scrollbars
            ref={refSetter}
            style={{ ...style }}
            renderThumbHorizontal={renderThumb}
            renderThumbVertical={renderThumb}
            {...other}
        >
            {children}
        </Scrollbars>
    );
});
