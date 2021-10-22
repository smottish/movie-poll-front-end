import { render, screen } from '@testing-library/react';
import App from '../App';

test('renders App container', () => {
  render(<App />);
  const app = screen.getByTestId('app-container');
  expect(app).toBeInTheDocument();
});