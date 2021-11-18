import { createPoll as apiCreatePoll, getPoll as apiGetPoll } from "../api";
import { createAsyncAction, createAction, ASYNC_ACTION_STATES } from "./utils";

const ERROR_CREATE_POLL = "Sorry, couldn't create your poll. Please try again.";
const ERROR_GET_POLL = "Sorry, couldn't find the poll you're looking for.";

const defaultState = {
  createPollStatus: ASYNC_ACTION_STATES.INIT,
  error: "",
  poll: {}, // fetched from / returned by the backend
};

export const createPoll = createAsyncAction("poll/create", async (poll) => {
  return await apiCreatePoll(poll);
});

export const getPoll = createAsyncAction("poll/get", async (id) => {
  return await apiGetPoll(id);
});

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
    case resetPoll.type:
      return defaultState;
    default:
      return state;
  }
}
