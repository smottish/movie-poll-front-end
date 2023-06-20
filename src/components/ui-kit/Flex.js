import PropTypes from "prop-types";
import classNames from "classnames";
import {
  getColorClass,
  getWidthClasses,
  getHeightClasses,
  getBorderClasses,
  SHARED_PROP_TYPES,
} from "./utils";

export function Flex({
  children,
  justifyContent,
  alignItems,
  textColor,
  borderWidth,
  borderColor,
  borderRadius,
  direction,
  spaceX,
  spaceY,
  p,
  mb,
  mt,
  mr,
  ml,
  mx,
  my,
  width,
  height,
  bgColor,
  className,
  ...props
}) {
  const classes = classNames(
    "flex",
    direction && `flex-${direction}`,
    justifyContent && `justify-${justifyContent}`,
    alignItems && `items-${alignItems}`,
    spaceX && `space-x-${spaceX}`,
    spaceY && `space-y-${spaceY}`,
    getColorClass("text", textColor),
    p && `p-${p}`,
    mb && `mb-${mb}`,
    mt && `mt-${mt}`,
    mr && `mr-${mr}`,
    ml && `ml-${ml}`,
    mx && `mx-${mx}`,
    my && `my-${my}`,
    ...getBorderClasses(borderWidth, borderColor, borderRadius),
    ...getWidthClasses(width),
    ...getHeightClasses(height),
    bgColor && getColorClass("bg", bgColor),
    className
  );
  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
}

Flex.propTypes = {
  justifyContent: PropTypes.oneOf([
    "start",
    "end",
    "center",
    "between",
    "around",
    "evenly",
  ]),
  alignItems: PropTypes.oneOf([
    "start",
    "end",
    "center",
    "baseline",
    "stretch",
  ]),
  direction: PropTypes.oneOf(["row", "row-reverse", "col", "col-reverse"]),
  spaceX: PropTypes.number,
  spaceY: PropTypes.number,
  textColor: PropTypes.string,
  p: PropTypes.number,
  mb: PropTypes.number,
  mt: PropTypes.number,
  mr: PropTypes.number,
  ml: PropTypes.number,
  mx: PropTypes.number,
  my: PropTypes.number,
  borderWidth: PropTypes.number,
  borderColor: PropTypes.string,
  BorderRadius: PropTypes.oneOf(["sm", "md", "lg", "xl"]),
  ...SHARED_PROP_TYPES,
};
