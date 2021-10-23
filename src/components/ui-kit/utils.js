export function getTextColorClass(color) {
  if (typeof color !== "string") {
    return "";
  }

  const [name, shade] = color.split(".");
  return color && (shade ? `text-${name}-${shade}` : `text-${name}`);
}
