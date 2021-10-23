import classNames from "classnames";
export function SidebarLayout({ children, show }) {
  const classes = classNames(
    { block: show, hidden: !show },
    "col-span-2 sm:col-span-1 bg-orange-500"
  );
  return <div className={classes}>{children}</div>;
}
