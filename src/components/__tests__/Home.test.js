import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Home from "../Home";
import { rest } from "msw";
import { setupServer } from "msw/node";

const TEST_POLLS = [
  {
    id: 1,
    title: "Monday Movie Night!",
    choices: [
      {
        id: 1,
        pollId: 1,
        title: "Star Wars: A New Hope",
      },
      {
        id: 2,
        pollId: 1,
        title: "Star Wars: Empire Strikes Back",
      },
    ],
    link: "http://example.com/polls/1",
  },
  {
    id: 2,
    title: "Tuesday Movie Night!",
    choices: [
      {
        id: 3,
        pollId: 1,
        title: "Star Wars: The Phantom Menace",
      },
      {
        id: 4,
        pollId: 1,
        title: "Star Wars: Attack of the Clones",
      },
    ],
    link: "http://example.com/polls/2",
  },
];

const handlers = [
  rest.get("/polls", (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(TEST_POLLS));
  }),
];
const server = setupServer(...handlers);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test("Home should show recent polls", async () => {
  // Home doesn't use redux hooks and this test won't use
  // do any navigating, so we don't need any routes.
  render(
    <MemoryRouter>
      <Home />
    </MemoryRouter>
  );

  for (let i = 0; i < TEST_POLLS.length; i++) {
    const poll = await screen.findByText(TEST_POLLS[i].title);
    expect(poll).toBeInTheDocument();
  }
});
