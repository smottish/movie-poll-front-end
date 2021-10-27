import { createPoll as apiCreatePoll } from "../api";
import { createAsyncAction } from "./utils";

export const createPoll = createAsyncAction("poll/create", async (poll) => {
  return await apiCreatePoll(poll);
});

export default function reducer(state = {}, action) {
  switch (action.type) {
    // E.g.
    // case createPoll.pending.type:
    //   return state;
    // case createPoll.fullfilled.type:
    //   return state;
    // case createPoll.rejected.type:
    //   return state;
    default:
      return state;
  }
}
