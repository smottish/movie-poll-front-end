import { useState, useEffect } from "react";
import { useHistory } from "react-router";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Flex,
  DangerButton,
  getWidthClasses,
  getHeightClasses,
  Text,
  SecondaryButton,
  Skeleton,
} from "./ui-kit";
import { ThumbUpIcon } from "@heroicons/react/outline";
import classNames from "classnames";
import { resetPoll, getPoll } from "../slices/poll";
import CopyText from "./CopyText";

function LoadingPoll() {
  return (
    <>
      <Text size="xl">Loading poll...</Text>
      <Skeleton
        direction="col"
        spaceY={4}
        width={["full", "3/4", "3/5", "1/2"]}
        mt={4}
      >
        {[1, 2, 3].map((key) => (
          <Flex key={key} height={14} bgColor="gray.400"></Flex>
        ))}
      </Skeleton>
    </>
  );
}

export default function MoviePollDetails() {
  const [poll, setPoll] = useState({});
  const readOnlyPoll = useSelector((state) => state.poll.poll);
  const error = useSelector((state) => state.poll.error);
  const isLoading = useSelector((state) => state.loading.isLoading);
  const history = useHistory();
  const { id } = useParams();
  const dispatch = useDispatch();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => () => dispatch(resetPoll()), []); // reset state on unmount

  // Fetch poll whenever the poll id path param changes
  useEffect(() => {
    dispatch(getPoll(id));
  }, [dispatch, id]);

  // Copy poll from server to local state whenever the id
  // of the fetched poll changes.
  useEffect(() => {
    if (readOnlyPoll.id) {
      setPoll({ ...readOnlyPoll });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [readOnlyPoll.id]);

  if (isLoading) {
    return <LoadingPoll />;
  }

  if (error) {
    return (
      <Text size="lg" color="red.500" data-testid="get-poll-failure">
        {error}
      </Text>
    );
  }

  return (
    <>
      <Text size="xl">What do you want to watch?</Text>
      <Flex
        direction="col"
        spaceY={4}
        width={["full", "3/4", "3/5", "1/2"]}
        mt={4}
      >
        {poll.choices &&
          poll.choices.map(({ title, id }) => (
            <Flex
              key={id}
              justifyContent="between"
              alignItems="center"
              p={4}
              borderWidth={2}
              borderColor="gray.400"
            >
              <span>{title}</span>
              <button data-testid={`vote ${title}`}>
                <ThumbUpIcon
                  className={classNames(
                    ...getWidthClasses(6),
                    ...getHeightClasses(6)
                  )}
                />
              </button>
            </Flex>
          ))}
      </Flex>
      <Flex
        direction="col"
        spaceY={4}
        width={["full", "3/4", "3/5", "1/2"]}
        mt={4}
      >
        <Text size="xl">Share this poll with your friends and family!</Text>
        {poll.link && <CopyText text={poll.link} />}
      </Flex>
      <Flex spaceX={2} mt={6}>
        <DangerButton onClick={() => history.goBack()}>Cancel</DangerButton>
        <SecondaryButton>Edit</SecondaryButton>
      </Flex>
    </>
  );
}
