import { render, screen, fireEvent } from "@testing-library/react";
import MoviePoll from "../MoviePoll";

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
  const addMovie = screen.getByText(/add movie/i);
  const titleInput = screen.getByLabelText(/title/i);
  movies.forEach((title) => {
    fireEvent.change(titleInput, { target: { value: title } });
    fireEvent.click(addMovie);
  });
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
