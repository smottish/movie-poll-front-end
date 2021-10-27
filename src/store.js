import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import loading from "./slices/loading";
import poll from "./slices/poll";

export const defaultReducers = {
  loading,
  poll,
};

const rootReducer = combineReducers(defaultReducers);

// This is the same as 'devToolsEnhancer' from 'redux-devtools-extension/developmentOnly'
// (which is basically the same as 'devToolsEnhancer' from '@reduxjs/toolkit')
const devToolsEnhancer =
  process.env.NODE_ENV !== "production" &&
  typeof window !== "undefined" &&
  window.__REDUX_DEVTOOLS_EXTENSION__
    ? window.__REDUX_DEVTOOLS_EXTENSION__
    : function () {
        return function (noop) {
          return noop;
        };
      };

export const defaultMiddlewares = [thunk];

// Note: this is produces basically the same result as calling
// configureStore({
//   reducer: rootReducer,
//   devTools: process.env.NODE_ENV !== "production",
// })
// where configureStore is from "@reduxjs/toolkit" (configureStore
// includes redux-thunk by default and effectively does the below
// compose step for you.)
const store = createStore(
  rootReducer,
  compose(
    applyMiddleware(...defaultMiddlewares),
    // If you want to change Redux DevTools configuration, pass an 'options'
    // object to devToolsEnhancer. See the following link for the available
    // options:
    // https://github.com/zalmoxisus/redux-devtools-extension/blob/master/docs/API/Arguments.md
    devToolsEnhancer()
  )
);

export default store;
