import { useEffect, useRef } from "react";
import styles from "./AdaptGrid.scss";
import useWindow from "@webstack/hooks/window/useWindow";
import UiLoader from "@webstack/components/UiLoader/view/UiLoader";

type FindClosestProps = {
  id: string;
  breakpoint: number;
  value?: number;
};
export interface iAdaptGrid {
  xs?: number;
  sm?: number;
  md?: number;
  lg?: number;
  xl?: number;
  gap?: number;
  gapX?: number;
  gapY?: number;
  margin?: string;
  padding?: string;
  children?: any;
  variant?: string;
  scroll?: string;
  responsive?: boolean;
  reverse?: boolean;
  focus?: any;
  align?: "center";
  backgroundColor?: string;
}

export default function AdaptGrid({
  focus,
  xs,
  sm,
  md,
  lg,
  xl,
  children,
  variant,
  gap,
  gapX,
  gapY,
  margin,
  padding,
  responsive: dynamic,
  scroll,
  reverse,
  align,
  backgroundColor,
}: iAdaptGrid) {
  const {width} = useWindow();
  const ref = useRef<any>(null);

  function findClosestDictionary(target: number, data: FindClosestProps[]) {
    const filteredData = data.filter((element) => element.value !== undefined);
    const closestDict = filteredData.reduce((prev, curr) => {
      const prevDiff = Math.abs(prev.breakpoint - target);
      const currDiff = Math.abs(curr.breakpoint - target);
      return currDiff < prevDiff ? curr : prev;
    });
    return closestDict.value;
  }
  function handleFocus() {
    if (!focus) return;
    const toFocus = ref.current?.querySelectorAll(focus[0]);
    if (toFocus) toFocus[focus[1]]?.focus();
  }
  useEffect(() => {
    const gridElement = ref.current;
    if (!gridElement) return;

    if (focus) handleFocus();
    const style = {
      gridTemplateColumns: `repeat(${findClosestDictionary(width, [
        { id: "xs", breakpoint: 600, value: xs },
        { id: "sm", breakpoint: 900, value: sm },
        { id: "md", breakpoint: 1100, value: md },
        { id: "lg", breakpoint: 1400, value: lg },
        { id: "xl", breakpoint: 1600, value: xl },
      ])}, 1fr)`,
      gridColumnGap: `${gapX ? gapX : gap}px`,
      gridRowGap: `${gapY ? gapY : gap}px`,
      paddingTop: `${gap ? gap / 2 : 0}px`,
      paddingBottom: `${gap ? gap / 2 : 0}px`,
      margin: `${margin ? margin : "0px"}`,
      padding: `${padding ? padding : "0px"}`,
      direction: `${reverse ? "rtl" : "ltr"}`,
    };

    Object.assign(gridElement.style, style);
  }, [
    width,
    gap,
    gapX,
    gapY,
    margin,
    padding,
    xs,
    sm,
    md,
    lg,
    xl,
    ref,
    focus,
    reverse,
    backgroundColor,
  ]);
  const childrenLength = children?.length;
  return (
    <>
      <style jsx>{styles}</style>
      <div
        ref={ref}

        className={`adaptgrid ${align ? ` ${align}` : ""}${scroll ? ` ${scroll}` : ""}`}
      >
        {!variant && children && children}
        {variant &&
          childrenLength &&
          children.map((child: any, key: number) => {
            return (
              <div
                key={key}
                style={
                  backgroundColor ? { backgroundColor: backgroundColor } : {}
                }
                className={`adaptgrid__grid-item${variant?` adaptgrid_${variant}`:''}`}
              >
                {child}
              </div>
            );
          })}
        {!children && !childrenLength && (
          <div
            style={backgroundColor ? { backgroundColor: backgroundColor } : {}}
            className={`adaptgrid__grid-item${variant?` adaptgrid_${variant}`:''}`}
          >
            {children}
          </div>
        )}
        {/* {!childrenLength && <div className='adapt-grid__loading'><UiLoader /></div>} */}
      </div>
    </>
  );
}
