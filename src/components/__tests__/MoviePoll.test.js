import { screen, fireEvent } from "@testing-library/react";
import MoviePollCreate from "../MoviePollCreate";
import MoviePollDetails from "../MoviePollDetails";
import { render } from "../../test-utils";
import { rest } from "msw";
import { setupServer } from "msw/node";
import { MemoryRouter, Route } from "react-router-dom";

let isCreatePollError = false;

const TEST_POLL = {
  id: 1,
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
    {
      id: 3,
      pollId: 1,
      title: "Star Wars: Return of the Jedi",
    },
  ],
  link: "http://example.com/polls/1",
};

function addMovies(screen, movies = []) {
  const addMovie = screen.getByText(/add movie/i);
  const titleInput = screen.getByLabelText(/title/i);
  movies.forEach((title) => {
    fireEvent.change(titleInput, { target: { value: title } });
    fireEvent.click(addMovie);
  });
}

// TODO: Consider moving mocked API calls to a mocks folder. See
// https://mswjs.io/docs/getting-started/mocks
// for an example.
const handlers = [
  rest.post("/polls", (req, res, ctx) => {
    if (isCreatePollError) {
      return res(ctx.status(500));
    } else {
      return res(ctx.status(201), ctx.json(req.body));
    }
  }),
  rest.get("/polls/:id", (req, res, ctx) => {
    const { id } = req.params;
    if (id === "error") {
      return res(ctx.status(404));
    } else {
      return res(ctx.status(200), ctx.json(TEST_POLL));
    }
  }),
];
const server = setupServer(...handlers);

beforeAll(() => server.listen());
afterEach(() => {
  server.resetHandlers();
  isCreatePollError = false;
});
afterAll(() => server.close());

test("renders create movie poll", () => {
  render(<MoviePollCreate />);
  const addMovie = screen.getByText(/add movie/i);
  expect(addMovie).toBeInTheDocument();
});

test("should add a movie", () => {
  const testMovie = "Star Wars";
  render(<MoviePollCreate />);
  const addMovie = screen.getByText(/add movie/i);
  const title = screen.getByLabelText(/title/i);
  fireEvent.change(title, { target: { value: testMovie } });
  fireEvent.click(addMovie);
  const movie = screen.getByText(testMovie);
  const create = screen.queryByText(/create poll/i);
  expect(movie).toBeInTheDocument();
  expect(create).toBeNull();
});

test("should be a button to create poll", () => {
  const movies = ["Soul", "Up"];
  render(<MoviePollCreate />);
  addMovies(screen, movies);
  const createPoll = screen.getByText(/create poll/i);
  expect(createPoll).toBeInTheDocument();
});

test("should remove a movie", () => {
  const testMovie = "Star Wars";
  render(<MoviePollCreate />);
  const addMovie = screen.getByText(/add movie/i);
  const title = screen.getByLabelText(/title/i);
  fireEvent.change(title, { target: { value: testMovie } });
  fireEvent.click(addMovie);
  const remove = screen.getByTestId(`remove ${testMovie}`);
  fireEvent.click(remove);
  const movie = screen.queryByText(testMovie);
  expect(movie).toBeNull();
});

test("should create a poll", async () => {
  render(<MoviePollCreate />);
  addMovies(screen, ["Soul", "Up"]);
  const createPoll = screen.getByText(/create poll/i);
  fireEvent.click(createPoll);
  expect(await screen.findByTestId("create-poll-success")).toBeInTheDocument();
});

test("create poll failure should display error", async () => {
  isCreatePollError = true;
  render(<MoviePollCreate />);
  addMovies(screen, ["Soul", "Up"]);
  const createPoll = screen.getByText(/create poll/i);
  fireEvent.click(createPoll);
  expect(await screen.findByTestId("create-poll-failure")).toBeInTheDocument();
});

test("create another poll", async () => {
  render(<MoviePollCreate />);
  addMovies(screen, ["Soul", "Up"]);
  const createPoll = screen.getByText(/create poll/i);
  fireEvent.click(createPoll);
  expect(await screen.findByTestId("create-poll-success")).toBeInTheDocument();
  const createAnother = screen.getByText(/create another/i);
  fireEvent.click(createAnother);
  expect(screen.queryByTestId("create-poll-success")).not.toBeInTheDocument();
});

test("should display a poll", async () => {
  render(
    <MemoryRouter initialEntries={["/polls/1"]}>
      <Route path="/polls/:id">
        <MoviePollDetails />
      </Route>
    </MemoryRouter>
  );
  const voteBtn = await screen.findByTestId(
    `vote ${TEST_POLL.choices[0].title}`
  );
  expect(voteBtn).toBeInTheDocument();
});

test("should display an error", async () => {
  render(
    <MemoryRouter initialEntries={["/polls/error"]}>
      <Route path="/polls/:id">
        <MoviePollDetails />
      </Route>
    </MemoryRouter>
  );
  const error = await screen.findByTestId("get-poll-failure");
  expect(error).toBeInTheDocument();
});
