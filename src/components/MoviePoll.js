import { useState, useEffect, useRef } from "react";
import { useHistory } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";
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
import { TrashIcon, DuplicateIcon } from "@heroicons/react/outline";
import classNames from "classnames";
import { createPoll, resetPoll } from "../slices/poll";
import { ASYNC_ACTION_STATES } from "../slices/utils";

async function copyToClipboard(text) {
  if (navigator && navigator.clipboard) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      return false;
    }
  }

  return false;
}

export default function MoviePoll({ create }) {
  const [movieTitle, setMovieTitle] = useState("");
  const [choices, setChoices] = useState([]);
  const [copiedText, setCopiedText] = useState("");
  const createStatus = useSelector((state) => state.poll.createPollStatus);
  const poll = useSelector((state) => state.poll.poll);
  const error = useSelector((state) => state.poll.error);
  const titleInput = useRef(null);
  const history = useHistory();
  const dispatch = useDispatch();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => () => dispatch(resetPoll()), []); // reset state on unmount

  useEffect(() => {
    let timer;
    if (copiedText !== "") {
      timer = setTimeout(() => setCopiedText(""), 1000);
    }

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [copiedText]);

  // If you're passing this into a child component, and you want
  // to optimize the rendering of the child, can use useCallback
  // here.
  const onClickCreatePoll = () => {
    dispatch(createPoll({ choices: choices.map(({ title }) => ({ title })) }));
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

  const onCopyPollLink = () => {
    copyToClipboard(poll.link).then((success) => {
      if (success) {
        setCopiedText("Copied!");
      } else {
        setCopiedText("Sorry, couldn't copy!");
      }
    });
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
        <Flex
          borderWidth={2}
          borderRadius="md"
          borderColor="gray.700"
          justifyContent="between"
          alignItems="center"
          p={4}
          my={5}
        >
          <Text size="lg">{poll.link}</Text>
          {copiedText ? (
            <Text size="sm">{copiedText}</Text>
          ) : (
            <button onClick={onCopyPollLink}>
              <DuplicateIcon
                className={classNames(
                  ...getWidthClasses(6),
                  ...getHeightClasses(6)
                )}
              />
            </button>
          )}
        </Flex>
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

MoviePoll.propTypes = {
  create: PropTypes.bool,
};

MoviePoll.defaultProps = {
  create: false,
};
