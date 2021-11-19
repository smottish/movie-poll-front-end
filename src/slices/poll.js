import * as api from "../api";
import { createAsyncAction, createAction, ASYNC_ACTION_STATES } from "./utils";

const ERROR_CREATE_POLL = "Sorry, couldn't create your poll. Please try again.";
const ERROR_GET_POLL = "Sorry, couldn't find the poll you're looking for.";
const ERROR_SUBMIT_VOTE = "Sorry, something went wrong. Please try again.";

const defaultState = {
  createPollStatus: ASYNC_ACTION_STATES.INIT,
  submitVoteStatus: ASYNC_ACTION_STATES.INIT,
  error: "",
  poll: {}, // fetched from / returned by the backend
};

export const createPoll = createAsyncAction("poll/create", async (poll) => {
  return await api.createPoll(poll);
});

export const getPoll = createAsyncAction("poll/get", async (id) => {
  return await api.getPoll(id);
});

export const submitVote = createAsyncAction(
  "poll/vote",
  async ({ pollId, choiceId }) => {
    return await api.submitVote(pollId, choiceId);
  }
);

export const resetPoll = createAction("poll/reset");

export default function reducer(state = defaultState, action) {
  switch (action.type) {
    case createPoll.pending.type:
      return {
        ...state,
        createPollStatus: ASYNC_ACTION_STATES.PENDING,
        error: "",
      };
    case createPoll.fulfilled.type:
      return {
        ...state,
        createPollStatus: ASYNC_ACTION_STATES.FULFILLED,
        poll: { ...action.payload.result },
      };
    case createPoll.rejected.type:
      return {
        ...state,
        createPollStatus: ASYNC_ACTION_STATES.REJECTED,
        error: ERROR_CREATE_POLL,
      };
    case getPoll.fulfilled.type:
      return {
        ...state,
        poll: { ...action.payload.result },
      };
    case getPoll.rejected.type:
      return {
        ...state,
        error: ERROR_GET_POLL,
      };
    case submitVote.pending.type:
      return {
        ...state,
        submitVoteStatus: ASYNC_ACTION_STATES.PENDING,
      };
    case submitVote.fulfilled.type:
      return {
        ...state,
        submitVoteStatus: ASYNC_ACTION_STATES.FULFILLED,
      };
    case submitVote.rejected.type:
      return {
        ...state,
        error: ERROR_SUBMIT_VOTE,
        submitVoteStatus: ASYNC_ACTION_STATES.REJECTED,
      };
    case resetPoll.type:
      return defaultState;
    default:
      return state;
  }
}
