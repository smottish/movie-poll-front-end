import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { getWidthClasses, SHARED_PROP_TYPES } from "./utils";

export const Input = React.forwardRef(
  ({ label, width, value, onChange, className, ...props }, ref) => {
    const classes = classNames("block", ...getWidthClasses(width), className);
    return (
      <label className={classes}>
        <span>{label}</span>
        <input
          value={value}
          onChange={onChange}
          className="block w-full"
          ref={ref}
          {...props}
        />
      </label>
    );
  }
);

Input.propTypes = {
  label: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,
  ...SHARED_PROP_TYPES,
};
