import { useState, useEffect, useRef } from "react";
import { useHistory } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import {
  Flex,
  SecondaryButton,
  PrimaryButton,
  DangerButton,
  Input,
  getWidthClasses,
  getHeightClasses,
  Text,
} from "./ui-kit";
import { TrashIcon } from "@heroicons/react/outline";
import classNames from "classnames";
import { createPoll, resetPoll } from "../slices/poll";
import { ASYNC_ACTION_STATES } from "../slices/utils";
import CopyText from "./CopyText";

export default function MoviePollCreate(props) {
  const [pollTitle, setPollTitle] = useState("");
  const [movieTitle, setMovieTitle] = useState("");
  const [choices, setChoices] = useState([]);
  const createStatus = useSelector((state) => state.poll.createPollStatus);
  const poll = useSelector((state) => state.poll.poll);
  const error = useSelector((state) => state.poll.error);
  const titleInput = useRef(null);
  const history = useHistory();
  const dispatch = useDispatch();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => () => dispatch(resetPoll()), []); // reset state on unmount

  // If you're passing this into a child component, and you want
  // to optimize the rendering of the child, can use useCallback
  // here.
  const onClickCreatePoll = () => {
    dispatch(
      createPoll({
        title: pollTitle,
        choices: choices.map(({ title }) => ({ title })),
      })
    );
  };

  const onClickCreateAnother = () => {
    dispatch(resetPoll());
    setMovieTitle("");
    setChoices([]);
  };

  const onSubmitMovieOption = (ev) => {
    ev.preventDefault();
    titleInput.current.focus();
    setMovieTitle("");
    setChoices([...choices, { title: movieTitle, __id: Date.now() }]);
  };

  const removeMovie = (id) => {
    setChoices(choices.filter(({ __id }) => __id !== id));
  };

  if (createStatus === ASYNC_ACTION_STATES.FULFILLED) {
    return (
      <>
        <Text size="xl" data-testid="create-poll-success">
          Your poll is ready. Share the following link with your friends and
          family!
        </Text>
        <CopyText text={poll.link} />
        <Flex spaceX={2}>
          <PrimaryButton onClick={() => history.push("/")}>Done</PrimaryButton>
          <SecondaryButton onClick={onClickCreateAnother}>
            Create another poll
          </SecondaryButton>
        </Flex>
      </>
    );
  }

  return (
    <>
      {error && (
        <Text size="lg" color="red.500" data-testid="create-poll-failure">
          {error}
        </Text>
      )}
      <Flex mb={4}>
        <Text size="lg">Step 1: name your poll</Text>
      </Flex>
      <Flex>
        <Input
          value={pollTitle}
          onChange={(ev) => setPollTitle(ev.target.value)}
          label="Name"
          type="text"
          width={["full", "3/4", "3/5", "1/2"]}
        />
      </Flex>
      <Flex my={4}>
        <Text size="lg">Step 2: add movies</Text>
      </Flex>
      <form onSubmit={onSubmitMovieOption}>
        <Flex direction="col" spaceY={4} alignItems="start">
          <Input
            ref={titleInput}
            label="Title"
            type="text"
            value={movieTitle}
            onChange={(ev) => setMovieTitle(ev.target.value)}
            width={["full", "3/4", "3/5", "1/2"]}
          />
          <SecondaryButton type="submit">Add movie</SecondaryButton>
        </Flex>
      </form>
      <Flex
        direction="col"
        spaceY={4}
        width={["full", "3/4", "3/5", "1/2"]}
        mt={4}
      >
        {choices.map(({ title, __id }) => (
          <Flex
            key={__id}
            justifyContent="between"
            alignItems="center"
            p={4}
            borderWidth={2}
            borderColor="gray.400"
          >
            <span>{title}</span>
            <button
              data-testid={`remove ${title}`}
              onClick={() => removeMovie(__id)}
            >
              <TrashIcon
                className={classNames(
                  ...getWidthClasses(6),
                  ...getHeightClasses(6)
                )}
              />
            </button>
          </Flex>
        ))}
      </Flex>
      <Flex spaceX={2} mt={6}>
        <DangerButton onClick={() => history.goBack()}>Cancel</DangerButton>
        {choices.length >= 2 && (
          <PrimaryButton onClick={onClickCreatePoll}>Create Poll</PrimaryButton>
        )}
      </Flex>
    </>
  );
}
