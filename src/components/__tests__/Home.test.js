import { render, screen } from "@testing-library/react";
import Home from "../Home";

test("renders Home", () => {
  render(<Home />);
  const createButton = screen.getByText(/create a poll/i);
  expect(createButton).toBeInTheDocument();
});
