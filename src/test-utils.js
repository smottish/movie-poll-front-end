import { render as rtlRender } from "@testing-library/react";
import defaultStore, { defaultReducers, defaultMiddlewares } from "./store";
import { Provider } from "react-redux";
import { applyMiddleware, combineReducers, createStore } from "redux";

export function render(ui, { store = defaultStore, reducers = {} } = {}) {
  let finalStore = store;
  function ReduxWrapper({ children }) {
    return <Provider store={finalStore}>{children}</Provider>;
  }

  let finalReducers;
  if (Object.keys(reducers).length > 0) {
    finalReducers = {
      ...defaultReducers,
      ...reducers,
    };
  }

  if (finalReducers) {
    finalStore = createStore(
      combineReducers(finalReducers),
      applyMiddleware(...defaultMiddlewares)
    );
  }

  const wrapper = finalStore ? ReduxWrapper : undefined;
  return rtlRender(ui, { wrapper });
}
