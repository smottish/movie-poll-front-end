import { createPoll } from "./poll";

export default function reducer(state = { show: false }, action) {
  switch (action.type) {
    case createPoll.pending.type:
      return { show: true };
    case createPoll.fulfilled.type:
    case createPoll.rejected.type:
      return { show: false };
    default:
      return state;
  }
}
