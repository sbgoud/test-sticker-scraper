import cx from "classnames";
import { ComponentProps, CSSProperties, ElementType, FC, forwardRef, HTMLProps, Ref, useCallback } from "react";
import Scrollbars, { ScrollbarProps } from "react-custom-scrollbars-2";
import styles from "./List.module.css";

const renderThumb: FC<HTMLProps<HTMLDivElement>> = ({ className, ...props }) => {
    return <div className={cx(className, styles.thumb)} {...props} />;
};

export const virtialContainerStyle = (totalSize: number, horizontal = false): CSSProperties => ({
    height: horizontal ? "100%" : totalSize,
    width: horizontal ? totalSize : "100%",
    position: "relative",
});

export const virtualSizeStyles = (size: number, start: number, horizontal = false): CSSProperties => ({
    position: "absolute",
    top: horizontal ? 0 : start,
    left: horizontal ? start : 0,
    height: horizontal ? "100%" : size,
    width: horizontal ? size : "100%",
});

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
