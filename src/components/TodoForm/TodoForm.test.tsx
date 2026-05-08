import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TodoForm } from './TodoForm';

describe('TodoForm', () => {
  it('renders the input and submit button', () => {
    render(<TodoForm onAdd={vi.fn()} />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add/i })).toBeInTheDocument();
  });

  it('submit button is disabled when input is empty', () => {
    render(<TodoForm onAdd={vi.fn()} />);
    expect(screen.getByRole('button', { name: /add/i })).toBeDisabled();
  });

  it('submit button is disabled when input is only whitespace', async () => {
    render(<TodoForm onAdd={vi.fn()} />);
    await userEvent.type(screen.getByRole('textbox'), '   ');
    expect(screen.getByRole('button', { name: /add/i })).toBeDisabled();
  });

  it('submit button is enabled when input has text', async () => {
    render(<TodoForm onAdd={vi.fn()} />);
    await userEvent.type(screen.getByRole('textbox'), 'Buy milk');
    expect(screen.getByRole('button', { name: /add/i })).toBeEnabled();
  });

  it('calls onAdd with the input value when form is submitted', async () => {
    const onAdd = vi.fn();
    render(<TodoForm onAdd={onAdd} />);
    await userEvent.type(screen.getByRole('textbox'), 'Buy milk');
    await userEvent.click(screen.getByRole('button', { name: /add/i }));
    expect(onAdd).toHaveBeenCalledWith('Buy milk');
  });

  it('clears the input after submission', async () => {
    render(<TodoForm onAdd={vi.fn()} />);
    const input = screen.getByRole('textbox');
    await userEvent.type(input, 'Buy milk');
    await userEvent.click(screen.getByRole('button', { name: /add/i }));
    expect(input).toHaveValue('');
  });

  it('calls onAdd when Enter is pressed', async () => {
    const onAdd = vi.fn();
    render(<TodoForm onAdd={onAdd} />);
    await userEvent.type(screen.getByRole('textbox'), 'Buy milk{enter}');
    expect(onAdd).toHaveBeenCalledWith('Buy milk');
  });
});
