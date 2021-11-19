import { useState, useEffect } from "react";
import { useHistory } from "react-router";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Flex,
  DangerButton,
  getWidthClasses,
  getHeightClasses,
  Text,
  SecondaryButton,
  Skeleton,
  getColorClass,
  PrimaryButton,
  getLinkClasses,
} from "./ui-kit";
import { ThumbUpIcon } from "@heroicons/react/outline";
import { ThumbUpIcon as ThumbUpSolidIcon } from "@heroicons/react/solid";
import classNames from "classnames";
import { resetPoll, getPoll, submitVote } from "../slices/poll";
import CopyText from "./CopyText";
import { ASYNC_ACTION_STATES } from "../slices/utils";

function LoadingPoll(props) {
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
  const [movieChoice, setMovieChoice] = useState(null);
  const readOnlyPoll = useSelector((state) => state.poll.poll);
  const error = useSelector((state) => state.poll.error);
  const submitVoteStatus = useSelector((state) => state.poll.submitVoteStatus);
  const isLoading = useSelector((state) => state.loading.isLoading);
  const history = useHistory();
  const { id } = useParams();
  const dispatch = useDispatch();
  const pollId = parseInt(id);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => () => dispatch(resetPoll()), []); // reset state on unmount

  // Fetch poll whenever the poll id path param changes
  useEffect(() => {
    dispatch(getPoll(pollId));
  }, [dispatch, pollId]);

  // Copy poll from server to local state whenever the id
  // of the fetched poll changes.
  useEffect(() => {
    if (readOnlyPoll.id) {
      setPoll({ ...readOnlyPoll });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [readOnlyPoll.id]);

  const onChooseMovie = (choiceId) => {
    setMovieChoice(choiceId);
  };

  const onSubmitVote = () => {
    dispatch(submitVote({ pollId, choiceId: movieChoice }));
  };

  if (isLoading) {
    return <LoadingPoll />;
  }

  if (readOnlyPoll.id === undefined) {
    const errorMsg = error || "Sorry, something went wrong.";
    return (
      <Text size="lg" color="red.500" data-testid="poll-details-failure">
        {errorMsg}
      </Text>
    );
  }

  if (submitVoteStatus === ASYNC_ACTION_STATES.FULFILLED) {
    return (
      <>
        <Flex alignItems="center" direction="col" width="full">
          <Text size="lg" data-testid="submit-vote-success">
            Thank you for voting!
          </Text>
          <Flex width="auto">
            <Link
              to={`/poll/${pollId}/results`}
              className={getLinkClasses()}
              replace
            >
              View Results
            </Link>
          </Flex>
        </Flex>
      </>
    );
  }

  return (
    <>
      <Flex
        direction="col"
        spaceY={4}
        width={["full", "3/4", "3/5", "1/2"]}
        mb={4}
      >
        <Text size="xl">Share this poll with your friends and family!</Text>
        {poll.link && <CopyText text={poll.link} />}
      </Flex>
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
              <button
                onClick={() => onChooseMovie(movieChoice === id ? null : id)}
                data-testid={`vote ${title}`}
              >
                {movieChoice === id ? (
                  <ThumbUpSolidIcon
                    className={classNames(
                      ...getWidthClasses(6),
                      ...getHeightClasses(6),
                      getColorClass("text", "orange.500")
                    )}
                  />
                ) : (
                  <ThumbUpIcon
                    className={classNames(
                      ...getWidthClasses(6),
                      ...getHeightClasses(6)
                    )}
                  />
                )}
              </button>
            </Flex>
          ))}
      </Flex>
      {error && (
        <Flex mt={4}>
          <Text size="lg" color="red.500" data-testid="poll-details-failure">
            {error}
          </Text>
        </Flex>
      )}
      <Flex spaceX={2} mt={6}>
        <DangerButton onClick={() => history.goBack()}>Cancel</DangerButton>
        <SecondaryButton>Edit</SecondaryButton>
        {movieChoice !== null && (
          <PrimaryButton onClick={onSubmitVote}>Vote!</PrimaryButton>
        )}
      </Flex>
    </>
  );
}
