import { screen } from "@testing-library/react";
import App from "../App";
import { render } from "../../test-utils";

beforeEach(() => {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: jest.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });
});

test("renders App container", () => {
  render(<App />);
  const app = screen.getByTestId("app-container");
  expect(app).toBeInTheDocument();
});
