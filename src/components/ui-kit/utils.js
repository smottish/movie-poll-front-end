import PropTypes from "prop-types";

export function getColorClass(type, color) {
  if (typeof color !== "string" || typeof type !== "string") {
    return "";
  }

  const [name, shade] = color.split(".");
  return color && (shade ? `${type}-${name}-${shade}` : `${type}-${name}`);
}

function getDimensionClasses(dimension, value) {
  const breakpoints = ["", "sm:", "md:", "lg:"];
  if (value === "" || value === undefined || value === null) {
    return [];
  }

  if (Array.isArray(value)) {
    return value.map(
      (val, index) => `${breakpoints[index]}${dimension}-${val}`
    );
  } else {
    return [`${dimension}-${value}`];
  }
}

export function getWidthClasses(width) {
  return getDimensionClasses("w", width);
}

export function getHeightClasses(height) {
  return getDimensionClasses("h", height);
}

export const SHARED_PROP_TYPES = {
  width: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.arrayOf(
      PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    ),
  ]),
};
