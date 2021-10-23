import { Flex, HamburgerButton, Text } from "./ui-kit";
function Header() {
  return (
    <Flex justifyContent="between" alignItems="center" p={4}>
      <Text transform="uppercase" weight="extrabold">
        Watchio
      </Text>
      <HamburgerButton />
    </Flex>
  );
}

export default Header;
