import { Flex } from "./Flex";
export function Skeleton({ children, ...props }) {
  return (
    <Flex className="animate-pulse" {...props}>
      {children}
    </Flex>
  );
}
