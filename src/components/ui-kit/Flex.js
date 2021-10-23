import PropTypes from "prop-types";
import classNames from "classnames";
import { getTextColorClass } from "./utils";

export function Flex({
  children,
  justifyContent,
  alignItems,
  textColor,
  p,
  className,
  ...props
}) {
  const classes = classNames(
    "flex",
    `justify-${justifyContent}`,
    `items-${alignItems}`,
    getTextColorClass(textColor),
    `p-${p}`,
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
  textColor: PropTypes.string,
  p: PropTypes.number,
};

Flex.defaultProps = {
  justifyContent: "start",
  alignItems: "stretch",
  textColor: "",
  p: 0,
};
