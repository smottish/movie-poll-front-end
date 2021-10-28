import { useState } from "react";
import { useHistory } from "react-router";
import { useDispatch } from "react-redux";
import PropTypes from "prop-types";
import {
  Flex,
  SecondaryButton,
  PrimaryButton,
  DangerButton,
  Input,
  getWidthClasses,
  getHeightClasses,
} from "./ui-kit";
import { TrashIcon } from "@heroicons/react/outline";
import classNames from "classnames";
import { createPoll } from "../slices/poll";

export default function MoviePoll({ create }) {
  const [movieTitle, setMovieTitle] = useState("");
  const [choices, setChoices] = useState([]);
  const history = useHistory();
  const dispatch = useDispatch();

  // If you're passing this into a child component, and you want
  // to optimize the rendering of the child, can use useCallback
  // here.
  const onClickCreatePoll = () => {
    dispatch(createPoll({ choices: choices.map(({ title }) => ({ title })) }));
  };

  const removeMovie = (id) => {
    setChoices(choices.filter(({ __id }) => __id !== id));
  };

  return (
    <>
      <form
        onSubmit={(ev) => {
          ev.preventDefault();
          setChoices([...choices, { title: movieTitle, __id: Date.now() }]);
        }}
      >
        <Flex direction="col" spaceY={4} alignItems="start">
          <Input
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
