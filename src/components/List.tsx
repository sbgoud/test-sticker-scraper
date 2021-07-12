import { forwardRef, useCallback } from "react";
import Scrollbars, { ScrollbarProps } from "react-custom-scrollbars-2";

const List = forwardRef<HTMLElement, ScrollbarProps>(({ style, children, ...other }, ref) => {
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
        <Scrollbars ref={refSetter} style={{ ...style }} {...other}>
            {children}
        </Scrollbars>
    );
});

export default List;
