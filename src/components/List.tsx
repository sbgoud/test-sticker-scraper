import { forwardRef, useCallback, FC, HTMLProps, Ref, ComponentProps, ElementType } from "react";
import cx from "classnames";
import Scrollbars, { ScrollbarProps } from "react-custom-scrollbars-2";

import styles from "./List.module.css";

const renderThumb: FC<HTMLProps<HTMLDivElement>> = ({ className, ...props }) => {
    return <div className={cx(className, styles.thumb)} {...props} />;
};

type Props<TComponent extends ElementType> = ComponentProps<TComponent> &
    ScrollbarProps & {
        component?: TComponent;
    };

const ListComponent = <TComponent extends ElementType = "div">(
    { component: Component = "div", children, ...other }: Props<TComponent>,
    ref: Ref<HTMLDivElement>
) => {
    const refSetter = useCallback((scrollbarsRef: any) => {
        if (scrollbarsRef && ref && typeof ref === "object") {
            (ref.current as any) = scrollbarsRef.view;
        } else if (scrollbarsRef && typeof ref === "function") {
            ref?.(scrollbarsRef.view);
        } else if (typeof ref === "function") {
            ref?.(null);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const renderView = useCallback(
        (props) => {
            return <Component {...props} />;
        },
        [Component]
    );

    return (
        <Scrollbars
            ref={refSetter}
            renderView={renderView}
            renderThumbHorizontal={renderThumb}
            renderThumbVertical={renderThumb}
            {...other}
        >
            {children}
        </Scrollbars>
    );
};

export const List = forwardRef(ListComponent);
