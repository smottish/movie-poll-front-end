/**
 * Create an action creator function
 *
 * This is a simplified implementation of RTK's createAction
 *
 * Example:
 * const showMessage = createAction("message/show")
 *
 * Where:
 *  showMessage.type is "message/show"
 *  showMessage("my message") returns { type: "message/show", payload: "my message" }
 *
 * @param {string} type - value to be used for the action's type field
 * @param {Function} prepareAction - function that accepts all the arguments
 *  passed to the action creator and returns the object that will be assigned to
 *  the action's payload field. If not provided, the first argument passed to the
 *  action creator will be assigned to the action's payload field.
 * @returns an action creator function that returns an action with a type and
 *  payload field (i.e. { type: "...", payload: ... }). The returned function also
 *  has a type property which is assigned the value action's type. It also has an
 *  overridden toString method which returns the action's type.
 */
export function createAction(type, prepareAction) {
  const actionCreator = function (...args) {
    let payload = args[0];
    if (prepareAction) {
      payload = prepareAction(...args);
      if (!payload) {
        throw new Error("prepareAction did not return an object");
      }
    }
    return {
      type,
      payload,
    };
  };

  actionCreator.toString = () => `${type}`;
  actionCreator.type = type;
  return actionCreator;
}

/**
 * Create an async (a.k.a. thunk) action creator
 *
 * Generates pending, fulfilled and rejected action creators in
 * addition to the async thunk action creator.
 *
 * This is a simplified implementation of RTK's createAsyncThunk
 *
 * Example:
 * const getData = createAsyncAction("data/get", async (id, { dispatch, getState }) => {
 *    // Have access to store dispatch and getState, if necessary
 *    return await apiGetData(id)
 * })
 * dispatch(getData(id))
 *
 * Explanation:
 *
 * Calling createAsyncAction will generate action creators by calling
 * createAction(`data/get/${lifecycle}`) where lifecycle is pending,
 * fulfilled and rejected. These action creators are assigned to
 * the pending, fulfilled and rejected properties of getData, respectively.
 *
 * See calls to createAction() below to see what's in the payload
 * of each of the above actions.
 *
 * Calling getData(id) will:
 * 1) Dispatch the "data/get/pending" action
 * 2) Call payloadCreator (the second argument to createAsyncAction) and wait
 *    for it to resolve/reject
 * 3) If it resolves, dispatch the "data/get/fulfilled" action
 * 4) If it rejects, dispatch the "data/get/rejected" action
 * 5) Return the resolved or rejected action
 *
 * @param {string} type - used as a prefix to generate pending, fulfilled
 *  and rejected action types.
 * @param {Function} payloadCreator - callback function that should return a
 *  promise (which it will if it's an async function). If there's an error,
 *  it should return a rejected promise. The function will be called with
 *  two arguments: 1) the first parameter passed to the thunk action creator,
 *  2) An object containing the Redux store dispatch and getState methods.
 * @returns a thunk action creator (i.e. function) that accepts a single argument.
 *  The function also has fulfilled, pending and rejected properties that are
 *  assigned to the plain action creators generated by createAsyncAction.
 */
export function createAsyncAction(type, payloadCreator) {
  const pending = createAction(`${type}/pending`, (arg) => ({
    meta: {
      arg,
    },
  }));

  const fulfilled = createAction(`${type}/fulfilled`, (result, arg) => ({
    result,
    meta: {
      arg,
    },
  }));

  const rejected = createAction(`${type}/rejected`, (error, arg) => ({
    error,
    meta: {
      arg,
    },
  }));

  const thunkActionCreator = function (arg) {
    return async (dispatch, getState) => {
      let finalAction;

      dispatch(pending(arg));
      try {
        const result = await payloadCreator(arg, { dispatch, getState });
        finalAction = fulfilled(result, arg);
      } catch (err) {
        finalAction = rejected(err, arg);
      }

      dispatch(finalAction);
      return finalAction;
    };
  };

  return Object.assign(thunkActionCreator, {
    pending,
    fulfilled,
    rejected,
  });
}
