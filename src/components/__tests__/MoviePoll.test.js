import { screen, fireEvent } from "@testing-library/react";
import MoviePoll from "../MoviePoll";
import { render } from "../../test-utils";
import { rest } from "msw";
import { setupServer } from "msw/node";

let isCreatePollError = false;

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
];
const server = setupServer(...handlers);

beforeAll(() => server.listen());
afterEach(() => {
  server.resetHandlers();
  isCreatePollError = false;
});
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
  render(<MoviePoll create={true} />);
  addMovies(screen, ["Soul", "Up"]);
  const createPoll = screen.getByText(/create poll/i);
  fireEvent.click(createPoll);
  expect(await screen.findByTestId("create-poll-success")).toBeInTheDocument();
});

test("create poll failure should display error", async () => {
  isCreatePollError = true;
  render(<MoviePoll create={true} />);
  addMovies(screen, ["Soul", "Up"]);
  const createPoll = screen.getByText(/create poll/i);
  fireEvent.click(createPoll);
  expect(await screen.findByTestId("create-poll-failure")).toBeInTheDocument();
});

test("create another poll", async () => {
  render(<MoviePoll create={true} />);
  addMovies(screen, ["Soul", "Up"]);
  const createPoll = screen.getByText(/create poll/i);
  fireEvent.click(createPoll);
  expect(await screen.findByTestId("create-poll-success")).toBeInTheDocument();
  const createAnother = screen.getByText(/create another/i);
  fireEvent.click(createAnother);
  expect(screen.queryByTestId("create-poll-success")).not.toBeInTheDocument();
});
