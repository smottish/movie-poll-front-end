import { useEffect, useState } from "react";
import {
  Flex,
  Text,
  PrimaryButton,
  Card,
  CardContent,
  CardActions,
  getLinkClasses,
} from "./ui-kit";
import { useHistory, Link } from "react-router-dom";
import { getPolls as apiGetPolls } from "../api";

function PollListItem({ id, title }) {
  // TODO: link should be /poll/:id/results if the user
  // has already voted
  return (
    <Card width={"full"}>
      <CardContent>{title}</CardContent>
      <CardActions>
        <Link to={`/polls/${id}`} className={getLinkClasses()}>
          View Poll
        </Link>
      </CardActions>
    </Card>
  );
}

export default function Home() {
  const [polls, setPolls] = useState([]);
  const [error, setError] = useState("");
  const [isLoadingDone, setIsLoadingDone] = useState(false);
  const history = useHistory();

  // Could use Redux async action, but using React state as an example.
  useEffect(() => {
    async function getPolls() {
      try {
        setPolls(await apiGetPolls());
      } catch (err) {
        setError("Sorry, something went wrong. Please refresh the page.");
      }
      setIsLoadingDone(true);
    }
    getPolls();
  }, []);

  if (!isLoadingDone) {
    return null;
  }

  return (
    <>
      <Flex alignItems="center" direction="col" spaceY={4} mb={8}>
        {polls.length > 0 ? (
          polls.map((poll) => <PollListItem key={poll.id} {...poll} />)
        ) : (
          <Text size="2xl">
            {error || "Sorry, you don't have any open polls!"}
          </Text>
        )}
      </Flex>
      <Flex justifyContent="center">
        <PrimaryButton onClick={() => history.push("/polls/create")}>
          Create a poll
        </PrimaryButton>
      </Flex>
    </>
  );
}
