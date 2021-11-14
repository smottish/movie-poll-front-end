import classNames from "classnames";
export function HamburgerButton(props) {
  return <button {...props}>&#9776;</button>;
}

export function Button({ children, className, ...props }) {
  const classes = classNames(
    "px-6",
    "py-3",
    "rounded-md",
    "shadow-md",
    "font-medium",
    className
  );
  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}

export function PrimaryButton({ children, ...props }) {
  const classes = classNames(
    "bg-gradient-to-b",
    "from-orange-500",
    "to-yellow-300",
    "text-gray-800",
    "uppercase",
    "hover:opacity-75"
  );
  return (
    <Button className={classes} {...props}>
      {children}
    </Button>
  );
}

export function SecondaryButton({ children, ...props }) {
  const classes = classNames(
    "border-2",
    "border-blue-600",
    "uppercase",
    "hover:bg-blue-100"
  );
  return (
    <Button className={classes} {...props}>
      {children}
    </Button>
  );
}

export function DangerButton({ children, ...props }) {
  const classes = classNames(
    "bg-gradient-to-b",
    "from-red-600",
    "to-pink-400",
    "uppercase",
    "hover:opacity-75",
    "text-white"
  );
  return (
    <Button className={classes} {...props}>
      {children}
    </Button>
  );
}
