import classNames from "classnames";
import { getBorderClasses, getWidthClasses } from ".";
export function Card({ children, width }) {
  const classes = [
    "bg-white",
    "shadow",
    "p-3",
    "rounded",
    "flex",
    "flex-col",
    ...getBorderClasses(1, "white", "md"),
    ...getWidthClasses(width),
  ];
  return <div className={classNames(classes)}>{children}</div>;
}

export function CardContent({ children }) {
  return <div className="p-3">{children}</div>;
}

export function CardActions({ children }) {
  const classes = ["p-3", "flex", "flex-row-reverse", "items-center"];
  return <div className={classNames(classes)}>{children}</div>;
}
