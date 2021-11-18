import { createPoll, getPoll } from "./poll";

export default function reducer(state = { isLoading: false }, action) {
  switch (action.type) {
    case createPoll.pending.type:
    case getPoll.pending.type:
      return { isLoading: true };
    case createPoll.fulfilled.type:
    case createPoll.rejected.type:
    case getPoll.fulfilled.type:
    case getPoll.rejected.type:
      return { isLoading: false };
    default:
      return state;
  }
}
