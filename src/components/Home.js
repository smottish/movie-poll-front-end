import { Flex, Text, PrimaryButton } from "./ui-kit";
import { useHistory } from "react-router-dom";
export default function Home() {
  const history = useHistory();
  return (
    <>
      <Flex justifyContent="center" mb={8}>
        <Text size="2xl">Sorry, you don't have any open polls!</Text>
      </Flex>
      <Flex justifyContent="center">
        <PrimaryButton onClick={() => history.push("/polls/create")}>
          Create a poll
        </PrimaryButton>
      </Flex>
    </>
  );
}
