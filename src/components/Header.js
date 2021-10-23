import { Flex, HamburgerButton, Text } from "./ui-kit";
function Header({ onMenuClick, showMenuButton }) {
  return (
    <Flex justifyContent="between" alignItems="center" p={4}>
      <Text transform="uppercase" weight="extrabold">
        Watchio
      </Text>
      <HamburgerButton
        onClick={onMenuClick}
        style={{ display: showMenuButton ? "block" : "none" }}
      />
    </Flex>
  );
}

export default Header;
