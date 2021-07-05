import { forwardRef, useCallback, HTMLProps } from "react";
import Scrollbars from "react-custom-scrollbars-2";

const List = forwardRef<Scrollbars, HTMLProps<HTMLDivElement>>(({ onScroll, style, children }, ref) => {
    const refSetter = useCallback((scrollbarsRef) => {
        if (scrollbarsRef && typeof ref === "function") {
            ref?.(scrollbarsRef.view);
        } else if (typeof ref === "function") {
            ref?.(null);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Scrollbars ref={refSetter} style={{ ...style, overflow: "hidden" }} onScroll={onScroll}>
            {children}
        </Scrollbars>
    );
});

export default List;
