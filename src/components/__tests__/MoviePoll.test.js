import { screen, fireEvent } from "@testing-library/react";
import { useSelector } from "react-redux";
import MoviePoll from "../MoviePoll";
import { render } from "../../test-utils";
import { createPoll } from "../../slices/poll";
import { rest } from "msw";
import { setupServer } from "msw/node";

function addMovies(screen, movies = []) {
  const addMovie = screen.getByText(/add movie/i);
  const titleInput = screen.getByLabelText(/title/i);
  movies.forEach((title) => {
    fireEvent.change(titleInput, { target: { value: title } });
    fireEvent.click(addMovie);
  });
}

function createPollTestReducer(state = { poll: null }, action) {
  switch (action.type) {
    case createPoll.fulfilled.type:
      return { ...state, poll: action.payload.result };
    default:
      return state;
  }
}

// TODO: Consider moving mocked API calls to a mocks folder. See
// https://mswjs.io/docs/getting-started/mocks
// for an example.
const handlers = [
  rest.post("/polls", (req, res, ctx) => {
    return res(ctx.status(201), ctx.json(req.body));
  }),
];
const server = setupServer(...handlers);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test("renders create MoviePoll", () => {
  render(<MoviePoll create={true} />);
  const addMovie = screen.getByText(/add movie/i);
  expect(addMovie).toBeInTheDocument();
});

test("should add a movie", () => {
  const testMovie = "Star Wars";
  render(<MoviePoll create={true} />);
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
  render(<MoviePoll create={true} />);
  addMovies(screen, movies);
  const createPoll = screen.getByText(/create poll/i);
  expect(createPoll).toBeInTheDocument();
});

test("should remove a movie", () => {
  const testMovie = "Star Wars";
  render(<MoviePoll create={true} />);
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
  const TEST_ID = "should-create-poll-success";
  function Test() {
    const firstTitle = useSelector((state) =>
      state.test.poll ? state.test.poll.choices[0].title : ""
    );
    return firstTitle && <span data-testid={TEST_ID}>{firstTitle}</span>;
  }
  render(
    <>
      <MoviePoll create={true} />
      <Test />
    </>,
    {
      reducers: {
        test: createPollTestReducer,
      },
    }
  );
  addMovies(screen, ["Soul", "Up"]);
  const createPoll = screen.getByText(/create poll/i);
  fireEvent.click(createPoll);
  expect(await screen.findByTestId(TEST_ID)).toBeInTheDocument();
});
