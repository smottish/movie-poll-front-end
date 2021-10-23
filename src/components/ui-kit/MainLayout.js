import classNames from "classnames";

export function MainLayout({ children, show }) {
  const classes = classNames(
    { hidden: !show, block: show },
    "bg-gray-100 p-8 col-span-2 sm:col-span-1 text-gray-900"
  );
  return <div className={classes}>{children}</div>;
}
